import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
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
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  aggregateMethod,
  aggregateSnapshotState,
} from "./aggregate-baseline.mjs";
import { aggregateBaselineText } from "./baseline.mjs";
import { bundledEntryMethod } from "./bundled-entry.mjs";

const metric = { raw: 0, gzip: 0, brotli: 0, fileCount: 1 };
const legacy = { rootEntry: metric, runtime: metric, published: metric };
async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), "flux-aggregate-size-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const dist = join(root, "packages/react/dist");
  const source = join(root, "packages/react/src/components/Example");
  const size = join(root, "tooling/size");
  for (const dir of [dist, source, size]) await mkdir(dir, { recursive: true });
  await writeFile(
    join(source, "component.meta.json"),
    JSON.stringify({ name: "Example", slug: "example" }),
  );
  await writeFile(join(dist, "example.js"), "export const value = 1;");
  await writeFile(join(dist, "index.js"), 'export * from "./example.js";');
  const baseline = {
    schemaVersion: 2,
    budgetsVersion: 1,
    bundledEntryMethod,
    aggregate: legacy,
    components: { example: { bundled: { raw: 500, gzip: 500, brotli: 500 } } },
    note: "preserve",
  };
  const path = join(size, "baseline.json");
  const bytes = JSON.stringify(baseline, null, 2).replace(
    '"note": "preserve"',
    '"note" :   "preserve"',
  );
  await writeFile(path, bytes);
  const run = (...args) =>
    spawnSync(
      process.execPath,
      [fileURLToPath(new URL("./check.mjs", import.meta.url)), ...args],
      { cwd: root, encoding: "utf8", timeout: 20000 },
    );
  return { dist, size, path, bytes, baseline, run };
}

test("legacy review is a readable, read-only proposal despite aggregate regressions", async (t) => {
  const { run, path, bytes } = await fixture(t);
  const review = run("--review-aggregate-baseline");
  assert.equal(review.status, 0, review.stderr);
  assert.match(review.stdout, /proposal — NOT ACCEPTED/);
  assert.match(review.stdout, /legacy \/ not attributable/);
  assert.match(review.stdout, /rootEntry \| 0 \/ 0 \/ 0 \/ 1/);
  assert.match(review.stdout, /snapshot components: unknown \(legacy\) → 1/);
  assert.equal(await readFile(path, "utf8"), bytes);
  for (const flags of [[], ["--release"]]) {
    const check = run(...flags);
    assert.equal(check.status, 1);
    assert.match(check.stderr, /baseline stale/);
  }
});

test("aggregate update is deterministic, atomic and preserves unrelated bytes", async (t) => {
  const { run, path, bytes, size, baseline } = await fixture(t);
  await writeFile(`${path}.pending`, "owned");
  const occupied = run("--update-aggregate-baseline");
  assert.equal(occupied.status, 1);
  assert.match(occupied.stderr, /EEXIST/);
  assert.equal(await readFile(path, "utf8"), bytes);
  assert.equal(await readFile(`${path}.pending`, "utf8"), "owned");
  await rm(`${path}.pending`);
  const update = run("--update-aggregate-baseline", "--json");
  assert.equal(update.status, 0, update.stderr);
  const report = JSON.parse(update.stdout);
  const updatedText = await readFile(path, "utf8");
  const updated = JSON.parse(updatedText);
  assert.deepEqual(updated.aggregate, {
    ...report.aggregate,
    componentCount: report.componentCount,
    method: report.aggregateMethod,
  });
  assert.equal(updated.aggregate.componentCount, 1);
  assert.deepEqual(updated.aggregate.method, aggregateMethod);
  assert.deepEqual({ ...updated, aggregate: baseline.aggregate }, baseline);
  assert.equal(
    await aggregateBaselineText(updatedText, baseline.aggregate),
    await aggregateBaselineText(bytes, baseline.aggregate),
  );
  assert.equal(run("--update-aggregate-baseline").status, 0);
  assert.equal(await readFile(path, "utf8"), updatedText);
  assert.deepEqual(await readdir(size), ["baseline.json"]);
  assert.equal(run().status, 0);
});

