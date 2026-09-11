import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { CHECKS, digest, sourceContext } from "./evidence.mjs";
import { parseEvidence } from "../../apps/docs/src/lib/evidence.ts";

const generator = fileURLToPath(new URL("./generate.mjs", import.meta.url));
const env = {
  GITHUB_ACTIONS: "true",
  GITHUB_SHA: "a".repeat(40),
  GITHUB_REPOSITORY: "Xanhast-pf/flux-ui",
  GITHUB_RUN_ID: "123",
  GITHUB_RUN_ATTEMPT: "1",
};
async function fixture(callback) {
  const root = await mkdtemp(join(tmpdir(), "flux-evidence-"));
  try {
    for (const [job, checks] of Object.entries(CHECKS)) {
      await mkdir(join(root, ".cache/trust", job), { recursive: true });
      await writeFile(
        join(root, ".cache/trust", job, "receipt.json"),
        JSON.stringify({
          schemaVersion: 1,
          job,
          source: sourceContext(env),
          finishedAt: new Date().toISOString(),
          checks: checks.map((check) => ({
            ...check,
            status: "passed",
            exitCode: 0,
            durationMs: 1,
          })),
        }),
      );
    }
    const metric = { raw: 10, gzip: 8, brotli: 6 };
    await writeFile(
      join(root, ".cache/trust/quality/size.json"),
      JSON.stringify({
        schemaVersion: 1,
        componentCount: 1,
        checkedComponentCount: 1,
        components: { button: metric },
        aggregate: { rootEntry: metric, runtime: metric, published: metric },
      }),
    );
    await writeFile(
      join(root, ".cache/trust/browser/browser-tests.json"),
      JSON.stringify({
        stats: { expected: 10, unexpected: 0, flaky: 0 },
        errors: [],
      }),
    );
    await writeFile(
      join(root, ".cache/trust/browser/runtime.json"),
      JSON.stringify({
        schemaVersion: 1,
        mode: "full",
        commit: env.GITHUB_SHA,
        count: 1000,
        iterations: 15,
        summaries: { button: {}, grid: {} },
        rawSamples: ["button", "grid"].map((scenario) => ({
          scenario,
          samples: Object.fromEntries(
            ["raw", "native", "flux"].map((variant) => [
              variant,
              Array.from({ length: 15 }, () => ({
                scenario,
                variant,
                count: 1000,
                mountMs: 1,
                updateMs: 1,
                unmountMs: 1,
                mountToFrameMs: 1,
                updateToFrameMs: 1,
                domNodes: 2000,
              })),
            ]),
          ),
        })),
      }),
    );
    await callback(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}
function generate(root, overrides = {}) {
  return spawnSync(process.execPath, [generator, "--require-ci"], {
    cwd: root,
    env: { ...process.env, ...env, ...overrides },
    encoding: "utf8",
  });
}
test("evidence CLI creates a browser-readable manifest whose hashes match every report", async () => {
  await fixture(async (root) => {
    const result = generate(root);
    assert.equal(result.status, 0, result.stderr);
    const output = join(root, "apps/docs/public/evidence");
    const manifest = parseEvidence(
      JSON.parse(await readFile(join(output, "index.json"), "utf8")),
    );
    assert.equal(manifest.status, "passed");
    for (const file of manifest.files) {
      const bytes = await readFile(join(output, file.name));
      assert.equal(bytes.length, file.bytes);
      assert.equal(digest(bytes), file.sha256);
    }
  });
});
test("evidence CLI rejects reports from another attempt", async () => {
  await fixture(async (root) => {
    const result = generate(root, { GITHUB_RUN_ATTEMPT: "2" });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /mismatched runAttempt/u);
  });
});
test("evidence CLI refuses missing reports and local publication", async () => {
  await fixture(async (root) => {
    const local = generate(root, { GITHUB_ACTIONS: "false" });
    assert.notEqual(local.status, 0);
    assert.match(local.stderr, /local run/u);
    await rm(join(root, ".cache/trust/browser/runtime.json"));
    assert.notEqual(generate(root).status, 0);
  });
});
