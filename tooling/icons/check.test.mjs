import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [packageJson, iconBase, toolbar, manifestJson, generatedIndex] =
  await Promise.all([
    readFile(
      new URL("../../packages/icons/package.json", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../../packages/icons/src/IconBase.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../../package.json", import.meta.url), "utf8"),
    readFile(
      new URL("../../packages/icons/icons.json", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../../packages/icons/src/index.ts", import.meta.url),
      "utf8",
    ),
  ]);

test("icons stay a standalone tree-shakeable package", () => {
  const pkg = JSON.parse(packageJson);
  assert.equal(pkg.sideEffects, false);
  assert.deepEqual(Object.keys(pkg.peerDependencies), ["react"]);
  assert.match(iconBase, /stroke = "currentColor"/u);
  assert.match(iconBase, /aria-hidden/u);
  assert.doesNotMatch(iconBase, /@flux-ui\/react/u);
});

test("the root size contract measures icons", () => {
  const root = JSON.parse(toolbar);
  assert.match(root.scripts.size, /icons:size/u);
  assert.match(root.scripts["size:release"], /icons:size/u);
});

test("icon manifest stays searchable, unique and fully exported", () => {
  const icons = JSON.parse(manifestJson);
  assert.equal(icons.length, 64);
  const names = new Set();
  const geometries = new Set();
  for (const icon of icons) {
    assert.equal(
      names.has(icon.name),
      false,
      `duplicate icon name: ${icon.name}`,
    );
    names.add(icon.name);
    assert.ok(
      Array.isArray(icon.keywords) && icon.keywords.length > 0,
      `${icon.name} needs keywords`,
    );
    assert.deepEqual(
      [...new Set(icon.keywords)],
      icon.keywords,
      `${icon.name} keywords must be unique`,
    );
    for (const keyword of icon.keywords) {
      assert.equal(
        keyword,
        keyword.toLowerCase(),
        `${icon.name} keyword must be lowercase`,
      );
    }
    const geometry = JSON.stringify(icon.elements);
    assert.equal(
      geometries.has(geometry),
      false,
      `${icon.name} duplicates existing geometry`,
    );
    geometries.add(geometry);
    assert.match(generatedIndex, new RegExp(`export { ${icon.name}Icon }`));
  }
});
