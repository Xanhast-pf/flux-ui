import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

test("size CLI keeps success concise, failures detailed and JSON clean", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "flux-output-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const dist = join(root, "packages/react/dist");
  const source = join(root, "packages/react/src/components/Example");
  const size = join(root, "tooling/size");
  for (const directory of [dist, source, size])
    await mkdir(directory, { recursive: true });
  await writeFile(
    join(source, "component.meta.json"),
    JSON.stringify({
      name: "Example",
      slug: "example",
      sizeClass: "primitive",
    }),
  );
  await writeFile(join(dist, "example.js"), "export const value = 1;");
  await writeFile(join(dist, "index.js"), "export {};");
  const save = (value) =>
    writeFile(
      join(size, "baseline.json"),
      JSON.stringify({
        budgetsVersion: 1,
        components: {
          example: { bundled: { raw: value, gzip: value, brotli: value } },
        },
      }),
    );
  const run = (...args) =>
    spawnSync(
      process.execPath,
      [fileURLToPath(new URL("./check.mjs", import.meta.url)), ...args],
      { cwd: root, encoding: "utf8" },
    );
  await save(500);
  const concise = run();
  assert.equal(concise.status, 0, concise.stderr);
  assert.doesNotMatch(concise.stdout, /Example \(primitive\)/u);
  assert.match(concise.stdout, /components\s+1/u);
  const verbose = run("--verbose");
  assert.equal(verbose.status, 0, verbose.stderr);
  assert.match(verbose.stdout, /Example \(primitive\)/u);
  assert.equal(JSON.parse(run("--json").stdout).componentCount, 1);
  await save(0);
  const failed = run();
  assert.equal(failed.status, 1);
  assert.match(failed.stdout, /Example \(primitive\)/u);
  assert.match(failed.stderr, /regression/u);
  assert.equal(
    JSON.parse(run("--json").stdout).componentGates.example.result,
    "fail",
  );
});
