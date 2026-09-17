import { aggregateMethod } from "./aggregate-baseline.mjs";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { bundledRegressions } from "./baseline.mjs";
import { measureEntry, measureFiles, listRuntimeFiles } from "./lib.mjs";
import { measureBundledEntry } from "./bundled-entry.mjs";

async function fixture(t, files) {
  const root = await mkdtemp(join(tmpdir(), "flux-bundled-size-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const [name, source] of Object.entries(files))
    await writeFile(join(root, name), source);
  return root;
}

const helper = `function attach(ref, node) {
  if (typeof ref === "function") {
    const cleanup = ref(node);
    return typeof cleanup === "function" ? cleanup : () => ref(null);
  }
  if (ref) {
    ref.current = node;
    return () => { ref.current = null; };
  }
}`;
const component = `export function Component(ref, node) {
  node.indeterminate = true;
  return attach(ref, node);
}`;

test("extracting a live helper preserves bundled cost within 8 Brotli bytes", async (t) => {
  const before = await fixture(t, { "entry.js": helper + component });
  const after = await fixture(t, {
    "entry.js": 'import { attach } from "./helper.js";' + component,
    "helper.js": "export " + helper,
  });
  const local = await measureBundledEntry(join(before, "entry.js"), before);
  const extracted = await measureBundledEntry(join(after, "entry.js"), after);
  assert.ok(Math.abs(local.brotli - extracted.brotli) <= 8);
  assert.deepEqual(bundledRegressions(extracted, local), []);
  assert.equal(local.fileCount, 1);
  assert.equal(extracted.fileCount, 1);
  t.diagnostic(
    `local ${local.brotli} B; extracted ${extracted.brotli} B Brotli`,
  );
});

test("genuinely added live runtime behavior increases bundled cost", async (t) => {
  const root = await fixture(t, { "entry.js": helper + component });
  const before = await measureBundledEntry(join(root, "entry.js"), root);
  await writeFile(
    join(root, "entry.js"),
    helper +
      component +
      `
    export function describe(node) {
      if (!node || typeof node.getAttribute !== "function")
        throw new TypeError("Expected an element with accessible state");
      return {
        disabled: node.hasAttribute("disabled"),
        invalid: node.getAttribute("aria-invalid") === "true",
        label: node.getAttribute("aria-label") || node.textContent.trim(),
        roles: (node.getAttribute("role") || "").split(/\\s+/).filter(Boolean)
      };
    }
  `,
  );
  const after = await measureBundledEntry(join(root, "entry.js"), root);
  for (const metric of ["raw", "gzip", "brotli"])
    assert.ok(after[metric] > before[metric] + 32);
  assert.deepEqual(
    bundledRegressions(after, before).map((failure) => failure.metric),
    ["raw", "gzip", "brotli"],
  );
  t.diagnostic(
    `before ${before.brotli} B; added behavior ${after.brotli} B Brotli`,
  );
});

test("bundles CSS and dynamic imports, externalizes peers, and writes no output", async (t) => {
  const root = await fixture(t, {
    "entry.js": `
      import { createElement } from "react";
      import { jsx } from "react/jsx-runtime";
      export { createPortal } from "react-dom";
      import "./entry.css";
      export const Component = () => createElement("div", null, jsx("span", {}));
      export const load = () => import("./helper.js");
    `,
    "helper.js": "export const value = 42;",
    "entry.css": '@import "./shared.css"; .entry { display: flex; }',
    "shared.css": ".shared { color: red; }",
    "unused.test.js": "invalid test syntax !!!",
    "unused.stories.js": "invalid story syntax !!!",
  });
  const files = await readdir(root);
  const first = await measureBundledEntry(join(root, "entry.js"), root);
  const second = await measureBundledEntry(join(root, "entry.js"), root);
  assert.deepEqual(first, second);
  assert.deepEqual(await readdir(root), files);
  assert.equal(first.fileCount, 2);
  assert.ok(first.outputs.js.raw > 0);
  assert.ok(first.outputs.css.raw > 0);
  assert.deepEqual(first.externalImports, [
    "react",
    "react-dom",
    "react/jsx-runtime",
  ]);
  for (const metric of ["raw", "gzip", "brotli"])
    assert.equal(
      first[metric],
      first.outputs.js[metric] + first.outputs.css[metric],
    );
  await writeFile(
    join(root, "shared.css"),
    ".shared { color: red; border: 1px solid blue; padding: 2rem; }",
  );
  const styled = await measureBundledEntry(join(root, "entry.js"), root);
  assert.ok(styled.outputs.css.raw > first.outputs.css.raw);
});

test("measurement is independent of checkout location and unused modules", async (t) => {
  const files = { "entry.js": helper + component };
  const first = await fixture(t, files);
  const second = await fixture(t, files);
  await mkdir(join(second, "docs"));
  await writeFile(join(second, "docs", "unused.js"), "invalid docs syntax !!!");
  assert.deepEqual(
    await measureBundledEntry(join(first, "entry.js"), first),
    await measureBundledEntry(join(second, "entry.js"), second),
  );
});

test("bundling retains missing-file and external-engine validation", async (t) => {
  const root = await fixture(t, { "entry.js": 'import "unaccounted-engine";' });
  await assert.rejects(
    measureBundledEntry(join(root, "entry.js"), root),
    /Unaccounted external/,
  );
  await writeFile(join(root, "entry.js"), 'export * from "./missing.js";');
  await assert.rejects(
    measureBundledEntry(join(root, "entry.js"), root),
    /Unresolved local runtime import/,
  );
});

test("CLI explicitly rejects missing bundled baselines and preserves diagnostics", async (t) => {
  const root = await fixture(t, {});
  const dist = join(root, "packages/react/dist");
  const componentDir = join(root, "packages/react/src/components/Example");
  const sizeDir = join(root, "tooling/size");
  for (const dir of [dist, componentDir, sizeDir])
    await mkdir(dir, { recursive: true });
  await writeFile(
    join(componentDir, "component.meta.json"),
    JSON.stringify({
      name: "Example",
      slug: "example",
      sizeClass: "primitive",
    }),
  );
  await writeFile(join(dist, "example.js"), helper + component);
  await writeFile(join(dist, "index.js"), 'export * from "./example.js";');
  const baseline = JSON.stringify({
    schemaVersion: 1,
    budgetsVersion: 1,
    components: { example: { raw: 1, gzip: 1, brotli: 1 } },
  });
  const baselinePath = join(sizeDir, "baseline.json");
  await writeFile(baselinePath, baseline);
  const result = spawnSync(
    process.execPath,
    [fileURLToPath(new URL("./check.mjs", import.meta.url)), "--json"],
    { cwd: root, encoding: "utf8", timeout: 20_000 },
  );
  assert.equal(result.error, undefined);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Example has no valid bundled baseline/);
  const report = JSON.parse(result.stdout);
  assert.equal(report.componentCount, 1);
  assert.deepEqual(Object.keys(report.bundledEntries), ["example"]);
  assert.ok(report.components.example.brotli > 1);
  assert.ok(report.bundledEntries.example.brotli > 1);
  assert.equal(report.bundledEntryMethod.splitting, false);
  assert.ok(report.aggregate.runtime.brotli > 0);
  assert.equal(await readFile(baselinePath, "utf8"), baseline);
  const review = spawnSync(
    process.execPath,
    [
      fileURLToPath(new URL("./check.mjs", import.meta.url)),
      "--json",
      "--review-bundled-baseline",
    ],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(review.status, 0, review.stderr);
  assert.deepEqual(JSON.parse(review.stdout).baselineChanges.example, {
    before: null,
    after: report.bundledEntries.example,
  });
  assert.equal(await readFile(baselinePath, "utf8"), baseline);
  const legacy = spawnSync(
    process.execPath,
    [
      fileURLToPath(new URL("./check.mjs", import.meta.url)),
      "--update-baseline",
    ],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(legacy.status, 1);
  assert.match(legacy.stderr, /legacy --update-baseline/);
  assert.equal(await readFile(baselinePath, "utf8"), baseline);

  assert.deepEqual((await readdir(dist)).sort(), ["example.js", "index.js"]);
});

test("--changed bundles only selected entries while measuring every emitted graph", async (t) => {
  const root = await fixture(t, {});
  const dist = join(root, "packages/react/dist");
  await mkdir(dist, { recursive: true });
  await mkdir(join(root, "tooling/size"), { recursive: true });
  for (const name of ["Selected", "Unrelated"]) {
    const dir = join(root, "packages/react/src/components", name);
    await mkdir(dir, { recursive: true });
    await writeFile(
      join(dir, "component.meta.json"),
      JSON.stringify({ name, slug: name.toLowerCase() }),
    );
  }
  await writeFile(join(dist, "selected.js"), "export const value = 1;");
  // Valid emitted-graph syntax, but esbuild must reject the missing export.
  await writeFile(join(dist, "unrelated.js"), "export { missing };");
  await writeFile(join(dist, "index.js"), "export {};");
  await writeFile(
    join(root, "tooling/size/baseline.json"),
    JSON.stringify({
      budgetsVersion: 1,
      aggregate: {
        componentCount: 2,
        method: aggregateMethod,
        ...Object.fromEntries(
          ["rootEntry", "runtime", "published"].map((name) => [
            name,
            { raw: 1000, gzip: 1000, brotli: 1000, fileCount: 3 },
          ]),
        ),
      },
      components: {
        selected: {
          raw: 1,
          gzip: 1,
          brotli: 1,
          bundled: { raw: 100, gzip: 100, brotli: 100 },
        },
      },
    }),
  );
  const git = (...args) => {
    const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
  };
  git("init");
  git("add", ".");
  git(
    "-c",
    "commit.gpgsign=false",
    "-c",
    "core.hooksPath=/dev/null",
    "-c",
    "user.name=Size test",
    "-c",
    "user.email=size@example.invalid",
    "commit",
    "-m",
    "fixture",
  );
  const run = (...args) =>
    spawnSync(
      process.execPath,
      [
        fileURLToPath(new URL("./check.mjs", import.meta.url)),
        "--json",
        ...args,
      ],
      { cwd: root, encoding: "utf8", timeout: 20_000 },
    );
  const empty = run("--changed");
  assert.equal(empty.status, 0, empty.stderr);
  assert.deepEqual(JSON.parse(empty.stdout).bundledEntries, {});
  await writeFile(
    join(root, "packages/react/src/components/Selected/change.ts"),
    "// changed",
  );
  const changed = run("--changed");
  assert.equal(changed.status, 0, changed.stderr);
  const report = JSON.parse(changed.stdout);
  assert.deepEqual(Object.keys(report.bundledEntries), ["selected"]);
  assert.deepEqual(report.bundledEntryCoverage, {
    measured: ["selected"],
    unmeasured: ["unrelated"],
  });
  assert.ok(report.components.unrelated.brotli > 0);
  assert.deepEqual(
    report.aggregate.runtime,
    await measureFiles(await listRuntimeFiles(dist)),
  );
  const full = run();
  assert.notEqual(full.status, 0);
  assert.match(full.stderr, /missing.*not declared/);
});

test("CLI gates bundled growth and bundled absolute budgets, not emitted growth", async (t) => {
  const root = await fixture(t, {});
  const dist = join(root, "packages/react/dist");
  const source = join(root, "packages/react/src/components/Example");
  const size = join(root, "tooling/size");
  for (const dir of [dist, source, size]) await mkdir(dir, { recursive: true });
  await writeFile(
    join(source, "component.meta.json"),
    JSON.stringify({
      name: "Example",
      slug: "example",
      sizeClass: "primitive",
    }),
  );
  const entry = join(dist, "example.js");
  await writeFile(
    entry,
    "/*" + "padding".repeat(1000) + "*/\n" + helper + component,
  );
  await writeFile(join(dist, "index.js"), "export {};");
  const bundled = await measureBundledEntry(entry, dist);
  assert.ok((await measureEntry(entry, dist)).raw > 6144);
  const baselinePath = join(size, "baseline.json");
  const save = (values) =>
    writeFile(
      baselinePath,
      JSON.stringify({
        budgetsVersion: 1,
        aggregate: {
          componentCount: 1,
          method: aggregateMethod,
          ...Object.fromEntries(
            ["rootEntry", "runtime", "published"].map((name) => [
              name,
              { raw: 100000, gzip: 100000, brotli: 100000, fileCount: 2 },
            ]),
          ),
        },
        components: {
          example: { raw: 1, gzip: 1, brotli: 1, bundled: values },
        },
      }),
    );
  const run = () =>
    spawnSync(
      process.execPath,
      [fileURLToPath(new URL("./check.mjs", import.meta.url)), "--json"],
      { cwd: root, encoding: "utf8" },
    );
  await save(bundled);
  const passing = run();
  assert.equal(passing.status, 0, passing.stderr);
  assert.equal(
    JSON.parse(passing.stdout).componentGates.example.result,
    "pass",
  );
  await save({ raw: 0, gzip: 0, brotli: 0 });
  const failing = run();
  assert.equal(failing.status, 1);
  for (const metric of ["raw", "gzip", "brotli"])
    assert.match(failing.stderr, new RegExp(`bundled ${metric} regression`));
  await writeFile(
    entry,
    "export const data = " +
      JSON.stringify(
        Array.from({ length: 2000 }, (_, i) => `value-${i}`).join(","),
      ) +
      ";",
  );
  await save(await measureBundledEntry(entry, dist));
  assert.match(run().stderr, /exceeds primitive raw budget/);
});
