import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

const sourceRoot = resolve(import.meta.dirname, "../../packages/react/src");

// Import boundaries complement, not replace, the emitted JS + CSS size gate.
for (const name of ["IconButton", "Toolbar"]) {
  test(`${name} has no runtime dependency on the full Button or Separator`, async () => {
    const source = await readFile(
      resolve(sourceRoot, `components/${name}/${name}.tsx`),
      "utf8",
    );
    assert.doesNotMatch(
      source,
      /from\s+["'][^"']*\/(?:Button\/Button|Separator\/Separator)\.js["']/u,
    );
    assert.doesNotMatch(source, /from\s+["']@vanilla-extract\//u);
    assert.match(source, /<button\s/u);
  });
}

test("only IconButton carries the full action variant matrix", async () => {
  const iconSource = await readFile(
    resolve(sourceRoot, "components/IconButton/IconButton.tsx"),
    "utf8",
  );
  const toolbarSource = await readFile(
    resolve(sourceRoot, "components/Toolbar/Toolbar.tsx"),
    "utf8",
  );
  assert.match(iconSource, /data-variant=\{variant\}/u);
  assert.match(iconSource, /data-tone=\{tone\}/u);
  assert.doesNotMatch(toolbarSource, /data-(?:variant|tone|size)=/u);
});

test("action style factory is referenced only by build-time stylesheets", async () => {
  const imports = [];
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) await walk(path);
      else if (/\.tsx?$/u.test(entry.name)) {
        const source = await readFile(path, "utf8");
        if (/from\s+["'][^"']*\/actionButtonStyles\.js["']/u.test(source)) {
          imports.push(path);
          assert.ok(
            path.endsWith(".css.ts"),
            `${path} must not import the CSS factory at runtime`,
          );
        }
      }
    }
  }
  await walk(sourceRoot);
  assert.deepEqual(imports, [
    resolve(sourceRoot, "components/IconButton/IconButton.css.ts"),
  ]);
});
