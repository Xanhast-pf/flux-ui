import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = process.cwd();
const manifestPath = resolve(root, "packages/icons/icons.json");
const iconsDir = resolve(root, "packages/icons/src/icons");
const indexPath = resolve(root, "packages/icons/src/index.ts");
const catalogPath = resolve(root, "packages/icons/src/catalog.ts");
const checkOnly = process.argv.includes("--check");
const icons = JSON.parse(await readFile(manifestPath, "utf8"));
const allowedCategories = new Set([
  "actions",
  "brand",
  "communication",
  "content",
  "developer",
  "layout",
  "navigation",
  "status",
  "theme",
]);

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
  const elements =
    icon.name === "FluxMark"
      ? [
          renderElement({
            tag: "path",
            d: icon.elements.map((element) => element.d).join(""),
          }),
        ]
      : icon.elements.map(renderElement);
  return [
    'import { IconBase, type IconProps } from "../IconBase.js";',
    "",
    `export function ${name}(props: IconProps) {`,
    "  return (",
    icon.fill === "currentColor"
      ? '    <IconBase fill="currentColor" stroke="none" {...props}>'
      : "    <IconBase {...props}>",
    ...elements,
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
  const categories = [...new Set(icons.map((icon) => icon.category))].sort(
    (left, right) => left.localeCompare(right),
  );
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
    `export type IconCategory = ${categories.map((category) => JSON.stringify(category)).join(" | ")};`,
    "",
    "export interface IconCatalogEntry {",
    "  name: string;",
    "  category: IconCategory;",
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
const geometries = new Map();
for (const icon of icons) {
  if (!/^[A-Z][A-Za-z0-9]*$/u.test(icon.name)) {
    throw new Error(`Invalid icon name: ${icon.name}`);
  }
  if (names.has(icon.name))
    throw new Error(`Duplicate icon name: ${icon.name}`);
  if (!allowedCategories.has(icon.category)) {
    throw new Error(`Invalid category for ${icon.name}: ${icon.category}`);
  }
  if (!Array.isArray(icon.keywords) || icon.keywords.length === 0) {
    throw new Error(`${icon.name} must define at least one search keyword.`);
  }
  const keywordSet = new Set();
  for (const keyword of icon.keywords) {
    if (
      typeof keyword !== "string" ||
      keyword.trim() !== keyword ||
      keyword.length === 0
    ) {
      throw new Error(`${icon.name} has an invalid search keyword.`);
    }
    if (keyword !== keyword.toLowerCase()) {
      throw new Error(`${icon.name} keyword must be lowercase: ${keyword}`);
    }
    if (keywordSet.has(keyword)) {
      throw new Error(`${icon.name} repeats search keyword: ${keyword}`);
    }
    keywordSet.add(keyword);
  }
  if (!Array.isArray(icon.elements) || icon.elements.length === 0) {
    throw new Error(`${icon.name} must define at least one SVG element.`);
  }
  for (const element of icon.elements) {
    if (
      element.tag !== "path" ||
      typeof element.d !== "string" ||
      element.d.trim().length === 0
    ) {
      throw new Error(`${icon.name} contains invalid SVG path geometry.`);
    }
  }
  if (icon.fill !== undefined && icon.fill !== "currentColor") {
    throw new Error(`Unsupported icon fill for ${icon.name}: ${icon.fill}`);
  }
  const geometry = JSON.stringify(icon.elements);
  const duplicateGeometry = geometries.get(geometry);
  if (duplicateGeometry !== undefined) {
    throw new Error(
      `${icon.name} duplicates ${duplicateGeometry} geometry; prefer keywords over aliases.`,
    );
  }
  geometries.set(geometry, icon.name);
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
