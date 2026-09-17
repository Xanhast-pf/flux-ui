import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import {
  compressMetrics,
  listPublishedFiles,
  listRuntimeFiles,
  measureFiles,
} from "./lib.mjs";

const aggregateNames = ["rootEntry", "runtime", "published"];
const metricNames = ["raw", "gzip", "brotli", "fileCount"];

function metricDelta(base, current, names = metricNames) {
  return Object.fromEntries(
    names.map((name) => [name, current[name] - base[name]]),
  );
}

export async function measureAggregate(dist, componentCount) {
  const runtimeFiles = await listRuntimeFiles(dist);
  const publishedFiles = await listPublishedFiles(dist);
  const published = {};
  for (const file of publishedFiles) {
    const buffer = await readFile(file);
    published[relative(dist, file).replaceAll("\\", "/")] = {
      ...compressMetrics(buffer),
      sha256: createHash("sha256").update(buffer).digest("hex"),
    };
  }
  return {
    componentCount,
    rootEntry: await measureFiles([join(dist, "index.js")]),
    runtime: await measureFiles(runtimeFiles),
    published: await measureFiles(publishedFiles),
    files: {
      runtime: Object.fromEntries(
        runtimeFiles.map((file) => {
          const path = relative(dist, file).replaceAll("\\", "/");
          return [path, published[path]];
        }),
      ),
      published,
    },
  };
}

export function compareAggregates(base, current) {
  const files = {};
  for (const name of ["runtime", "published"]) {
    const before = base.files[name];
    const after = current.files[name];
    files[name] = { added: [], removed: [], changed: [] };
    for (const path of [
      ...new Set([...Object.keys(before), ...Object.keys(after)]),
    ].sort()) {
      if (!before[path]) files[name].added.push(path);
      else if (!after[path]) files[name].removed.push(path);
      else if (before[path].sha256 !== after[path].sha256) {
        files[name].changed.push({
          path,
          delta: metricDelta(before[path], after[path], [
            "raw",
            "gzip",
            "brotli",
          ]),
        });
      }
    }
  }
  return {
    base,
    current,
    delta: Object.fromEntries(
      aggregateNames.map((name) => [
        name,
        metricDelta(base[name], current[name]),
      ]),
    ),
    files,
  };
}

export function formatAggregateComparison(aggregate) {
  const values = (metrics) =>
    metricNames.map((name) => metrics[name]).join(" / ");
  return [
    "\nAggregate (raw / gzip / brotli / fileCount)",
    `Components: ${aggregate.base.componentCount} → ${aggregate.current.componentCount}`,
    "Set | Base | Current | Delta",
    ...aggregateNames.map(
      (name) =>
        `${name} | ${values(aggregate.base[name])} | ${values(aggregate.current[name])} | ${values(aggregate.delta[name])}`,
    ),
  ].join("\n");
}
