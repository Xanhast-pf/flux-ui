import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  compareAggregates,
  formatAggregateComparison,
  measureAggregate,
} from "./compare-aggregate.mjs";
import { compressMetrics, measureFiles } from "./lib.mjs";

test("isolated aggregate inventories, JSON and text preserve exact measurements", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "flux-aggregate-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const baseline = join(root, "baseline.json");
  await writeFile(baseline, '{"unchanged":true}\n');
  const baselineBefore = await readFile(baseline);
  const measurements = [];
  for (const side of ["base", "current"]) {
    const dist = join(root, side, "packages/react/dist");
    await mkdir(join(dist, "chunks"), { recursive: true });
    await writeFile(join(dist, "index.js"), `export const side = "${side}";`);
    await writeFile(
      join(dist, "chunks", `${side}.js`),
      "export const shared = 1;",
    );
    await writeFile(
      join(dist, "index.d.ts"),
      "export declare const side: string;",
    );
    // Equal metrics do not imply equal content.
    await writeFile(join(dist, "same.js"), side === "base" ? "ab" : "cd");
    if (side === "base") await writeFile(join(dist, "removed.css"), "a{}");
    const measured = await measureAggregate(dist, side === "base" ? 70 : 71);
    assert.deepEqual(
      measured.rootEntry,
      await measureFiles([join(dist, "index.js")]),
    );
    for (const set of ["runtime", "published"]) {
      const sum = { raw: 0, gzip: 0, brotli: 0, fileCount: 0 };
      for (const [path, metrics] of Object.entries(measured.files[set])) {
        assert.ok(
          !path.startsWith("/") &&
            !path.includes("..") &&
            !path.includes("dist/"),
        );
        const expected = compressMetrics(await readFile(join(dist, path)));
        for (const name of ["raw", "gzip", "brotli"]) {
          assert.equal(metrics[name], expected[name]);
          sum[name] += metrics[name];
        }
        sum.fileCount += 1;
      }
      assert.deepEqual(measured[set], sum);
    }
    assert.ok(!measured.files.runtime["index.d.ts"]);
    assert.ok(measured.files.published["index.d.ts"]);
    measurements.push(measured);
  }
  const aggregate = compareAggregates(...measurements);
  const json = JSON.parse(JSON.stringify({ aggregate }));
  assert.deepEqual(json.aggregate.base, measurements[0]);
  assert.deepEqual(json.aggregate.current, measurements[1]);
  for (const set of ["rootEntry", "runtime", "published"]) {
    for (const metric of ["raw", "gzip", "brotli", "fileCount"]) {
      assert.equal(
        aggregate.delta[set][metric],
        measurements[1][set][metric] - measurements[0][set][metric],
      );
      assert.ok(Number.isInteger(aggregate.delta[set][metric]));
    }
  }
  assert.equal(aggregate.delta.runtime.fileCount, -1);
  assert.deepEqual(aggregate.files.runtime.added, ["chunks/current.js"]);
  assert.deepEqual(aggregate.files.runtime.removed, [
    "chunks/base.js",
    "removed.css",
  ]);
  assert.deepEqual(
    aggregate.files.runtime.changed.map(({ path }) => path),
    ["index.js", "same.js"],
  );
  assert.deepEqual(aggregate.files.runtime.changed[1].delta, {
    raw: 0,
    gzip: 0,
    brotli: 0,
  });
  const text = formatAggregateComparison(aggregate);
  assert.match(text, /Aggregate \(raw \/ gzip \/ brotli \/ fileCount\)/u);
  assert.match(text, /Components: 70 → 71/u);
  for (const set of ["rootEntry", "runtime", "published"])
    assert.ok(text.includes(`${set} |`));
  assert.deepEqual(await readFile(baseline), baselineBefore);
  assert.deepEqual(
    await measureAggregate(join(root, "base/packages/react/dist"), 70),
    measurements[0],
  );
});

