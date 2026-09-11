import { isRecord } from "./evidence.mjs";

export function validateReport(name, data, source) {
  if (!isRecord(data)) throw new Error(`Invalid ${name} report.`);
  if (name === "size.json") {
    if (
      data.schemaVersion !== 1 ||
      !Number.isInteger(data.componentCount) ||
      data.componentCount < 1 ||
      data.checkedComponentCount !== data.componentCount ||
      !isRecord(data.components) ||
      Object.keys(data.components).length !== data.componentCount ||
      !isRecord(data.aggregate)
    )
      throw new Error("Size evidence must cover every component.");
    for (const entry of [
      ...Object.values(data.components),
      ...Object.values(data.aggregate),
    ]) {
      if (
        !isRecord(entry) ||
        ["raw", "gzip", "brotli"].some(
          (key) => !Number.isFinite(entry[key]) || entry[key] < 0,
        )
      )
        throw new Error("Invalid size measurement.");
    }
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
  } else if (name === "browser-tests.json") {
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
