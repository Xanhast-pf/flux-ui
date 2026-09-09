import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { BUDGETS_VERSION } from "./budgets.mjs";
import {
  absoluteBudgetFailures,
  aggregateFailures,
  discoverComponents,
  formatBytes,
  listPublishedFiles,
  listRuntimeFiles,
  measureEntry,
  measureFiles,
  regressionFailures,
} from "./lib.mjs";

const root = process.cwd();
const distDir = resolve(root, "packages/react/dist");
const baselinePath = resolve(root, "tooling/size/baseline.json");
const args = new Set(process.argv.slice(2));
const updateBaseline = args.has("--update-baseline");
const changedOnly = args.has("--changed");
const releaseMode = args.has("--release");
const jsonMode = args.has("--json");

async function readBaseline() {
  try {
    return JSON.parse(await readFile(baselinePath, "utf8"));
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return {
        schemaVersion: 1,
        budgetsVersion: BUDGETS_VERSION,
        components: {},
      };
    }
    throw error;
  }
}

function changedPaths() {
  const commands = [
    ["git", ["diff", "--name-only", "HEAD"]],
    ["git", ["diff", "--cached", "--name-only"]],
    ["git", ["ls-files", "--others", "--exclude-standard"]],
  ];
  const paths = new Set();
  for (const [command, commandArgs] of commands) {
    try {
      const output = execFileSync(command, commandArgs, {
        cwd: root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      });
      for (const path of output.split(/\r?\n/u)) {
        if (path) paths.add(path.replaceAll("\\", "/"));
      }
    } catch {
      // A source archive without .git can still run the full size contract.
    }
  }
  return paths;
}

function selectedComponents(components) {
  if (!changedOnly) return components;
  const paths = changedPaths();
  if (paths.size === 0) return [];
  return components.filter((component) => {
    const prefix = `${relative(root, component.sourceDir).replaceAll("\\", "/")}/`;
    return [...paths].some((path) => path.startsWith(prefix));
  });
}

function printComponentRow(component, metrics, baseline) {
  const delta = baseline ? metrics.brotli - baseline.brotli : null;
  const deltaText =
    delta === null ? "new" : `${delta >= 0 ? "+" : ""}${formatBytes(delta)}`;
  console.log(
    `${component.name.padEnd(24)} ${component.sizeClass.padEnd(12)} ` +
      `${formatBytes(metrics.brotli).padStart(10)} br  ` +
      `${formatBytes(metrics.gzip).padStart(10)} gz  ` +
      `${deltaText.padStart(10)}`,
  );
}

const components = await discoverComponents(root);
if (components.length === 0) {
  console.error("No public components were discovered.");
  process.exit(1);
}

const baseline = await readBaseline();
if (baseline.budgetsVersion !== BUDGETS_VERSION && !updateBaseline) {
  console.error(
    `Size baseline uses budgetsVersion ${baseline.budgetsVersion}; current budgetsVersion is ${BUDGETS_VERSION}. ` +
      "Run `pnpm size:update` after reviewing the new budget policy.",
  );
  process.exit(1);
}

const selected = selectedComponents(components);
const measured = {};
let failed = false;

for (const component of components) {
  const entryPath = resolve(distDir, `${component.slug}.js`);
  const metrics = await measureEntry(entryPath, distDir);
  measured[component.slug] = {
    name: component.name,
    sizeClass: component.sizeClass,
    raw: metrics.raw,
    gzip: metrics.gzip,
    brotli: metrics.brotli,
    fileCount: metrics.fileCount,
  };

  const shouldEvaluate = !changedOnly || selected.includes(component);
  if (!shouldEvaluate) continue;

  const absoluteFailures = absoluteBudgetFailures(component, metrics);
  for (const failure of absoluteFailures) {
    failed = true;
    console.error(
      `✖ ${component.name} exceeds ${component.sizeClass} ${failure.metric} budget: ` +
        `${formatBytes(failure.actual)} > ${formatBytes(failure.limit)}`,
    );
  }

  if (!updateBaseline) {
    const previous = baseline.components?.[component.slug];
    const regressions = regressionFailures(metrics, previous);
    for (const regression of regressions) {
      failed = true;
      if (regression.metric === "baseline") {
        console.error(
          `✖ ${component.name} has no size baseline. Run \`pnpm size:update\` and commit tooling/size/baseline.json.`,
        );
      } else {
        console.error(
          `✖ ${component.name} ${regression.metric} regression: ` +
            `${formatBytes(regression.actual)} > ${formatBytes(regression.limit)} ` +
            `(baseline ${formatBytes(regression.previous)})`,
        );
      }
    }
  }

  if (!jsonMode) {
    printComponentRow(
      component,
      metrics,
      baseline.components?.[component.slug],
    );
  }
}

