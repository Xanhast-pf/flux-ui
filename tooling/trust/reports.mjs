import { isRecord } from "./evidence.mjs";

const sizeMetrics = ["raw", "gzip", "brotli"];

function validateSizeReport(data) {
  if (data.schemaVersion !== 2)
    throw new Error(
      `Unsupported size evidence schema: expected 2, received ${String(data.schemaVersion)}.`,
    );
  // Review/update commands can succeed without passing baseline regressions.
  // They are proposals, never release evidence, even with a complete catalog.
  if (Object.hasOwn(data, "baselineChanges"))
    throw new Error("Size evidence cannot be a baseline proposal.");
  if (
    !Number.isInteger(data.componentCount) ||
    data.componentCount < 1 ||
    data.checkedComponentCount !== data.componentCount ||
    !isRecord(data.components) ||
    Object.keys(data.components).length !== data.componentCount
  )
    throw new Error("Size evidence must cover every component.");

  const slugs = Object.keys(data.components);
  const slugSet = new Set(slugs);
  for (const name of ["emittedGraphs", "bundledEntries", "componentGates"]) {
    const entries = data[name];
    if (
      !isRecord(entries) ||
      Object.keys(entries).length !== slugs.length ||
      Object.keys(entries).some((slug) => !slugSet.has(slug))
    )
      throw new Error(
        `Size evidence ${name} must cover every component exactly once.`,
      );
  }
  const coverage = data.bundledEntryCoverage;
  if (
    !isRecord(coverage) ||
    !Array.isArray(coverage.measured) ||
    coverage.measured.length !== slugs.length ||
    new Set(coverage.measured).size !== slugs.length ||
    coverage.measured.some((slug) => !slugSet.has(slug)) ||
    !Array.isArray(coverage.unmeasured) ||
    coverage.unmeasured.length !== 0
  )
    throw new Error("Size evidence requires complete bundled entry coverage.");
  if (
    !isRecord(data.aggregate) ||
    ["rootEntry", "runtime", "published"].some(
      (name) => !Object.hasOwn(data.aggregate, name),
    )
  )
    throw new Error(
      "Size evidence is missing required aggregate measurements.",
    );

  for (const entries of [
    data.components,
    data.emittedGraphs,
    data.bundledEntries,
    data.aggregate,
  ]) {
    for (const entry of Object.values(entries)) {
      if (
        !isRecord(entry) ||
        sizeMetrics.some(
          (key) => !Number.isFinite(entry[key]) || entry[key] < 0,
        )
      )
        throw new Error("Invalid size measurement.");
    }
  }
  for (const slug of slugs) {
    if (
      sizeMetrics.some(
        (key) => data.components[slug][key] !== data.emittedGraphs[slug][key],
      )
    )
      throw new Error(
        `Size evidence has inconsistent emitted graph metrics for ${slug}.`,
      );
    const gate = data.componentGates[slug];
    if (
      !isRecord(gate) ||
      gate.result !== "pass" ||
      !Array.isArray(gate.absoluteFailures) ||
      gate.absoluteFailures.length !== 0 ||
      !Array.isArray(gate.regressions) ||
      gate.regressions.length !== 0
    )
      throw new Error(
        `Size evidence requires a passing bundled gate for ${slug}.`,
      );
  }
}

export function validateReport(name, data, source) {
  if (!isRecord(data)) throw new Error(`Invalid ${name} report.`);
  if (name === "size.json") {
    validateSizeReport(data);
  } else if (name === "runtime.json") {
    if (
      data.schemaVersion !== 1 ||
      data.mode !== "full" ||
      data.commit !== source.commit ||
      data.iterations !== 15 ||
      data.count !== 1000 ||
      !isRecord(data.summaries) ||
      !Array.isArray(data.rawSamples) ||
      data.rawSamples.length !== 2
    )
      throw new Error(
        "Runtime evidence is incomplete or from a different revision.",
      );
    for (const [index, scenario] of ["button", "grid"].entries()) {
      const entry = data.rawSamples[index];
      if (
        !isRecord(entry) ||
        entry.scenario !== scenario ||
        !isRecord(entry.samples) ||
        !isRecord(data.summaries[scenario])
      )
        throw new Error("Missing runtime scenario.");
      for (const variant of ["raw", "native", "flux"]) {
        const samples = entry.samples[variant];
        if (
          !Array.isArray(samples) ||
          samples.length !== data.iterations ||
          samples.some(
            (sample) =>
              !isRecord(sample) ||
              sample.scenario !== scenario ||
              sample.variant !== variant ||
              sample.count !== data.count ||
              [
                "mountMs",
                "updateMs",
                "unmountMs",
                "mountToFrameMs",
                "updateToFrameMs",
                "domNodes",
              ].some((key) => !Number.isFinite(sample[key]) || sample[key] < 0),
          )
        )
          throw new Error("Incomplete or invalid raw runtime samples.");
      }
    }
  } else if (name === "browser-tests.json" || name === "consumer-tests.json") {
    if (
      !isRecord(data.stats) ||
      !Number.isInteger(data.stats.expected) ||
      data.stats.expected < 1 ||
      data.stats.unexpected !== 0 ||
      data.stats.flaky !== 0 ||
      !Array.isArray(data.errors) ||
      data.errors.length !== 0
    )
      throw new Error(
        "Browser evidence does not show a clean executed test suite.",
      );
  } else throw new Error("Unknown evidence report.");
  return data;
}
