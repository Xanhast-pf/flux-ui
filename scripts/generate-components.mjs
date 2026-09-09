import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const componentsDir = resolve(root, "packages/react/src/components");
const reactIndexPath = resolve(root, "packages/react/src/index.ts");
const docsRegistryPath = resolve(root, "apps/docs/src/generated/components.ts");
const checkOnly = process.argv.includes("--check");

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

const componentNames = await listComponentNames();

const metas = await Promise.all(
  componentNames.map(async (name) => {
    const raw = await readFile(
      resolve(componentsDir, name, "component.meta.json"),
      "utf8",
    );
    return JSON.parse(raw);
  }),
);

const index = [
  "// GENERATED FILE. Run `pnpm generate`; do not edit manually.",
  ...componentNames.map(
    (name) => `export * from "./components/${name}/index.js";`,
  ),
  "",
].join("\n");

const registry = [
  "// GENERATED FILE. Run `pnpm generate`; do not edit manually.",
  `export const components = ${JSON.stringify(metas, null, 2)} as const;`,
  "",
  "export type ComponentMeta = (typeof components)[number];",
  "",
].join("\n");

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
  ensure(reactIndexPath, index),
  ensure(docsRegistryPath, registry),
]);
if (checkOnly && results.some((result) => !result)) process.exitCode = 1;
