import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const icons = JSON.parse(await read("packages/icons/icons.json"));
const mark = icons.find((icon) => icon.name === "FluxMark");

test("the ribbon replaces FluxMark without adding a second catalog icon", async () => {
  assert.equal(icons.filter((icon) => icon.name === "FluxMark").length, 1);
  assert.equal(mark.fill, "currentColor");
  assert.equal(mark.elements.length, 3);
  const source = await read("packages/icons/src/icons/FluxMarkIcon.tsx");
  assert.match(source, /fill="currentColor" stroke="none"/u);
  assert.doesNotMatch(source, /linearGradient|useId|image|fetch/u);
  for (const element of mark.elements) assert.ok(source.includes(element.d));
});

test("brand SVGs share manifest paths, stay raster-free and have identical served copies", async () => {
  for (const name of [
    "flux-mark.svg",
    "flux-mark-mono.svg",
    "flux-app-icon.svg",
  ]) {
    const svg = await read(`packages/identity/brand/${name}`);
    assert.equal(svg, await read(`apps/docs/public/${name}`));
    assert.match(svg, /viewBox="0 0 20 20"/u);
    assert.doesNotMatch(
      svg,
      /<image|<script|<text|<filter|<foreignObject|data:|@font-face/iu,
    );
    assert.equal((svg.match(/<path /gu) ?? []).length, 3);
    for (const element of mark.elements) assert.ok(svg.includes(element.d));
    const ids = [...svg.matchAll(/\bid="([^"]+)"/gu)].map((match) => match[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const [, id] of svg.matchAll(/url\(#([^)]+)\)/gu))
      assert.ok(ids.includes(id));
  }
});

test("brand assets are deterministic and included in strict generation verification", async () => {
  const result = spawnSync(
    process.execPath,
    ["scripts/generate-brand.mjs", "--check"],
    {
      cwd: root,
      encoding: "utf8",
    },
  );
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const manifest = JSON.parse(await read("package.json"));
  assert.match(manifest.scripts.generate, /generate-brand\.mjs/u);
  assert.match(
    manifest.scripts["generate:check"],
    /generate-brand\.mjs --check/u,
  );
});

test("the shell and favicon use base-aware SVG URLs", async () => {
  const app = await read("apps/docs/src/App.tsx");
  const html = await read("apps/docs/index.html");
  assert.match(app, /import\.meta\.env\.BASE_URL\}flux-mark\.svg/u);
  assert.match(html, /%BASE_URL%flux-app-icon\.svg/u);
  assert.doesNotMatch(app, /\.png|mobile-header-row/u);
});
