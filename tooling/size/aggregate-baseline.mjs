import { isDeepStrictEqual } from "node:util";
import { compressionMethod } from "./lib.mjs";

// Version the deterministic production/measurement contract, not the machine or Git tree.
export const aggregateMethod = {
  schemaVersion: 1,
  compression: compressionMethod,
  build: "flux-production-packages-v1",
  rootEntry: "packages/react/dist/index.js",
  runtime: [".js", ".mjs", ".cjs", ".css"],
  published: "packages/react/dist/**",
  accounting: "sum-per-file-compressed-bytes",
};
const names = ["rootEntry", "runtime", "published"];
const metrics = ["raw", "gzip", "brotli", "fileCount"];

export function aggregateSnapshotState(previous, current) {
  if (previous === undefined)
    return { status: "stale", reason: "missing aggregate snapshot" };
  if (
    !previous ||
    names.some((name) =>
      metrics.some(
        (metric) =>
          !Number.isSafeInteger(previous[name]?.[metric]) ||
          previous[name][metric] < 0,
      ),
    )
  )
    return {
      status: "malformed",
      reason: "aggregate metrics must be nonnegative safe integers",
    };
  if (previous.componentCount === undefined && previous.method === undefined)
    return {
      status: "stale",
      reason: "legacy / not attributable to current component count",
    };
  if (
    !Number.isSafeInteger(previous.componentCount) ||
    previous.componentCount < 1 ||
    !previous.method ||
    typeof previous.method !== "object" ||
    Array.isArray(previous.method) ||
    !Number.isSafeInteger(previous.method.schemaVersion) ||
    previous.method.schemaVersion < 1 ||
    !Number.isSafeInteger(previous.method.compression?.gzipLevel) ||
    !Number.isSafeInteger(previous.method.compression?.brotliQuality) ||
    ["build", "rootEntry", "published", "accounting"].some(
      (key) =>
        typeof previous.method[key] !== "string" || !previous.method[key],
    ) ||
    !Array.isArray(previous.method.runtime) ||
    previous.method.runtime.length === 0 ||
    previous.method.runtime.some((extension) => typeof extension !== "string")
  )
    return {
      status: "malformed",
      reason: "invalid aggregate snapshot metadata",
    };
  if (
    previous.componentCount !== current.componentCount ||
    !isDeepStrictEqual(previous.method, current.method)
  )
    return {
      status: "stale",
      reason: "component count or measurement contract differs",
    };
  return { status: "applicable" };
}

export function formatAggregateProposal(previous, current) {
  const values = (value) =>
    metrics.map((metric) => value?.[metric] ?? "unknown").join(" / ");
  return [
    "\nAggregate baseline proposal — NOT ACCEPTED",
    `Aggregate snapshot metadata: ${aggregateSnapshotState(previous, current).reason ?? "applicable"}`,
    `snapshot components: ${previous?.componentCount ?? "unknown (legacy)"} → ${current.componentCount}; delta ${previous?.componentCount === undefined ? "unknown" : current.componentCount - previous.componentCount}`,
    "Set | Baseline | Current | Delta (raw / gzip / Brotli / fileCount)",
    ...names.map(
      (name) =>
        `${name} | ${values(previous?.[name])} | ${values(current[name])} | ${metrics
          .map((metric) => {
            const before = previous?.[name]?.[metric];
            if (!Number.isSafeInteger(before)) return "unknown";
            const delta = current[name][metric] - before;
            return `${delta > 0 ? "+" : ""}${delta}`;
          })
          .join(" / ")}`,
    ),
  ].join("\n");
}
