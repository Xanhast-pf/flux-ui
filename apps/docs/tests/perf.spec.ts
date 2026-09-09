import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { expect, test } from "@playwright/test";
import type {
  PerfResult,
  PerfScenario,
  PerfVariant,
} from "../src/perf/PerfApp.js";

type PerfReference = Extract<PerfVariant, "raw" | "native">;

interface MetricSet {
  mount: number;
  mountToFrame: number;
  update: number;
  updateToFrame: number;
  unmount: number;
}

interface ScenarioSummary {
  count: number;
  reference: PerfReference;
  medians: Record<PerfVariant, MetricSet>;

  /**
   * Median of the per-iteration Flux/reference ratios.
   *
   * Ratios are paired before taking the median so temporary runner
   * slowdowns affect Flux and its reference as equally as possible.
   */
  ratios: MetricSet;
}

interface PerfBaseline {
  schemaVersion: 1;
  policyVersion: 2;
  scenarios: Record<PerfScenario, ScenarioSummary>;
}

interface ScenarioConfig {
  name: PerfScenario;
  reference: PerfReference;
}

const baselinePath = resolve(
  import.meta.dirname,
  "../../../tooling/perf/baseline.json",
);

const mode = process.env.FLUX_PERF_MODE ?? "full";
const isSmoke = mode === "smoke";
const shouldUpdate = mode === "update";

const iterations = isSmoke ? 3 : 15;
const count = isSmoke ? 250 : 1_000;

const scenarios: ScenarioConfig[] = [
  { name: "button", reference: "native" },
  { name: "grid", reference: "native" },
];

const regressionPolicy = {
  relativePercent: 25,
  minimumRatioDelta: 0.2,

  // Do not fail CI over sub-microsecond-per-instance noise.
  minimumOverheadPerInstanceMs: 0.001,
} as const;

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const value = sorted[middle];

  if (value === undefined) {
    throw new Error("Cannot calculate an empty median.");
  }

  if (sorted.length % 2 === 1) {
    return value;
  }

  const previous = sorted[middle - 1];

  if (previous === undefined) {
    throw new Error("Median pair is incomplete.");
  }

  return (previous + value) / 2;
}

function toMetricSet(result: PerfResult): MetricSet {
  return {
    mount: result.mountMs,
    mountToFrame: result.mountToFrameMs,
    update: result.updateMs,
    updateToFrame: result.updateToFrameMs,
    unmount: result.unmountMs,
  };
}

function metricMedians(results: PerfResult[]): MetricSet {
  const metrics = results.map(toMetricSet);

  return {
    mount: median(metrics.map((metric) => metric.mount)),
    mountToFrame: median(metrics.map((metric) => metric.mountToFrame)),
    update: median(metrics.map((metric) => metric.update)),
    updateToFrame: median(metrics.map((metric) => metric.updateToFrame)),
    unmount: median(metrics.map((metric) => metric.unmount)),
  };
}

function ratio(flux: number, reference: number): number {
  return reference <= 0 ? 1 : flux / reference;
}

function calculatePairedRatios(
  fluxResults: PerfResult[],
  referenceResults: PerfResult[],
): MetricSet {
  if (fluxResults.length !== referenceResults.length) {
    throw new Error(
      `Performance sample counts differ: Flux=${fluxResults.length}, reference=${referenceResults.length}.`,
    );
  }

  const mount: number[] = [];
  const mountToFrame: number[] = [];
  const update: number[] = [];
  const updateToFrame: number[] = [];
  const unmount: number[] = [];

  for (let index = 0; index < fluxResults.length; index += 1) {
    const fluxResult = fluxResults[index];
    const referenceResult = referenceResults[index];

    if (fluxResult === undefined || referenceResult === undefined) {
      throw new Error(`Missing performance sample pair at index ${index}.`);
    }

    mount.push(ratio(fluxResult.mountMs, referenceResult.mountMs));

    mountToFrame.push(
      ratio(fluxResult.mountToFrameMs, referenceResult.mountToFrameMs),
    );

    update.push(ratio(fluxResult.updateMs, referenceResult.updateMs));

    updateToFrame.push(
      ratio(fluxResult.updateToFrameMs, referenceResult.updateToFrameMs),
    );

    unmount.push(ratio(fluxResult.unmountMs, referenceResult.unmountMs));
  }

  return {
    mount: median(mount),
    mountToFrame: median(mountToFrame),
    update: median(update),
    updateToFrame: median(updateToFrame),
    unmount: median(unmount),
  };
}

function formatMs(value: number): string {
  return `${value.toFixed(2)} ms`;
}

