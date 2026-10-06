import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
const directory = new URL(
  "../../apps/docs/src/perf/scenarios/",
  import.meta.url,
);
const componentsDirectory = new URL(
  "../../packages/react/src/components/",
  import.meta.url,
);
const examplesDirectory = new URL(
  "../../apps/docs/src/examples/",
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

test("every public component has dedicated or representative browser workload coverage", async () => {
  const [scenarioFiles, exampleFiles, componentEntries] = await Promise.all([
    readdir(directory),
    readdir(examplesDirectory),
    readdir(componentsDirectory, { withFileTypes: true }),
  ]);
  const dedicated = new Set(
    scenarioFiles
      .filter((file) => file.endsWith(".json"))
      .map((file) => file.slice(0, -5)),
  );
  const previews = new Set(
    exampleFiles.filter((file) => file.endsWith(".preview.tsx")),
  );
  const examples = new Set(
    exampleFiles.filter((file) => file.endsWith(".example.tsx")),
  );
  const componentNames = componentEntries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  let fallbackCount = 0;
  for (const name of componentNames) {
    const meta = JSON.parse(
      await readFile(
        new URL(`${name}/component.meta.json`, componentsDirectory),
        "utf8",
      ),
    );
    if (dedicated.has(meta.slug)) continue;
    fallbackCount += 1;
    assert.ok(
      examples.has(`${meta.slug}.example.tsx`),
      `Missing representative example workload for ${meta.slug}`,
    );
    assert.ok(
      previews.has(`${meta.slug}.preview.tsx`),
      `Missing representative preview source for ${meta.slug}`,
    );
  }

  assert.equal(dedicated.size + fallbackCount, componentNames.length);
});
