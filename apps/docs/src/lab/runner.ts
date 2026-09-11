import type { PerfResult, PerfScenario, PerfVariant } from "../perf/PerfApp.js";
import {
  INSTANCE_COUNTS,
  summarize,
  validateConfig,
  type LabSummary,
  type SamplePair,
} from "./statistics.js";

export interface LabConfig {
  scenario: PerfScenario;
  count: number;
  iterations: number;
  sweep: boolean;
}
export interface LabReport {
  schemaVersion: 1;
  measuredAt: string;
  buildCommit: string | null;
  environment: {
    userAgent: string;
    viewport: { width: number; height: number };
    production: boolean;
  };
  methodology: string;
  config: LabConfig;
  summaries: LabSummary[];
}

type MeasuredSample = PerfResult & {
  viewport: { width: number; height: number };
};

function measure(
  container: HTMLElement,
  config: LabConfig,
  count: number,
  variant: PerfVariant,
  signal: AbortSignal,
): Promise<MeasuredSample> {
  signal.throwIfAborted();
  if (document.hidden)
    return Promise.reject(new Error("Keep this tab visible while measuring."));
  return new Promise((resolve, reject) => {
    const frame = document.createElement("iframe");
    frame.title = `Benchmark ${variant} ${config.scenario}`;
    frame.tabIndex = -1;
    const url = new URL(window.location.href);
    url.hash = "";
    url.search = new URLSearchParams({
      perf: "1",
      scenario: config.scenario,
      variant,
      count: String(count),
    }).toString();
    const startedAt = performance.now();
    const cleanup = () => {
      window.clearInterval(interval);
      signal.removeEventListener("abort", onAbort);
      frame.remove();
    };
    const onAbort = () => {
      cleanup();
      reject(
        new Error("Measurement stopped. No partial result was published."),
      );
    };
    const interval = window.setInterval(() => {
      try {
        signal.throwIfAborted();
        if (performance.now() - startedAt > 10_000)
          throw new Error(
            "A sample exceeded its time budget. Try fewer instances.",
          );
        const result = frame.contentWindow?.__FLUX_PERF_RESULT__;
        if (result === undefined) return;
        if (
          result.scenario !== config.scenario ||
          result.variant !== variant ||
          result.count !== count
        )
          throw new Error("Unexpected benchmark result.");
        for (const key of [
          "mountMs",
          "updateMs",
          "unmountMs",
          "mountToFrameMs",
          "updateToFrameMs",
          "domNodes",
        ] as const) {
          if (!Number.isFinite(result[key]) || result[key] < 0)
            throw new Error("Invalid benchmark sample.");
        }
        const measured = {
          ...result,
          viewport: { width: frame.clientWidth, height: frame.clientHeight },
        };
        cleanup();
        resolve(measured);
      } catch (error) {
        cleanup();
        reject(
          error instanceof Error ? error : new Error("Measurement failed."),
        );
      }
    }, 25);
    signal.addEventListener("abort", onAbort, { once: true });
    frame.src = url.href;
    container.replaceChildren(frame);
  });
}

export async function runLab(
  container: HTMLElement,
  config: LabConfig,
  signal: AbortSignal,
  progress: (message: string) => void,
): Promise<LabReport> {
  validateConfig(config.count, config.iterations);
  const counts = config.sweep
    ? INSTANCE_COUNTS.filter((count) => count <= config.count)
    : [config.count];
  const summaries: LabSummary[] = [];
  let renderViewport = { width: 0, height: 0 };
  for (const count of counts) {
    progress(`Warm-up · ${count.toLocaleString()} instances`);
    const warmup = await measure(container, config, count, "native", signal);
    renderViewport = warmup.viewport;
    await measure(container, config, count, "flux", signal);
    const pairs: SamplePair[] = [];
    for (let iteration = 0; iteration < config.iterations; iteration += 1) {
      progress(
        `${count.toLocaleString()} instances · pair ${iteration + 1} of ${config.iterations}`,
      );
      if (iteration % 2 === 0) {
        const native = await measure(
          container,
          config,
          count,
          "native",
          signal,
        );
        const flux = await measure(container, config, count, "flux", signal);
        pairs.push({ native, flux });
      } else {
        const flux = await measure(container, config, count, "flux", signal);
        const native = await measure(
          container,
          config,
          count,
          "native",
          signal,
        );
        pairs.push({ native, flux });
      }
    }
    summaries.push(summarize(config.scenario, count, pairs));
  }
  return {
    schemaVersion: 1,
    measuredAt: new Date().toISOString(),
    buildCommit: import.meta.env.VITE_BUILD_COMMIT || null,
    environment: {
      userAgent: navigator.userAgent,
      viewport: renderViewport,
      production: import.meta.env.PROD,
    },
    methodology:
      "Equivalent native React reference; one discarded warm-up per variant/count; alternating paired order; medians of paired ratios and deltas. Synchronous React/DOM work, not paint. Same production harness as CI, but a different sample count and render viewport. Device-local diagnostics, not cross-library or certified results.",
    config,
    summaries,
  };
}
