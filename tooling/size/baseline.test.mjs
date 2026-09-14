import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  bundledBaseline,
  bundledRegressions,
  writeBaselineAtomic,
} from "./baseline.mjs";

const metrics = { raw: 100, gzip: 80, brotli: 60 };
test("missing and malformed bundled baselines fail explicitly", () => {
  for (const previous of [
    undefined,
    {},
    { raw: 100 },
    { ...metrics, gzip: -1 },
    { ...metrics, raw: null },
  ]) {
    assert.deepEqual(bundledRegressions(metrics, previous), [
      { metric: "baseline" },
    ]);
  }
});

test("baseline proposals preserve metadata and emitted/aggregate values deterministically", () => {
  const original = {
    schemaVersion: 1,
    budgetsVersion: 1,
    note: "keep",
    aggregate: { runtime: metrics },
    components: { z: { ...metrics, note: "keep" } },
  };
  const copy = structuredClone(original);
  const first = bundledBaseline(original, { z: metrics, a: metrics });
  assert.deepEqual(
    first,
    bundledBaseline(original, { a: metrics, z: metrics }),
  );
  assert.deepEqual(original, copy);
  assert.deepEqual(first.aggregate, original.aggregate);
  assert.deepEqual(first.components.z, {
    ...original.components.z,
    bundled: metrics,
  });
  assert.equal(first.note, "keep");
});

test("atomic writer preserves original on serialization failure and refuses an occupied temporary path", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "flux-baseline-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const path = join(dir, "baseline.json");
  await writeFile(path, "original");
  await assert.rejects(writeBaselineAtomic(path, { invalid: 1n }));
  assert.equal(await readFile(path, "utf8"), "original");
  assert.deepEqual(await readdir(dir), ["baseline.json"]);
  await writeFile(`${path}.pending`, "owned");
  await assert.rejects(writeBaselineAtomic(path, metrics), /EEXIST/);
  assert.equal(await readFile(path, "utf8"), "original");
  assert.equal(await readFile(`${path}.pending`, "utf8"), "owned");
  await rm(`${path}.pending`);
  await writeBaselineAtomic(path, metrics);
  const first = await readFile(path, "utf8");
  await writeBaselineAtomic(path, metrics);
  assert.equal(await readFile(path, "utf8"), first);
});
