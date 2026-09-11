import type { PerfResult, PerfScenario } from "../perf/PerfApp.js";

export const INSTANCE_COUNTS = [100, 500, 1_000, 2_000, 5_000] as const;
export const ITERATION_COUNTS = [3, 5, 7] as const;
export const METRICS = ["mountMs", "updateMs", "unmountMs"] as const;
export type Metric = (typeof METRICS)[number];
export interface SamplePair {
  native: PerfResult;
  flux: PerfResult;
}
export interface MetricSummary {
  native: number;
  flux: number;
  delta: number;
  ratio: number | null;
  minimum: number;
  maximum: number;
}
export interface LabSummary {
  scenario: PerfScenario;
  count: number;
  metrics: Record<Metric, MetricSummary>;
  pairs: SamplePair[];
}

export function median(values: readonly number[]): number {
  if (values.length === 0 || values.some((value) => !Number.isFinite(value))) {
    throw new Error("A median requires finite, non-empty samples.");
  }
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  const value = sorted[middle];
  if (value === undefined) throw new Error("Missing middle sample.");
  if (sorted.length % 2 !== 0) return value;
  const previous = sorted[middle - 1];
  if (previous === undefined) throw new Error("Missing previous sample.");
  return (previous + value) / 2;
}

export function validateConfig(count: number, iterations: number): void {
  if (
    !INSTANCE_COUNTS.some((value) => value === count) ||
    !ITERATION_COUNTS.some((value) => value === iterations)
  ) {
    throw new Error("Choose a supported instance count and sample count.");
  }
}

export function summarize(
  scenario: PerfScenario,
  count: number,
  pairs: SamplePair[],
): LabSummary {
  if (pairs.length === 0) throw new Error("No complete paired samples.");
  for (const pair of pairs) {
    for (const variant of ["native", "flux"] as const) {
      const sample = pair[variant];
      if (
        sample.scenario !== scenario ||
        sample.count !== count ||
        sample.variant !== variant ||
        METRICS.some((key) => !Number.isFinite(sample[key]) || sample[key] < 0)
      )
        throw new Error("Invalid or mismatched paired sample.");
    }
  }
  const metric = (key: Metric): MetricSummary => {
    const native = pairs.map((pair) => pair.native[key]);
    const flux = pairs.map((pair) => pair.flux[key]);
    const ratios = pairs.map((pair) =>
      pair.native[key] > 0 ? pair.flux[key] / pair.native[key] : null,
    );
    return {
      native: median(native),
      flux: median(flux),
      delta: median(pairs.map((pair) => pair.flux[key] - pair.native[key])),
      // A quantized zero reference is not an infinite slowdown or a fabricated 1×.
      ratio: ratios.every((value) => value !== null) ? median(ratios) : null,
      minimum: Math.min(...flux),
      maximum: Math.max(...flux),
    };
  };
  return {
    scenario,
    count,
    metrics: {
      mountMs: metric("mountMs"),
      updateMs: metric("updateMs"),
      unmountMs: metric("unmountMs"),
    },
    pairs,
  };
}
