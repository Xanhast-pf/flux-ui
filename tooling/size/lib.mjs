import { brotliCompressSync, constants, gzipSync } from "node:zlib";
import { readFile, readdir, stat, realpath } from "node:fs/promises";
import {
  dirname,
  extname,
  relative,
  resolve,
  sep,
  isAbsolute,
} from "node:path";
import {
  aggregatePolicy,
  regressionPolicy,
  sizeClasses,
  validSizeClasses,
} from "./budgets.mjs";

// Parse emitted modules instead of treating strings/comments as executable imports.
// Bare React peers are reported but not charged to each component. Other engines
// must be bundled or gain an explicit, independently measured packaging contract.
import ts from "typescript";
const allowedPeers = new Set([
  "react",
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
  "react-dom",
  "react-dom/client",
  "react-dom/server",
]);
function moduleImports(source, file) {
  const result = [];
  const ast = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  );
  if (ast.parseDiagnostics.length)
    throw new Error(`Invalid emitted JavaScript in ${file}`);
  function visit(node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    )
      result.push(node.moduleSpecifier.text);
    if (
      ts.isCallExpression(node) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) &&
          node.expression.text === "require"))
    ) {
      const argument = node.arguments[0];
      if (
        !argument ||
        (!ts.isStringLiteral(argument) &&
          !ts.isNoSubstitutionTemplateLiteral(argument))
      )
        throw new Error(`Unmeasurable dynamic runtime import in ${file}`);
      result.push(argument.text);
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  return result;
}
function stylesheetImports(source, file) {
  // @import is evaluated only outside comments and quoted declaration values.
  const imports = [];
  for (let i = 0; i < source.length; i += 1) {
    if (source.startsWith("/*", i)) {
      const end = source.indexOf("*/", i + 2);
      i = end < 0 ? source.length : end + 1;
      continue;
    }
    if (source[i] === '"' || source[i] === "'") {
      const quote = source[i];
      for (i += 1; i < source.length; i += 1) {
        if (source[i] === "\\") i += 1;
        else if (source[i] === quote) break;
      }
      continue;
    }
    if (source.slice(i, i + 7).toLowerCase() === "@import") {
      const match =
        /^@import\s+(?:url\(\s*)?(?:"([^"\\]+)"|'([^'\\]+)'|([^\s);]+))/i.exec(
          source.slice(i),
        );
      const value = match?.[1] ?? match?.[2] ?? match?.[3];
      if (!value) throw new Error(`Unmeasurable CSS import in ${file}`);
      imports.push(
        /^[a-z]+:|^\/\//i.test(value)
          ? value
          : value.startsWith(".")
            ? value
            : `./${value}`,
      );
      i += match[0].length - 1;
    }
  }
  return imports;
}

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
  const candidate = resolve(dirname(fromFile), specifier.split(/[?#]/u)[0]);
  if (await pathExists(candidate)) return candidate;
  for (const suffix of [".js", ".css", ".mjs", ".cjs"]) {
    if (await pathExists(`${candidate}${suffix}`))
      return `${candidate}${suffix}`;
  }
  throw new Error(
    `Unresolved local runtime import ${JSON.stringify(specifier)} from ${fromFile}`,
  );
}

export async function collectRuntimeGraph(
  entryPath,
  distDir,
  externalImports = new Set(),
) {
  const seen = new Set();
  const queue = [resolve(entryPath)];
  const distRoot = await realpath(distDir);

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || seen.has(current)) continue;
    const relativeToDist = relative(distRoot, current);
    if (
      isAbsolute(relativeToDist) ||
      relativeToDist === ".." ||
      relativeToDist.startsWith(`..${sep}`)
    ) {
      throw new Error(`Runtime graph escaped dist/: ${current}`);
    }
    if (!(await pathExists(current))) {
      throw new Error(
        `Missing built runtime file: ${relative(process.cwd(), current)}`,
      );
    }
    const real = await realpath(current);
    const localReal = relative(distRoot, real);
    if (
      isAbsolute(localReal) ||
      localReal === ".." ||
      localReal.startsWith(`..${sep}`)
    ) {
      throw new Error(
        `Runtime graph escaped dist/ through a symlink: ${current}`,
      );
    }
    if (!(await stat(real)).isFile())
      throw new Error(`Runtime import is not a file: ${current}`);
    seen.add(current);

    const extension = extname(current);
    if (![".js", ".mjs", ".cjs", ".css"].includes(extension)) continue;
    const source = await readFile(current, "utf8");
    const imports =
      extension === ".css"
        ? stylesheetImports(source, current)
        : moduleImports(source, current);
    for (const specifier of imports) {
      const dependency = await resolveRelativeImport(current, specifier);
      if (dependency) queue.push(dependency);
      else {
        if (!allowedPeers.has(specifier))
          throw new Error(
            `Unaccounted external runtime import ${JSON.stringify(specifier)} in ${current}. Bundle it or add an independently measured dependency contract.`,
          );
        externalImports.add(specifier);
      }
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
  const externalImports = new Set();
  const files = await collectRuntimeGraph(entryPath, distDir, externalImports);
  return {
    ...(await measureFiles(files)),
    files: files.map((file) => relative(distDir, file).replaceAll("\\", "/")),
    externalImports: [...externalImports].sort(),
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
