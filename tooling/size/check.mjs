import {
  aggregateSnapshotState,
  formatAggregateProposal,
  aggregateMethod,
} from "./aggregate-baseline.mjs";
import { reportProgress, reportSummary } from "../terminal/progress.mjs";
import {
  aggregateBaselineText,
  bundledBaseline,
  bundledRegressions,
  targetedBaseline,
  targetedBaselineText,
  writeBaselineAtomic,
} from "./baseline.mjs";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { BUDGETS_VERSION } from "./budgets.mjs";
import { bundledEntryMethod, measureBundledEntry } from "./bundled-entry.mjs";
import {
  absoluteBudgetFailures,
  aggregateFailures,
  collectRuntimeGraph,
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
const argv = process.argv.slice(2);
const args = new Set(argv);
const componentFlags = argv.filter((arg) => arg.startsWith("--components"));
const updateBaseline = args.has("--update-bundled-baseline");
const reviewBaseline = args.has("--review-bundled-baseline");
const reviewAggregate = args.has("--review-aggregate-baseline");
const updateAggregate = args.has("--update-aggregate-baseline");
const aggregateAcceptance = reviewAggregate || updateAggregate;
const migration = updateBaseline || reviewBaseline;
const changedOnly = args.has("--changed");
const releaseMode = args.has("--release");
const jsonMode = args.has("--json");

if (
  aggregateAcceptance &&
  (migration ||
    changedOnly ||
    releaseMode ||
    componentFlags.length ||
    (reviewAggregate && updateAggregate))
)
  throw new Error(
    "Aggregate review/update must run separately and cannot combine with bundled review/update, --components, --changed or --release.",
  );

if (
  args.has("--update-baseline") ||
  (migration && (changedOnly || releaseMode)) ||
  (updateBaseline && reviewBaseline)
) {
  throw new Error(
    "Use --review-bundled-baseline and --update-bundled-baseline separately; neither can combine with --changed or --release. The legacy --update-baseline flag is unsupported.",
  );
}

let explicitSlugs;
if (componentFlags.length) {
  if (!migration || changedOnly || releaseMode)
    throw new Error(
      "--components requires baseline review/update and cannot combine with --changed or --release.",
    );
  if (
    componentFlags.length !== 1 ||
    !/^--components=[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:,[a-z][a-z0-9]*(?:-[a-z0-9]+)*)*$/u.test(
      componentFlags[0],
    )
  )
    throw new Error(
      "Use one --components=slug,slug list with no empty or malformed entries.",
    );
  explicitSlugs = componentFlags[0]
    .slice("--components=".length)
    .split(",")
    .sort();
  if (new Set(explicitSlugs).size !== explicitSlugs.length)
    throw new Error("--components must not contain duplicate slugs.");
}

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
  if (explicitSlugs) {
    const bySlug = new Map(
      components.map((component) => [component.slug, component]),
    );
    return explicitSlugs.map((slug) => {
      const component = bySlug.get(slug);
      if (!component) throw new Error(`Unknown component slug: ${slug}`);
      return component;
    });
  }
  if (!changedOnly) return components;
  const paths = changedPaths();
  if (paths.size === 0) return [];
  const changedDirectories = new Set();
  for (const path of paths) {
    let end = path.indexOf("/");
    while (end !== -1) {
      changedDirectories.add(path.slice(0, end + 1));
      end = path.indexOf("/", end + 1);
    }
  }
  return components.filter((component) => {
    const prefix = `${relative(root, component.sourceDir).replaceAll("\\", "/")}/`;
    return changedDirectories.has(prefix);
  });
}

function printMetrics(label, metrics, previous) {
  console.log(
    `  ${label}: ` +
      ["raw", "gzip", "brotli"]
        .map((metric) => {
          const delta = previous?.[metric];
          return `${metric} ${metrics[metric]} B (Δ ${Number.isFinite(delta) ? `${metrics[metric] - delta >= 0 ? "+" : ""}${metrics[metric] - delta} B` : "missing"})`;
        })
        .join(", "),
  );
}

const components = await discoverComponents(root);
if (components.length === 0) {
  console.error("No public components were discovered.");
  process.exit(1);
}

const baseline = await readBaseline();
if (baseline.budgetsVersion !== BUDGETS_VERSION) {
  console.error(
    `Size baseline uses budgetsVersion ${baseline.budgetsVersion}; current budgetsVersion is ${BUDGETS_VERSION}. ` +
      "Review the baseline budget policy explicitly; migration does not change budget versions.",
  );
  process.exit(1);
}