test("comparison CLI isolates snapshots, emits aggregates and refuses toolchain mismatch", async (t) => {
  const { spawnSync } = await import("node:child_process");
  const { chmod, symlink, readdir } = await import("node:fs/promises");
  const { fileURLToPath } = await import("node:url");
  const root = await mkdtemp(join(tmpdir(), "flux-compare-cli-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const bin = join(root, "bin");
  await mkdir(bin);
  const fixture = join(root, "checkout");
  const contents = {
    "pnpm-lock.yaml": "lockfileVersion: '9.0'\n",
    "pnpm-workspace.yaml": "packages: []\n",
    "packages/react/src/components/Example/component.meta.json": JSON.stringify(
      { name: "Example", slug: "example" },
    ),
    "packages/react/dist/index.js": 'export { value } from "./example.js";\n',
    "packages/react/dist/example.js": "export const value = 1;\n",
    "tooling/size/baseline.json": JSON.stringify({
      budgetsVersion: 1,
      components: {
        example: { bundled: { raw: 1000, gzip: 1000, brotli: 1000 } },
      },
    }),
  };
  const { dirname } = await import("node:path");
  for (const [path, content] of Object.entries(contents)) {
    await mkdir(dirname(join(fixture, path)), { recursive: true });
    await writeFile(join(fixture, path), content);
  }
  await mkdir(join(fixture, "node_modules/@flux-ui"), { recursive: true });
  await symlink(
    join(fixture, "packages/react"),
    join(fixture, "node_modules/@flux-ui/react"),
  );
  const archive = join(root, "base.tar");
  const packed = spawnSync("tar", ["-cf", archive, ...Object.keys(contents)], {
    cwd: fixture,
    encoding: "utf8",
  });
  assert.equal(packed.status, 0, packed.stderr);
  const gitSource = `
import { readFileSync } from "node:fs";
const args = process.argv.slice(2);
if (args[0] === "rev-parse") process.stdout.write("fixture-revision\\n");
else if (args[0] === "archive") process.stdout.write(readFileSync(${JSON.stringify(archive)}));
else if (args[0] === "ls-files") process.stdout.write(${JSON.stringify(Object.keys(contents).join("\0") + "\0")});
else throw new Error("Unexpected Git mutation: " + args.join(" "));
`;
  const pnpmSource = `
import assert from "node:assert/strict";
import { realpathSync, writeFileSync } from "node:fs";
import { join } from "node:path";
assert.equal(process.argv[2], "--filter");
assert.ok(["@flux-ui/tokens", "@flux-ui/icons", "@flux-ui/identity", "@flux-ui/react"].includes(process.argv[3]));
assert.equal(process.argv[4], "build");
assert.notEqual(process.cwd(), ${JSON.stringify(fixture)});
assert.equal(realpathSync("node_modules/@flux-ui/react"), join(process.cwd(), "packages/react"));
writeFileSync("build-cache-marker", "isolated");
`;
  for (const [name, source] of [
    ["git", gitSource],
    ["pnpm", pnpmSource],
  ]) {
    await writeFile(join(bin, name), `#!${process.execPath}\n${source}`);
    await chmod(join(bin, name), 0o755);
  }
  await writeFile(
    join(fixture, "packages/react/dist/example.js"),
    "export const value = 22;\n",
  );
  const baselinePath = join(fixture, "tooling/size/baseline.json");
  const baselineBefore = await readFile(baselinePath);
  const cli = fileURLToPath(new URL("./compare.mjs", import.meta.url));
  const run = (...flags) =>
    spawnSync(process.execPath, [cli, "base", "working-tree", ...flags], {
      cwd: fixture,
      env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
      encoding: "utf8",
    });
  const json = run("--json");
  assert.equal(json.status, 0, json.stderr);
  const report = JSON.parse(json.stdout);
  assert.equal(
    report.aggregate.base.runtime.raw + 1,
    report.aggregate.current.runtime.raw,
  );
  assert.equal(report.aggregate.delta.runtime.raw, 1);
  assert.equal(report.aggregate.base.componentCount, 1);
  assert.equal(report.sizeCheck.status, 1);
  assert.match(report.sizeCheck.failures, /Aggregate baseline stale/);
  const text = run();
  assert.equal(text.status, 0, text.stderr);
  assert.ok(text.stdout.includes(formatAggregateComparison(report.aggregate)));
  assert.deepEqual(await readFile(baselinePath), baselineBefore);
  assert.ok(!(await readdir(fixture)).includes("build-cache-marker"));
  await writeFile(join(fixture, "pnpm-lock.yaml"), "different\n");
  const mismatch = run("--json");
  assert.notEqual(mismatch.status, 0);
  assert.match(mismatch.stderr, /pnpm-lock.yaml differs/u);
  assert.doesNotMatch(mismatch.stderr, /Building /u);
  assert.deepEqual(await readFile(baselinePath), baselineBefore);
});
