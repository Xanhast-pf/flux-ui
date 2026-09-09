import { brotliCompressSync, constants, gzipSync } from "node:zlib";
import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, extname, relative, resolve, sep } from "node:path";
import {
  aggregatePolicy,
  regressionPolicy,
  sizeClasses,
  validSizeClasses,
} from "./budgets.mjs";

const importPattern =
  /(?:import|export)\s+(?:[^"']*?\s+from\s+)?["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g;

export function toEntrySlug(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 2 : 1)} KiB`;
}

export function compressMetrics(buffer) {
  return {
    raw: buffer.byteLength,
    gzip: gzipSync(buffer, { level: 9 }).byteLength,
    brotli: brotliCompressSync(buffer, {
      params: {
        [constants.BROTLI_PARAM_QUALITY]: 11,
      },
    }).byteLength,
  };
}

async function pathExists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

async function resolveRelativeImport(fromFile, specifier) {
  if (!specifier.startsWith(".")) return null;
  const candidate = resolve(dirname(fromFile), specifier);
  if (await pathExists(candidate)) return candidate;
  for (const suffix of [".js", ".css", ".mjs", ".cjs"]) {
    if (await pathExists(`${candidate}${suffix}`))
      return `${candidate}${suffix}`;
  }
  return null;
}

export async function collectRuntimeGraph(entryPath, distDir) {
  const seen = new Set();
  const queue = [resolve(entryPath)];
  const distRoot = resolve(distDir);

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || seen.has(current)) continue;
    const relativeToDist = relative(distRoot, current);
    if (relativeToDist === ".." || relativeToDist.startsWith(`..${sep}`)) {
      throw new Error(`Runtime graph escaped dist/: ${current}`);
    }
    if (!(await pathExists(current))) {
      throw new Error(
        `Missing built runtime file: ${relative(process.cwd(), current)}`,
      );
    }
    seen.add(current);

    const extension = extname(current);
    if (extension !== ".js" && extension !== ".mjs" && extension !== ".cjs") {
      continue;
    }

    const source = await readFile(current, "utf8");
    importPattern.lastIndex = 0;
    for (const match of source.matchAll(importPattern)) {
      const specifier = match[1] ?? match[2];
      if (!specifier) continue;
      const dependency = await resolveRelativeImport(current, specifier);
      if (dependency) queue.push(dependency);
    }
  }

  return [...seen].sort((a, b) => a.localeCompare(b));
}

export async function measureFiles(files) {
  const result = { raw: 0, gzip: 0, brotli: 0, fileCount: files.length };
  for (const file of files) {
    const metrics = compressMetrics(await readFile(file));
    result.raw += metrics.raw;
    result.gzip += metrics.gzip;
    result.brotli += metrics.brotli;
  }
  return result;
}

export async function measureEntry(entryPath, distDir) {
  const files = await collectRuntimeGraph(entryPath, distDir);
  return {
    ...(await measureFiles(files)),
    files: files.map((file) => relative(distDir, file).replaceAll("\\", "/")),
  };
}

export async function discoverComponents(root) {
  const componentsDir = resolve(root, "packages/react/src/components");
  let entries = [];
  try {
    entries = await readdir(componentsDir, { withFileTypes: true });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }

  const components = [];
  for (const entry of entries.filter((item) => item.isDirectory())) {
    const metaPath = resolve(componentsDir, entry.name, "component.meta.json");
    const meta = JSON.parse(await readFile(metaPath, "utf8"));
    const sizeClass = meta.sizeClass ?? "primitive";
    if (!validSizeClasses.includes(sizeClass)) {
      throw new Error(
        `${relative(root, metaPath)} has invalid sizeClass ${JSON.stringify(sizeClass)}. ` +
          `Expected one of: ${validSizeClasses.join(", ")}.`,
      );
    }
    components.push({
      name: meta.name ?? entry.name,
      slug: meta.slug ?? toEntrySlug(entry.name),
      sizeClass,
      sourceDir: resolve(componentsDir, entry.name),
    });
  }
  return components.sort((a, b) => a.slug.localeCompare(b.slug));
}

export function absoluteBudgetFailures(component, metrics) {
  const budget = sizeClasses[component.sizeClass];
  const failures = [];
  for (const metric of ["raw", "gzip", "brotli"]) {
    if (metrics[metric] > budget[metric]) {
      failures.push({
        metric,
        actual: metrics[metric],
        limit: budget[metric],
      });
    }
  }
  return failures;
}

export function regressionFailures(current, baseline) {
  if (!baseline) return [{ metric: "baseline", actual: 0, limit: 0 }];
  const failures = [];
  for (const metric of ["raw", "gzip", "brotli"]) {
    const previous = baseline[metric];
    if (!Number.isFinite(previous)) continue;
    const allowedDelta = Math.max(
      regressionPolicy.minimumBytes[metric],
      Math.ceil((previous * regressionPolicy.percent) / 100),
    );
    const limit = previous + allowedDelta;
    if (current[metric] > limit) {
      failures.push({ metric, actual: current[metric], limit, previous });
    }
  }
  return failures;
}

export function aggregateFailures({
  componentCount,
  components,
  rootEntry,
  sharedRuntime,
}) {
  const failures = [];
  const rootLimit =
    aggregatePolicy.rootEntryBaseBrotli +
    aggregatePolicy.rootEntryPerComponentBrotli * componentCount;
  if (rootEntry.brotli > rootLimit) {
    failures.push({
      name: "root-entry",
      metric: "brotli",
      actual: rootEntry.brotli,
      limit: rootLimit,
    });
  }

  const declaredBudgetTotal = components.reduce(
    (sum, component) => sum + sizeClasses[component.sizeClass].brotli,
    0,
  );
  const runtimeLimit =
    declaredBudgetTotal +
    aggregatePolicy.sharedRuntimeBaseBrotli +
    aggregatePolicy.sharedRuntimePerComponentBrotli * componentCount;
  if (sharedRuntime.brotli > runtimeLimit) {
    failures.push({
      name: "shared-runtime",
      metric: "brotli",
      actual: sharedRuntime.brotli,
      limit: runtimeLimit,
    });
  }
  return failures;
}

export async function listRuntimeFiles(distDir) {
  const result = [];
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = resolve(dir, entry.name);
      if (entry.isDirectory()) await walk(path);
      else if ([".js", ".mjs", ".cjs", ".css"].includes(extname(path))) {
        result.push(path);
      }
    }
  }
  await walk(distDir);
  return result.sort((a, b) => a.localeCompare(b));
}

export async function listPublishedFiles(distDir) {
  const result = [];
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = resolve(dir, entry.name);
      if (entry.isDirectory()) await walk(path);
      else result.push(path);
    }
  }
  await walk(distDir);
  return result.sort((a, b) => a.localeCompare(b));
}