function formatRatio(value: number): string {
  return `${value.toFixed(2)}× (${((value - 1) * 100).toFixed(1)}%)`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseMetricSet(value: unknown, context: string): MetricSet {
  if (!isRecord(value)) {
    throw new Error(`${context} must be an object.`);
  }

  const mount = value["mount"];
  const mountToFrame = value["mountToFrame"];
  const update = value["update"];
  const updateToFrame = value["updateToFrame"];
  const unmount = value["unmount"];

  if (typeof mount !== "number" || !Number.isFinite(mount)) {
    throw new Error(`${context}.mount must be a finite number.`);
  }

  if (typeof mountToFrame !== "number" || !Number.isFinite(mountToFrame)) {
    throw new Error(`${context}.mountToFrame must be a finite number.`);
  }

  if (typeof update !== "number" || !Number.isFinite(update)) {
    throw new Error(`${context}.update must be a finite number.`);
  }

  if (typeof updateToFrame !== "number" || !Number.isFinite(updateToFrame)) {
    throw new Error(`${context}.updateToFrame must be a finite number.`);
  }

  if (typeof unmount !== "number" || !Number.isFinite(unmount)) {
    throw new Error(`${context}.unmount must be a finite number.`);
  }

  return {
    mount,
    mountToFrame,
    update,
    updateToFrame,
    unmount,
  };
}

function parseScenarioSummary(
  value: unknown,
  scenario: PerfScenario,
): ScenarioSummary {
  if (!isRecord(value)) {
    throw new Error(`${scenario} baseline must be an object.`);
  }

  const countValue = value["count"];
  const reference = value["reference"];
  const medians = value["medians"];
  const ratios = value["ratios"];

  if (
    typeof countValue !== "number" ||
    !Number.isInteger(countValue) ||
    countValue <= 0
  ) {
    throw new Error(`${scenario}.count must be a positive integer.`);
  }

  if (reference !== "raw" && reference !== "native") {
    throw new Error(`${scenario}.reference must be either "raw" or "native".`);
  }

  if (!isRecord(medians)) {
    throw new Error(`${scenario}.medians must be an object.`);
  }

  return {
    count: countValue,
    reference,
    medians: {
      raw: parseMetricSet(medians["raw"], `${scenario}.medians.raw`),
      native: parseMetricSet(medians["native"], `${scenario}.medians.native`),
      flux: parseMetricSet(medians["flux"], `${scenario}.medians.flux`),
    },
    ratios: parseMetricSet(ratios, `${scenario}.ratios`),
  };
}

function parsePerfBaseline(value: unknown): PerfBaseline {
  if (!isRecord(value)) {
    throw new Error("Performance baseline must be an object.");
  }

  if (value["schemaVersion"] !== 1) {
    throw new Error("Unsupported performance baseline schemaVersion.");
  }

  if (value["policyVersion"] !== 2) {
    throw new Error(
      "Unsupported performance baseline policyVersion. Regenerate it with `pnpm perf:update`.",
    );
  }

  const scenariosValue = value["scenarios"];

  if (!isRecord(scenariosValue)) {
    throw new Error("Performance baseline scenarios must be an object.");
  }

  return {
    schemaVersion: 1,
    policyVersion: 2,
    scenarios: {
      button: parseScenarioSummary(scenariosValue["button"], "button"),
      grid: parseScenarioSummary(scenariosValue["grid"], "grid"),
    },
  };
}

async function readBaseline(): Promise<PerfBaseline | null> {
  try {
    const rawBaseline: unknown = JSON.parse(
      await readFile(baselinePath, "utf8"),
    );

    return parsePerfBaseline(rawBaseline);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

function assertRegression(
  scenario: PerfScenario,
  metric: keyof MetricSet,
  currentRatio: number,
  baselineRatio: number,
  currentFluxMs: number,
  currentReferenceMs: number,
  instanceCount: number,
): void {
  const currentOverheadMs = currentFluxMs - currentReferenceMs;

  const minimumMeaningfulOverheadMs =
    regressionPolicy.minimumOverheadPerInstanceMs * instanceCount;

  // Ratios become unstable when the underlying timings are only a few
  // milliseconds apart. Ignore differences that are insignificant in
  // absolute runtime cost.
  if (currentOverheadMs <= minimumMeaningfulOverheadMs) {
    return;
  }

  // A historical result below native cost is measurement noise, not a
  // performance level future runs should be required to preserve.
  const normalizedBaselineRatio = Math.max(1, baselineRatio);

  const allowedRatio = Math.max(
    normalizedBaselineRatio * (1 + regressionPolicy.relativePercent / 100),
    normalizedBaselineRatio + regressionPolicy.minimumRatioDelta,
  );

  expect(
    currentRatio,
    [
      `${scenario} ${metric} overhead regressed:`,
      `${formatRatio(currentRatio)} vs baseline ${formatRatio(baselineRatio)}`,
      `(allowed ${formatRatio(allowedRatio)}).`,
      `Absolute overhead: ${formatMs(currentOverheadMs)} across ${instanceCount} instances.`,
    ].join(" "),
  ).toBeLessThanOrEqual(allowedRatio);
}

function assertValidSample(sample: PerfResult): void {
  expect(Number.isFinite(sample.mountMs)).toBe(true);
  expect(Number.isFinite(sample.mountToFrameMs)).toBe(true);
  expect(Number.isFinite(sample.updateMs)).toBe(true);
  expect(Number.isFinite(sample.updateToFrameMs)).toBe(true);
  expect(Number.isFinite(sample.unmountMs)).toBe(true);
  expect(sample.domNodes).toBeGreaterThan(0);
}

function logMetrics(label: string, metrics: MetricSet): void {
  console.log(
    `  ${label.padEnd(7)} mount ${formatMs(metrics.mount)} · frame ${formatMs(metrics.mountToFrame)}`,
  );

  console.log(
    `          update ${formatMs(metrics.update)} · frame ${formatMs(metrics.updateToFrame)} · unmount ${formatMs(metrics.unmount)}`,
  );
}

function logRatios(ratios: MetricSet): void {
  console.log(
    `  tax     mount ${formatRatio(ratios.mount)} · frame ${formatRatio(ratios.mountToFrame)}`,
  );

  console.log(
    `          update ${formatRatio(ratios.update)} · frame ${formatRatio(ratios.updateToFrame)} · unmount ${formatRatio(ratios.unmount)}`,
  );
}

test("Flux runtime overhead stays close to native browser baselines", async ({
  page,
}) => {
  test.setTimeout(isSmoke ? 90_000 : 180_000);

  const summaries = {} as Record<PerfScenario, ScenarioSummary>;

  for (const scenario of scenarios) {
    const samples: Record<PerfVariant, PerfResult[]> = {
      raw: [],
      native: [],
      flux: [],
    };

    for (let iteration = 0; iteration < iterations; iteration += 1) {
      const order: PerfVariant[] =
        iteration % 2 === 0
          ? ["raw", "native", "flux"]
          : ["flux", "native", "raw"];

      for (const variant of order) {
        await page.goto(
          `/?perf=1&scenario=${scenario.name}&variant=${variant}&count=${count}`,
        );

        await page.waitForFunction(
          () => window.__FLUX_PERF_RESULT__ !== undefined,
        );

        const result = await page.evaluate(() => window.__FLUX_PERF_RESULT__);

        if (result === undefined) {
          throw new Error("Perf result was not published.");
        }

        samples[variant].push(result);
      }
    }

    const medians: Record<PerfVariant, MetricSet> = {
      raw: metricMedians(samples.raw),
      native: metricMedians(samples.native),
      flux: metricMedians(samples.flux),
    };

    const ratios = calculatePairedRatios(
      samples.flux,
      samples[scenario.reference],
    );

    summaries[scenario.name] = {
      count,
      reference: scenario.reference,
      medians,
      ratios,
    };

    console.log(
      `\n${scenario.name} × ${count} — reference: ${scenario.reference}`,
    );

    logMetrics("raw", medians.raw);
    logMetrics("native", medians.native);
    logMetrics("Flux", medians.flux);
    logRatios(ratios);

    for (const variant of Object.keys(samples) as PerfVariant[]) {
      for (const sample of samples[variant]) {
        assertValidSample(sample);
      }
    }
  }

  const nextBaseline: PerfBaseline = {
    schemaVersion: 1,
    policyVersion: 2,
    scenarios: summaries,
  };

  if (shouldUpdate) {
    await mkdir(dirname(baselinePath), { recursive: true });

    await writeFile(baselinePath, `${JSON.stringify(nextBaseline, null, 2)}\n`);

    console.log(`\nUpdated ${baselinePath}`);
    return;
  }

  if (isSmoke) {
    return;
  }

  const baseline = await readBaseline();

  expect(
    baseline,
    "No runtime performance baseline. Run `pnpm perf:update` and commit tooling/perf/baseline.json.",
  ).not.toBeNull();

  if (baseline === null) {
    return;
  }

  for (const scenario of scenarios) {
    const current = summaries[scenario.name].ratios;
    const previous = baseline.scenarios[scenario.name].ratios;

    assertRegression(
      scenario.name,
      "mount",
      current.mount,
      previous.mount,
      summaries[scenario.name].medians.flux.mount,
      summaries[scenario.name].medians[scenario.reference].mount,
      summaries[scenario.name].count,
    );
    assertRegression(
      scenario.name,
      "update",
      current.update,
      previous.update,
      summaries[scenario.name].medians.flux.update,
      summaries[scenario.name].medians[scenario.reference].update,
      summaries[scenario.name].count,
    );

    assertRegression(
      scenario.name,
      "unmount",
      current.unmount,
      previous.unmount,
      summaries[scenario.name].medians.flux.unmount,
      summaries[scenario.name].medians[scenario.reference].unmount,
      summaries[scenario.name].count,
    );
  }
});