const rootEntry = await measureFiles([resolve(distDir, "index.js")]);
const runtimeFiles = await listRuntimeFiles(distDir);
const runtime = await measureFiles(runtimeFiles);
const publishedFiles = await listPublishedFiles(distDir);
const published = await measureFiles(publishedFiles);
const aggregates = aggregateFailures({
  componentCount: components.length,
  components,
  rootEntry,
  sharedRuntime: runtime,
});
for (const failure of aggregates) {
  failed = true;
  console.error(
    `✖ ${failure.name} exceeds ${failure.metric} budget: ` +
      `${formatBytes(failure.actual)} > ${formatBytes(failure.limit)}`,
  );
}

if (!updateBaseline) {
  const baselineComponentCount = Object.keys(baseline.components ?? {}).length;
  if (baselineComponentCount === components.length && baseline.aggregate) {
    for (const [name, current] of Object.entries({
      rootEntry,
      runtime,
      published,
    })) {
      for (const regression of regressionFailures(
        current,
        baseline.aggregate[name],
      )) {
        if (regression.metric === "baseline") continue;
        failed = true;
        console.error(
          `✖ aggregate ${name} ${regression.metric} regression: ` +
            `${formatBytes(regression.actual)} > ${formatBytes(regression.limit)} ` +
            `(baseline ${formatBytes(regression.previous)})`,
        );
      }
    }
  }
}

if (releaseMode && !updateBaseline) {
  const liveSlugs = new Set(components.map((component) => component.slug));
  for (const slug of Object.keys(baseline.components ?? {})) {
    if (!liveSlugs.has(slug)) {
      failed = true;
      console.error(
        `✖ Size baseline contains removed component ${slug}. Run \`pnpm size:update\`.`,
      );
    }
  }
}

const report = {
  schemaVersion: 1,
  budgetsVersion: BUDGETS_VERSION,
  componentCount: components.length,
  checkedComponentCount: changedOnly ? selected.length : components.length,
  components: measured,
  aggregate: {
    rootEntry,
    runtime,
    published,
  },
};

if (updateBaseline) {
  if (failed) {
    console.error(
      "\nBaseline was not updated because an absolute budget failed.",
    );
    process.exit(1);
  }
  const nextBaseline = {
    schemaVersion: 1,
    budgetsVersion: BUDGETS_VERSION,
    components: Object.fromEntries(
      Object.entries(measured)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([slug, value]) => [slug, value]),
    ),
    aggregate: report.aggregate,
  };
  await writeFile(
    baselinePath,
    `${JSON.stringify(nextBaseline, null, 2)}\n`,
    "utf8",
  );
  console.log(`\nUpdated ${relative(root, baselinePath)}.`);
  process.exit(0);
}

if (jsonMode) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("\nAggregate");
  console.log(`  components       ${components.length}`);
  console.log(`  runtime brotli   ${formatBytes(runtime.brotli)}`);
  console.log(`  published brotli ${formatBytes(published.brotli)}`);
  console.log(`  published raw    ${formatBytes(published.raw)}`);
  if (changedOnly && selected.length === 0) {
    console.log("  changed          no component source changes");
  }
}

if (failed) process.exitCode = 1;
