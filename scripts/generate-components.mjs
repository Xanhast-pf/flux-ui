import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { sizeClasses } from "../tooling/size/budgets.mjs";
import { format } from "prettier";
import { createPublicContracts } from "./lib/public-contracts.mjs";
import { generateShowcaseRecipes } from "./lib/showcase-recipes.mjs";

const root = process.cwd();
const componentsDir = resolve(root, "packages/react/src/components");
const reactIndexPath = resolve(root, "packages/react/src/index.ts");
const docsRegistryPath = resolve(root, "apps/docs/src/generated/components.ts");
const docsHealthPath = resolve(root, "apps/docs/src/generated/health.ts");
const docsContractsPath = resolve(root, "apps/docs/src/generated/contracts.ts");
const sizeBaselinePath = resolve(root, "tooling/size/baseline.json");
const perfBaselinePath = resolve(root, "tooling/perf/baseline.json");
const checkOnly = process.argv.includes("--check");

async function formatTypeScript(source) {
  return format(source, {
    parser: "typescript",
  });
}

function isMissingPathError(error) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}

async function listComponentNames() {
  try {
    return (await readdir(componentsDir, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b));
  } catch (error) {
    if (isMissingPathError(error)) return [];
    throw error;
  }
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

const componentNames = await listComponentNames();

const { contracts: publicContracts, errors: contractErrors } =
  createPublicContracts(root);
if (contractErrors.length > 0) {
  console.error(contractErrors.join("\n"));
  process.exit(1);
}

const metas = await Promise.all(
  componentNames.map(async (name) => {
    const raw = await readFile(
      resolve(componentsDir, name, "component.meta.json"),
      "utf8",
    );
    return JSON.parse(raw);
  }),
);

const [sizeBaseline, perfBaseline] = await Promise.all([
  readJson(sizeBaselinePath),
  readJson(perfBaselinePath),
]);

const index = await formatTypeScript(
  [
    "// GENERATED FILE. Run `pnpm flux maintain generate`; do not edit manually.",
    ...componentNames.map(
      (name) => `export * from "./components/${name}/index.js";`,
    ),
    "",
  ].join("\n"),
);

const registry = await formatTypeScript(
  [
    "// GENERATED FILE. Run `pnpm flux maintain generate`; do not edit manually.",
    `export const components = ${JSON.stringify(metas, null, 2)} as const;`,
    "",
    "export type ComponentMeta = (typeof components)[number];",
    "",
  ].join("\n"),
);

const contractsRegistry = await formatTypeScript(
  [
    "// GENERATED FILE. Run `pnpm flux maintain generate`; do not edit manually.",
    `export const publicContracts = ${JSON.stringify(publicContracts, null, 2)} as const;`,
    "",
    "export type PublicContract = (typeof publicContracts)[number];",
    "",
  ].join("\n"),
);

const sizeComponents = metas.map((meta) => {
  const measurement = sizeBaseline.components?.[meta.slug] ?? null;
  const budget = sizeClasses[meta.sizeClass];

  return {
    name: meta.name,
    slug: meta.slug,
    sizeClass: meta.sizeClass,
    raw: measurement?.raw ?? null,
    gzip: measurement?.gzip ?? null,
    brotli: measurement?.brotli ?? null,
    budgetBrotli: budget?.brotli ?? null,
  };
});

const performanceScenarios = Object.entries(perfBaseline.scenarios ?? {})
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([name, scenario]) => ({
    name,
    count: scenario.count,
    reference: scenario.reference,
    fixtureRevision: scenario.fixtureRevision ?? 0,
    medians: scenario.medians,
    ratios: scenario.ratios,
  }));

const health = {
  size: {
    schemaVersion: sizeBaseline.schemaVersion,
    budgetsVersion: sizeBaseline.budgetsVersion,
    aggregate: sizeBaseline.aggregate,
    components: sizeComponents,
  },
  performance: {
    schemaVersion: perfBaseline.schemaVersion,
    policyVersion: perfBaseline.policyVersion,
    scenarios: performanceScenarios,
  },
};

const healthRegistry = await formatTypeScript(
  [
    "// GENERATED FILE. Run `pnpm flux maintain generate`; do not edit manually.",
    `export const health = ${JSON.stringify(health, null, 2)} as const;`,
    "",
    "export type HealthSnapshot = typeof health;",
    "",
  ].join("\n"),
);

async function ensure(path, expected) {
  let current = "";
  try {
    current = await readFile(path, "utf8");
  } catch (error) {
    if (!isMissingPathError(error)) throw error;
  }

  if (current === expected) return true;
  if (checkOnly) {
    console.error(`Generated file is stale: ${path.replace(`${root}/`, "")}`);
    return false;
  }
  await writeFile(path, expected, "utf8");
  console.log(`Generated ${path.replace(`${root}/`, "")}`);
  return true;
}

const results = await Promise.all([
  generateShowcaseRecipes(root, checkOnly),
  ensure(reactIndexPath, index),
  ensure(docsRegistryPath, registry),
  ensure(docsContractsPath, contractsRegistry),
  ensure(docsHealthPath, healthRegistry),
]);
if (checkOnly && results.some((result) => !result)) process.exitCode = 1;
