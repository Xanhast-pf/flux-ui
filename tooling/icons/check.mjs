import { readFile, readdir, writeFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { formatBytes, measureEntry } from "../size/lib.mjs";

const root = process.cwd();
const distDir = resolve(root, "packages/icons/dist");
const baselinePath = resolve(root, "tooling/icons/baseline.json");
const updateBaseline = process.argv.includes("--update-baseline");
const files = (await readdir(distDir))
  .filter((file) => file.endsWith("Icon.js"))
  .sort((left, right) => left.localeCompare(right));
const baseline = JSON.parse(await readFile(baselinePath, "utf8"));
const absoluteBudget = { raw: 3072, gzip: 1280, brotli: 1024 };
const regressionFloor = { raw: 96, gzip: 48, brotli: 40 };
const measured = {};
let failed = false;

if (files.length === 0) {
  console.error("No built Flux icon entries were found.");
  process.exit(1);
}

for (const file of files) {
  const metrics = await measureEntry(resolve(distDir, file), distDir);
  const name = file.replace(/\.js$/u, "");
  measured[name] = {
    raw: metrics.raw,
    gzip: metrics.gzip,
    brotli: metrics.brotli,
    fileCount: metrics.fileCount,
  };

  for (const metric of ["raw", "gzip", "brotli"]) {
    if (metrics[metric] <= absoluteBudget[metric]) continue;
    failed = true;
    console.error(
      `✖ ${name} exceeds icon ${metric} budget: ${formatBytes(metrics[metric])} > ${formatBytes(absoluteBudget[metric])}`,
    );
  }

  if (!updateBaseline) {
    const previous = baseline.icons?.[name];
    if (previous === undefined) {
      failed = true;
      console.error(
        `✖ ${name} has no icon size baseline. Run \`pnpm size:update\` and review tooling/icons/baseline.json.`,
      );
    } else {
      for (const metric of ["raw", "gzip", "brotli"]) {
        const allowance = Math.max(
          regressionFloor[metric],
          Math.ceil(previous[metric] * 0.1),
        );
        const limit = previous[metric] + allowance;
        if (metrics[metric] <= limit) continue;
        failed = true;
        console.error(
          `✖ ${name} ${metric} regression: ${formatBytes(metrics[metric])} > ${formatBytes(limit)} ` +
            `(baseline ${formatBytes(previous[metric])})`,
        );
      }
    }
  }

  const delta = baseline.icons?.[name]?.brotli;
  const deltaText =
    delta === undefined
      ? "new"
      : `${metrics.brotli - delta >= 0 ? "+" : ""}${formatBytes(metrics.brotli - delta)}`;
  console.log(
    `${name.padEnd(24)} ${formatBytes(metrics.brotli).padStart(10)} br  ` +
      `${formatBytes(metrics.gzip).padStart(10)} gz  ${deltaText.padStart(10)}`,
  );
}

if (updateBaseline) {
  if (failed) {
    console.error(
      "\nIcon baseline was not updated because an absolute budget failed.",
    );
    process.exit(1);
  }
  await writeFile(
    baselinePath,
    `${JSON.stringify({ schemaVersion: 1, icons: measured }, null, 2)}\n`,
    "utf8",
  );
  console.log(`\nUpdated ${relative(root, baselinePath)}.`);
  process.exit(0);
}

for (const name of Object.keys(baseline.icons ?? {})) {
  if (!(name in measured)) {
    failed = true;
    console.error(
      `✖ Icon baseline contains removed entry ${name}. Run \`pnpm size:update\` after reviewing the removal.`,
    );
  }
}

if (failed) process.exitCode = 1;
