import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = process.cwd();
const manifestPath = resolve(root, "packages/icons/icons.json");
const iconsDir = resolve(root, "packages/icons/src/icons");
const indexPath = resolve(root, "packages/icons/src/index.ts");
const catalogPath = resolve(root, "packages/icons/src/catalog.ts");
const checkOnly = process.argv.includes("--check");
const icons = JSON.parse(await readFile(manifestPath, "utf8"));

function componentName(name) {
  return `${name}Icon`;
}

function renderElement(element) {
  if (element.tag !== "path") {
    throw new Error(`Unsupported icon element: ${element.tag}`);
  }
  return `      <path d=${JSON.stringify(element.d)} />`;
}

function iconSource(icon) {
  const name = componentName(icon.name);
  return [
    'import { IconBase, type IconProps } from "../IconBase.js";',
    "",
    `export function ${name}(props: IconProps) {`,
    "  return (",
    "    <IconBase {...props}>",
    ...icon.elements.map(renderElement),
    "    </IconBase>",
    "  );",
    "}",
    "",
  ].join("\n");
}

function indexSource() {
  return [
    "// GENERATED FILE. Run `pnpm generate`; do not edit manually.",
    'export { IconBase, type IconProps } from "./IconBase.js";',
    ...icons.map((icon) => {
      const name = componentName(icon.name);
      return `export { ${name} } from "./icons/${name}.js";`;
    }),
    "",
  ].join("\n");
}

function catalogSource() {
  const imports = icons.map((icon) => {
    const name = componentName(icon.name);
    return `import { ${name} } from "./icons/${name}.js";`;
  });
  const entries = icons.flatMap((icon) => {
    const name = componentName(icon.name);
    return [
      "  {",
      `    name: ${JSON.stringify(name)},`,
      `    category: ${JSON.stringify(icon.category)},`,
      `    keywords: ${JSON.stringify(icon.keywords ?? [])},`,
      `    component: ${name},`,
      "  },",
    ];
  });
  return [
    "// GENERATED FILE. Run `pnpm generate`; do not edit manually.",
    'import type { ComponentType } from "react";',
    'import type { IconProps } from "./IconBase.js";',
    ...imports,
    "",
    "export interface IconCatalogEntry {",
    "  name: string;",
    "  category: string;",
    "  keywords: readonly string[];",
    "  component: ComponentType<IconProps>;",
    "}",
    "",
    "export const iconCatalog: readonly IconCatalogEntry[] = [",
    ...entries,
    "];",
    "",
  ].join("\n");
}

async function ensure(path, expected) {
  let current = "";
  try {
    current = await readFile(path, "utf8");
  } catch (error) {
    if (!(
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    )) {
      throw error;
    }
  }
  if (current === expected) return true;
  if (checkOnly) {
    console.error(`Generated file is stale: ${path.replace(`${root}/`, "")}`);
    return false;
  }
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, expected, "utf8");
  console.log(`Generated ${path.replace(`${root}/`, "")}`);
  return true;
}

const names = new Set();
for (const icon of icons) {
  if (!/^[A-Z][A-Za-z0-9]*$/u.test(icon.name)) {
    throw new Error(`Invalid icon name: ${icon.name}`);
  }
  if (names.has(icon.name))
    throw new Error(`Duplicate icon name: ${icon.name}`);
  if (!Array.isArray(icon.elements) || icon.elements.length === 0) {
    throw new Error(`${icon.name} must define at least one SVG element.`);
  }
  names.add(icon.name);
}

let existingIconFiles = [];
try {
  existingIconFiles = (await readdir(iconsDir)).filter((file) =>
    file.endsWith("Icon.tsx"),
  );
} catch (error) {
  if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) {
    throw error;
  }
}
const expectedIconFiles = new Set(
  icons.map((icon) => `${componentName(icon.name)}.tsx`),
);
for (const file of existingIconFiles) {
  if (expectedIconFiles.has(file)) continue;
  if (checkOnly) {
    console.error(`Orphaned generated icon: packages/icons/src/icons/${file}`);
    process.exitCode = 1;
  } else {
    await rm(resolve(iconsDir, file));
    console.log(`Removed packages/icons/src/icons/${file}`);
  }
}

const results = await Promise.all([
  ...icons.map((icon) =>
    ensure(
      resolve(iconsDir, `${componentName(icon.name)}.tsx`),
      iconSource(icon),
    ),
  ),
  ensure(indexPath, indexSource()),
  ensure(catalogPath, catalogSource()),
]);

if (checkOnly && results.some((result) => !result)) process.exitCode = 1;