if (!jsonMode)
  console.log("Bundled entry: primary gate. Emitted graph: diagnostic only.");

const selected = selectedComponents(components);
const selectedSet = new Set(selected);
if (explicitSlugs) targetedBaseline(baseline, {});
const measured = {};
const bundledEntries = {};
const externalPeers = new Set();
const componentGates = {};
let failed = false;

let componentIndex = 0;
for (const component of components) {
  reportProgress({
    current: componentIndex++,
    total: components.length,
    unit: "components",
    item: component.name,
  });
  const entryPath = resolve(distDir, `${component.slug}.js`);
  const metrics = await measureEntry(entryPath, distDir);
  for (const peer of metrics.externalImports) externalPeers.add(peer);
  measured[component.slug] = {
    name: component.name,
    sizeClass: component.sizeClass,
    raw: metrics.raw,
    gzip: metrics.gzip,
    brotli: metrics.brotli,
    fileCount: metrics.fileCount,
  };

  const shouldEvaluate = selectedSet.has(component);
  if (!shouldEvaluate) continue;

  bundledEntries[component.slug] = await measureBundledEntry(
    entryPath,
    distDir,
  );

  const absoluteFailures = absoluteBudgetFailures(
    component,
    bundledEntries[component.slug],
  );
  for (const failure of absoluteFailures) {
    failed = true;
    console.error(
      `✖ ${component.name} exceeds ${component.sizeClass} ${failure.metric} budget: ` +
        `${formatBytes(failure.actual)} (${failure.actual} B) > ${formatBytes(failure.limit)} (${failure.limit} B)`,
    );
  }

  const previousBundled = baseline.components?.[component.slug]?.bundled;
  const regressions = bundledRegressions(
    bundledEntries[component.slug],
    previousBundled,
  );
  componentGates[component.slug] = {
    absoluteFailures,
    regressions,
    result: absoluteFailures.length || regressions.length ? "fail" : "pass",
  };
  if (!migration) {
    for (const regression of regressions) {
      failed = true;
      if (regression.metric === "baseline") {
        console.error(
          `✖ ${component.name} has no valid bundled baseline. Review with \`node tooling/size/check.mjs --review-bundled-baseline\`; acceptance requires explicit --update-bundled-baseline.`,
        );
      } else {
        console.error(
          `✖ ${component.name} bundled ${regression.metric} regression: ` +
            `${formatBytes(regression.actual)} (${regression.actual} B) > ${formatBytes(regression.limit)} (${regression.limit} B) ` +
            `(baseline ${formatBytes(regression.previous)})`,
        );
      }
    }
  }

  if (
    !jsonMode &&
    (args.has("--verbose") || componentGates[component.slug].result === "fail")
  ) {
    console.log(
      `${component.name} (${component.sizeClass}) — bundled gate: ${componentGates[component.slug].result}${migration ? " (baseline proposal)" : ""}`,
    );
    printMetrics(
      "Bundled entry",
      bundledEntries[component.slug],
      previousBundled,
    );
    printMetrics(
      "Emitted graph (diagnostic)",
      metrics,
      baseline.components?.[component.slug],
    );
  }
}
reportProgress({
  current: componentIndex,
  total: components.length,
  unit: "components",
  item: "Measured",
});

await collectRuntimeGraph(resolve(distDir, "index.js"), distDir);
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
      `${formatBytes(failure.actual)} (${failure.actual} B) > ${formatBytes(failure.limit)} (${failure.limit} B)`,
  );
}

const aggregate = {
  componentCount: components.length,
  rootEntry,
  runtime,
  published,
  method: aggregateMethod,
};
const aggregateState = aggregateSnapshotState(baseline.aggregate, aggregate);
if (
  aggregateState.status === "malformed" ||
  (!aggregateAcceptance && !migration && aggregateState.status !== "applicable")
) {
  failed = true;
  console.error(
    `✖ Aggregate baseline ${aggregateState.status}: ${aggregateState.reason}. Run pnpm size:aggregate:review; acceptance requires explicit pnpm size:aggregate:update.`,
  );
} else if (!aggregateAcceptance && aggregateState.status === "applicable") {
  for (const name of ["rootEntry", "runtime", "published"]) {
    for (const regression of regressionFailures(
      aggregate[name],
      baseline.aggregate[name],
    )) {
      failed = true;
      console.error(
        `✖ aggregate ${name} ${regression.metric} regression: ${regression.actual} B > ${regression.limit} B (baseline ${regression.previous} B)`,
      );
    }
  }
} else if (migration && aggregateState.status !== "applicable") {
  console.error(
    `Aggregate baseline stale: ${aggregateState.reason}; component acceptance does not accept aggregate growth. Run pnpm size:aggregate:review separately.`,
  );
}

