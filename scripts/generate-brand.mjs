import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = process.cwd();
const checkOnly = process.argv.includes("--check");
const icons = JSON.parse(
  await readFile(resolve(root, "packages/icons/icons.json"), "utf8"),
);
const brand = JSON.parse(
  await readFile(
    resolve(root, "packages/identity/brand/flux-mark.json"),
    "utf8",
  ),
);
const icon = icons.find((entry) => entry.name === brand.icon);
if (!icon || icon.fill !== "currentColor") {
  throw new Error("The Flux brand must reference a filled icon in icons.json.");
}
if (
  brand.schemaVersion !== 1 ||
  brand.gradients.length !== icon.elements.length
) {
  throw new Error("Every ribbon path needs one brand gradient.");
}
const hexColor = /^#[\da-f]{6}$/iu;
if (!hexColor.test(brand.background))
  throw new Error("Invalid app-icon background.");
const ids = new Set();
for (const gradient of brand.gradients) {
  if (!/^[a-z]+$/u.test(gradient.id) || ids.has(gradient.id)) {
    throw new Error("Brand gradient IDs must be unique lowercase names.");
  }
  ids.add(gradient.id);
  for (const point of [gradient.from, gradient.to]) {
    if (
      !Array.isArray(point) ||
      point.length !== 2 ||
      !point.every(Number.isFinite)
    ) {
      throw new Error("Gradient endpoints must be finite coordinate pairs.");
    }
  }
  let previous = -1;
  for (const [offset, color] of gradient.stops) {
    if (
      !Number.isFinite(offset) ||
      offset < 0 ||
      offset > 1 ||
      offset < previous ||
      !hexColor.test(color)
    ) {
      throw new Error("Invalid or unsorted brand gradient stop.");
    }
    previous = offset;
  }
}
for (const element of icon.elements) {
  if (
    element.tag !== "path" ||
    !/^[MmLlHhVvCcSsQqTtAaZz\d\s.,+-]+$/u.test(element.d)
  ) {
    throw new Error("Invalid brand path geometry.");
  }
}

function renderMark({ monochrome = false, appIcon = false } = {}) {
  const definitions = brand.gradients
    .map(
      (gradient) =>
        `    <linearGradient id="flux-${gradient.id}" gradientUnits="userSpaceOnUse" x1="${gradient.from[0]}" y1="${gradient.from[1]}" x2="${gradient.to[0]}" y2="${gradient.to[1]}">\n` +
        gradient.stops
          .map(
            ([offset, color]) =>
              `      <stop offset="${offset}" stop-color="${color}"/>`,
          )
          .join("\n") +
        "\n    </linearGradient>",
    )
    .join("\n");
  const paths = icon.elements
    .map(
      (element, index) =>
        `  <path fill="${monochrome ? "currentColor" : `url(#flux-${brand.gradients[index].id})`}" d="${element.d}"/>`,
    )
    .join("\n");
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" role="img" aria-labelledby="flux-title">',
    '  <title id="flux-title">Flux UI</title>',
    ...(monochrome ? [] : [`  <defs>\n${definitions}\n  </defs>`]),
    ...(appIcon
      ? [
          `  <rect width="20" height="20" rx="4" fill="${brand.background}"/>`,
          '  <g transform="translate(2 2) scale(.8)">',
        ]
      : []),
    paths,
    ...(appIcon ? ["  </g>"] : []),
    "</svg>",
    "",
  ].join("\n");
}

const variants = {
  "flux-mark.svg": renderMark(),
  "flux-mark-mono.svg": renderMark({ monochrome: true }),
  "flux-app-icon.svg": renderMark({ appIcon: true }),
};
for (const [file, expected] of Object.entries(variants)) {
  for (const directory of ["packages/identity/brand", "apps/docs/public"]) {
    const path = resolve(root, directory, file);
    let current;
    try {
      current = await readFile(path, "utf8");
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    if (current === expected) continue;
    if (checkOnly) {
      console.error(`Generated brand asset is stale: ${directory}/${file}`);
      process.exitCode = 1;
    } else {
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, expected, "utf8");
      console.log(`Generated ${directory}/${file}`);
    }
  }
}
