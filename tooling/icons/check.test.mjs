import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [packageJson, iconBase, toolbar] = await Promise.all([
  readFile(
    new URL("../../packages/icons/package.json", import.meta.url),
    "utf8",
  ),
  readFile(
    new URL("../../packages/icons/src/IconBase.tsx", import.meta.url),
    "utf8",
  ),
  readFile(new URL("../../package.json", import.meta.url), "utf8"),
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