if (releaseMode) {
  const liveSlugs = new Set(components.map((component) => component.slug));
  for (const slug of Object.keys(baseline.components ?? {})) {
    if (!liveSlugs.has(slug)) {
      failed = true;
      console.error(
        `✖ Size baseline contains removed component ${slug}. Review its removal explicitly; bundled migration preserves historical entries.`,
      );
    }
  }
}

const report = {
  schemaVersion: 2,
  budgetsVersion: BUDGETS_VERSION,
  componentCount: components.length,
  checkedComponentCount: selected.length,
  components: measured,
  emittedGraphs: measured,
  componentGates,
  bundledEntryMethod,
  bundledEntries,
  bundledEntryCoverage: {
    measured: selected.map((component) => component.slug),
    unmeasured: components
      .filter((component) => !selectedSet.has(component))
      .map((component) => component.slug),
  },
  externalPeersNotIncluded: [...externalPeers].sort(),
  aggregate: { rootEntry, runtime, published },
  aggregateMethod,
  aggregateBaselineState: aggregateState,
};

if (aggregateAcceptance) {
  report.baselineChanges = {
    aggregate: { before: baseline.aggregate ?? null, after: aggregate },
  };
  report.aggregateBaselineChanges = {
    before: baseline.aggregate ?? null,
    after: aggregate,
    accepted: false,
  };
  if (!jsonMode)
    console.log(formatAggregateProposal(baseline.aggregate, aggregate));
  if (updateAggregate) {
    if (failed)
      console.error(
        "Aggregate baseline was not updated because a size gate failed.",
      );
    else {
      await writeBaselineAtomic(
        baselinePath,
        await aggregateBaselineText(
          await readFile(baselinePath, "utf8"),
          aggregate,
        ),
      );
      report.aggregateBaselineChanges.accepted = true;
      if (!jsonMode) console.log("Accepted aggregate baseline only.");
    }
  }
}

if (migration) {
  const proposal = explicitSlugs
    ? targetedBaseline(baseline, bundledEntries)
    : bundledBaseline(baseline, bundledEntries);
  report.baselineChanges = Object.fromEntries(
    Object.entries(bundledEntries).map(([slug, after]) => [
      slug,
      { before: baseline.components?.[slug]?.bundled ?? null, after },
    ]),
  );
  if (!jsonMode) {
    const { mkdtemp, writeFile } = await import("node:fs/promises");
    const { tmpdir } = await import("node:os");
    const destination = resolve(
      await mkdtemp(resolve(tmpdir(), "flux-size-review-")),
      "review.json",
    );
    await writeFile(
      destination,
      JSON.stringify(report.baselineChanges, null, 2),
    );
    console.log(
      `Baseline proposal measured ${selected.length} components. Review written to: ${destination}`,
    );
  }
  if (updateBaseline) {
    if (failed) {
      console.error("Baseline was not updated because a size gate failed.");
    } else {
      await writeBaselineAtomic(
        baselinePath,
        explicitSlugs
          ? await targetedBaselineText(
              await readFile(baselinePath, "utf8"),
              bundledEntries,
            )
          : proposal,
      );
      if (!jsonMode) console.log(`Updated ${relative(root, baselinePath)}.`);
    }
  }
}

if (jsonMode) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(
    `\nExternal peers (excluded, not free): ${[...externalPeers].sort().join(", ") || "none"}`,
  );
  console.log(
    `Bundled entries: ${selected.length} measured; ${components.length - selected.length} unmeasured (not selected).`,
  );
  console.log("\nAggregate");
  console.log(`  components       ${components.length}`);
  console.log(`  runtime brotli   ${formatBytes(runtime.brotli)}`);
  console.log(`  published brotli ${formatBytes(published.brotli)}`);
  console.log(`  published raw    ${formatBytes(published.raw)}`);
  if (changedOnly && selected.length === 0) {
    console.log("  changed          no component source changes");
  }
}

if (process.env.FLUX_TERMINAL_ACTIVE && !jsonMode)
  reportSummary(
    `Size: ${selected.length} components checked · runtime ${formatBytes(runtime.brotli)} br`,
  );
if (failed) process.exitCode = 1;
