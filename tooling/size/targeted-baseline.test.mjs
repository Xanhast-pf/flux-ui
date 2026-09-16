import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
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
import { bundledEntryMethod } from "./bundled-entry.mjs";
import { targetedBaseline, targetedBaselineText } from "./baseline.mjs";

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), "flux-targeted-size-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const dist = join(root, "packages/react/dist");
  const size = join(root, "tooling/size");
  await mkdir(dist, { recursive: true });
  await mkdir(size, { recursive: true });
  const components = {};
  for (const [name, slug] of [
    ["DataTable", "data-table"],
    ["Knob", "knob"],
    ["Slider", "slider"],
  ]) {
    const dir = join(root, "packages/react/src/components", name);
    await mkdir(dir, { recursive: true });
    await writeFile(
      join(dir, "component.meta.json"),
      JSON.stringify({ name, slug }),
    );
    // Unselected syntax passes graph inspection but cannot be bundled.
    await writeFile(
      join(dist, `${slug}.js`),
      slug === "slider" ? "export { missing };" : "export const value = 1;",
    );
    components[slug] = {
      name,
      raw: 1,
      gzip: 1,
      brotli: 1,
      bundled: { raw: 0, gzip: 0, brotli: 0 },
    };
  }
  await writeFile(join(dist, "index.js"), "export {};");
  const original = {
    schemaVersion: 2,
    budgetsVersion: 1,
    bundledEntryMethod,
    aggregate: { note: "preserve" },
    components: { ...components, removed: { note: "historical" } },
  };
  const path = join(size, "baseline.json");
  const bytes = `${JSON.stringify(original, null, 2)}\n`.replace(
    '"note": "historical"',
    '"note" :    "historical"',
  );
  await writeFile(path, bytes);
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
  return { dist, size, original, path, bytes, run };
}

test("targeted review normalizes explicit selection, measures global diagnostics, and writes nothing", async (t) => {
  const { run, path, bytes } = await fixture(t);
  for (const slugs of ["knob", "knob,data-table", "data-table,knob"]) {
    const result = run(
      "--",
      "--review-bundled-baseline",
      `--components=${slugs}`,
    );
    assert.equal(result.status, 0, result.stderr);
    const report = JSON.parse(result.stdout);
    const selected = slugs.split(",").sort();
    assert.deepEqual(report.bundledEntryCoverage.measured, selected);
    assert.deepEqual(
      report.bundledEntryCoverage.unmeasured,
      ["data-table", "knob", "slider"].filter(
        (slug) => !selected.includes(slug),
      ),
    );
    assert.deepEqual(Object.keys(report.bundledEntries), selected);
    assert.deepEqual(Object.keys(report.baselineChanges), selected);
    assert.equal(report.checkedComponentCount, selected.length);
    assert.equal(Object.keys(report.emittedGraphs).length, 3);
    assert.ok(report.emittedGraphs.slider.raw > 0);
    assert.ok(report.aggregate.runtime.raw > 0);
    assert.ok(report.aggregate.published.raw > 0);
    assert.equal(await readFile(path, "utf8"), bytes);
  }
});

test("invalid and competing selections fail before baseline writes", async (t) => {
  const { run, path, bytes } = await fixture(t);
  for (const flags of [
    ["--components=unknown"],
    ["--components="],
    ["--components=knob,"],
    ["--components=,knob"],
    ["--components=knob,,data-table"],
    ["--components=Knob"],
    ["--components= knob"],
    ["--components=../knob"],
    ["--components"],
    ["--components=knob,knob"],
    ["--components=knob", "--components=data-table"],
    ["--components=knob", "--components=knob"],
    ["--components=knob", "--changed"],
    ["--components=knob", "--release"],
    ["--components=knob", "--review-bundled-baseline"],
    ["--components=knob", "--update-baseline"],
  ]) {
    const result = run("--update-bundled-baseline", ...flags);
    assert.equal(result.status, 1, flags.join(" "));
    assert.match(
      result.stderr,
      /Unknown component|--components|legacy --update-baseline/,
    );
    assert.equal(await readFile(path, "utf8"), bytes);
  }
  assert.equal(run("--components=knob").status, 1);
});

test("targeted update changes only selected bundled objects and retains atomic writes", async (t) => {
  const { run, path, bytes, original, size } = await fixture(t);
  await writeFile(`${path}.pending`, "owned");
  const occupied = run(
    "--update-bundled-baseline",
    "--components=knob,data-table",
  );
  assert.equal(occupied.status, 1);
  assert.match(occupied.stderr, /EEXIST/);
  assert.equal(await readFile(path, "utf8"), bytes);
  assert.equal(await readFile(`${path}.pending`, "utf8"), "owned");
  await rm(`${path}.pending`);
  const result = run(
    "--update-bundled-baseline",
    "--components=knob,data-table",
  );
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  const updated = JSON.parse(await readFile(path, "utf8"));
  for (const slug of ["data-table", "knob"]) {
    assert.deepEqual(
      updated.components[slug].bundled,
      report.baselineChanges[slug].after,
    );
    assert.notDeepEqual(
      updated.components[slug].bundled,
      original.components[slug].bundled,
    );
    updated.components[slug].bundled = original.components[slug].bundled;
  }
  assert.deepEqual(updated, original);
  assert.equal(
    await targetedBaselineText(await readFile(path, "utf8"), {
      "data-table": original.components["data-table"].bundled,
      knob: original.components.knob.bundled,
    }),
    bytes,
  );
  assert.deepEqual(await readdir(size), ["baseline.json"]);
});

test("targeted acceptance refuses shared metadata migration", () => {
  for (const baseline of [
    { schemaVersion: 1, bundledEntryMethod },
    {
      schemaVersion: 2,
      bundledEntryMethod: { ...bundledEntryMethod, version: "different" },
    },
  ])
    assert.throws(
      () => targetedBaseline(baseline, {}),
      /review metadata migration separately/,
    );
});

test("targeted update preserves baseline on absolute and aggregate gate failures", async (t) => {
  const { run, path, bytes, dist, original } = await fixture(t);
  await writeFile(
    join(dist, "knob.js"),
    `export const data = ${JSON.stringify("large".repeat(2000))};`,
  );
  const absolute = run("--update-bundled-baseline", "--components=knob");
  assert.equal(absolute.status, 1, absolute.stderr);
  assert.match(absolute.stderr, /exceeds primitive raw budget/);
  assert.equal(await readFile(path, "utf8"), bytes);
  await writeFile(join(dist, "knob.js"), "export const value = 1;");
  delete original.components.removed;
  original.aggregate = { runtime: { raw: 0, gzip: 0, brotli: 0 } };
  const aggregateBytes = JSON.stringify(original);
  await writeFile(path, aggregateBytes);
  const aggregate = run("--update-bundled-baseline", "--components=knob");
  assert.equal(aggregate.status, 1, aggregate.stderr);
  assert.match(aggregate.stderr, /aggregate runtime .* regression/);
  assert.equal(await readFile(path, "utf8"), aggregateBytes);
});

test("targeted text refuses missing bundled objects without changing source", async () => {
  const source = JSON.stringify({
    schemaVersion: 2,
    budgetsVersion: 1,
    bundledEntryMethod,
    components: { knob: {} },
  });
  await assert.rejects(
    targetedBaselineText(source, { knob: { raw: 1, gzip: 1, brotli: 1 } }),
    /existing bundled baseline/,
  );
  await assert.rejects(
    targetedBaselineText(source, { unknown: { raw: 1, gzip: 1, brotli: 1 } }),
    /existing component baseline/,
  );
});
