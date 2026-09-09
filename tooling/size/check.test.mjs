import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import {
  absoluteBudgetFailures,
  collectRuntimeGraph,
  compressMetrics,
  regressionFailures,
  toEntrySlug,
} from "./lib.mjs";

test("entry slugs follow Flux component naming", () => {
  assert.equal(toEntrySlug("Button"), "button");
  assert.equal(toEntrySlug("SegmentedControl"), "segmented-control");
});

test("compression metrics are deterministic and ordered", () => {
  const metrics = compressMetrics(Buffer.from("Flux UI ".repeat(200)));
  assert.equal(metrics.raw, 1600);
  assert.ok(metrics.gzip < metrics.raw);
  assert.ok(metrics.brotli < metrics.raw);
});

test("runtime graph follows relative JS and CSS imports only", async () => {
  const dir = await mkdtemp(resolve(tmpdir(), "flux-size-"));
  try {
    await mkdir(resolve(dir, "chunks"));
    await mkdir(resolve(dir, "assets"));
    await writeFile(
      resolve(dir, "button.js"),
      'import "./assets/button.css"; export { value } from "./chunks/shared.js";\n',
    );
    await writeFile(
      resolve(dir, "chunks/shared.js"),
      "export const value = 1;\n",
    );
    await writeFile(resolve(dir, "assets/button.css"), ".x{display:block}\n");

    const graph = await collectRuntimeGraph(resolve(dir, "button.js"), dir);
    assert.deepEqual(
      graph.map((path) => path.replace(`${dir}/`, "")),
      ["assets/button.css", "button.js", "chunks/shared.js"],
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("absolute budgets fail only when a component exceeds its class", () => {
  const component = { name: "Example", sizeClass: "primitive" };
  assert.equal(
    absoluteBudgetFailures(component, { raw: 100, gzip: 80, brotli: 60 })
      .length,
    0,
  );
  assert.deepEqual(
    absoluteBudgetFailures(component, { raw: 100, gzip: 80, brotli: 2000 }).map(
      (failure) => failure.metric,
    ),
    ["brotli"],
  );
});

test("regression policy rejects meaningful growth but tolerates tiny deltas", () => {
  const baseline = { raw: 1000, gzip: 500, brotli: 400 };
  assert.equal(
    regressionFailures({ raw: 1040, gzip: 520, brotli: 420 }, baseline).length,
    0,
  );
  assert.deepEqual(
    regressionFailures({ raw: 1200, gzip: 700, brotli: 600 }, baseline).map(
      (failure) => failure.metric,
    ),
    ["raw", "gzip", "brotli"],
  );
});
