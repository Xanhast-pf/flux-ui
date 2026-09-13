import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
const directory = new URL(
  "../../apps/docs/src/perf/scenarios/",
  import.meta.url,
);
test("performance discovery has unique paired bounded manifests and fixtures", async () => {
  const files = await readdir(directory);
  const manifests = files.filter((file) => file.endsWith(".json"));
  assert.ok(manifests.length >= 14);
  const ids = new Set();
  for (const file of manifests) {
    const entry = JSON.parse(await readFile(new URL(file, directory), "utf8"));
    assert.equal(file, `${entry.id}.json`);
    assert.ok(!ids.has(entry.id));
    ids.add(entry.id);
    assert.ok(files.includes(`${entry.id}.fixture.tsx`));
    assert.ok(entry.unit && entry.description && entry.fixtureRevision > 0);
    assert.ok(
      Number.isInteger(entry.maxCount) &&
        entry.maxCount >= 100 &&
        entry.maxCount <= 20000,
    );
    assert.ok(["comparison", "workload"].includes(entry.kind));
  }
  assert.equal(
    files.filter((file) => file.endsWith(".fixture.tsx")).length,
    manifests.length,
  );
});