test("component and absolute aggregate failures block review and update without writes", async (t) => {
  const { run, path, bytes, baseline, dist } = await fixture(t);
  const modes = ["--review-aggregate-baseline", "--update-aggregate-baseline"];
  for (const bundled of [undefined, {}, { raw: 0, gzip: 0, brotli: 0 }]) {
    baseline.components.example.bundled = bundled;
    const source = JSON.stringify(baseline);
    await writeFile(path, source);
    for (const mode of modes) {
      const result = run(mode);
      assert.equal(result.status, 1);
      assert.match(result.stderr, /bundled baseline|bundled .* regression/);
      assert.equal(await readFile(path, "utf8"), source);
    }
  }
  await writeFile(path, bytes);
  await writeFile(
    join(dist, "index.js"),
    `export const data = ${JSON.stringify(randomBytes(5000).toString("hex"))};`,
  );
  for (const mode of modes) {
    const result = run(mode);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /root-entry exceeds/);
    assert.equal(await readFile(path, "utf8"), bytes);
  }
  await writeFile(join(dist, "index.js"), "export {};");
  await writeFile(
    join(dist, "example.js"),
    `export const data = ${JSON.stringify("large".repeat(2000))};`,
  );
  for (const mode of modes) {
    assert.match(run(mode).stderr, /exceeds primitive raw budget/);
    assert.equal(await readFile(path, "utf8"), bytes);
  }
});

test("snapshot identity controls applicability independently of component baselines", async (t) => {
  const { run, path, baseline } = await fixture(t);
  baseline.aggregate = {
    ...legacy,
    componentCount: 1,
    method: aggregateMethod,
  };
  baseline.components.historical = {};
  await writeFile(path, JSON.stringify(baseline));
  const applicable = run();
  assert.equal(applicable.status, 1);
  assert.match(applicable.stderr, /aggregate runtime .* regression/);
  assert.equal(run("--review-aggregate-baseline").status, 0);
  for (const aggregate of [
    { ...baseline.aggregate, componentCount: 2 },
    {
      ...baseline.aggregate,
      method: { ...aggregateMethod, build: "different" },
    },
    legacy,
  ]) {
    await writeFile(path, JSON.stringify({ ...baseline, aggregate }));
    for (const flags of [[], ["--release"]]) {
      const stale = run(...flags);
      assert.equal(stale.status, 1);
      assert.match(stale.stderr, /baseline stale/);
      assert.doesNotMatch(stale.stderr, /aggregate runtime .* regression/);
    }
  }
});

test("malformed state and invalid output fail safely", async (t) => {
  const { run, path, baseline, bytes, dist } = await fixture(t);
  for (const aggregate of [
    null,
    {},
    { ...legacy, componentCount: 1, method: {} },
    { ...legacy, runtime: { ...metric, raw: -1 } },
    { ...legacy, componentCount: "1", method: aggregateMethod },
  ]) {
    const source = JSON.stringify({ ...baseline, aggregate });
    await writeFile(path, source);
    for (const mode of [
      "--review-aggregate-baseline",
      "--update-aggregate-baseline",
      "--release",
    ]) {
      const result = run(mode);
      assert.equal(result.status, 1);
      assert.match(result.stderr, /baseline malformed/);
      assert.equal(await readFile(path, "utf8"), source);
    }
  }
  await writeFile(path, bytes);
  await writeFile(join(dist, "example.js"), 'export * from "./missing.js";');
  assert.equal(run("--update-aggregate-baseline").status, 1);
  assert.equal(await readFile(path, "utf8"), bytes);
  await assert.rejects(
    aggregateBaselineText('{"aggregate": {}, "aggregate": {}}', legacy),
    /exactly one/,
  );
  assert.equal(aggregateSnapshotState(undefined, {}).status, "stale");
});

test("aggregate modes reject incompatible options before any writes", async (t) => {
  const { run, path, bytes } = await fixture(t);
  for (const mode of [
    "--review-aggregate-baseline",
    "--update-aggregate-baseline",
  ]) {
    for (const flag of [
      "--review-bundled-baseline",
      "--update-bundled-baseline",
      "--changed",
      "--release",
      "--components=example",
      "--update-baseline",
    ]) {
      assert.equal(run(mode, flag).status, 1, `${mode} ${flag}`);
      assert.equal(await readFile(path, "utf8"), bytes);
    }
  }
  assert.equal(
    run("--review-aggregate-baseline", "--update-aggregate-baseline").status,
    1,
  );
});
