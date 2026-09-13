import assert from "node:assert/strict";
import { test } from "node:test";
import { parseEvidence } from "../../apps/docs/src/lib/evidence.ts";
import { CHECKS, createEvidence, sourceContext } from "./evidence.mjs";
function fixture() {
  const source = sourceContext({
    GITHUB_ACTIONS: "true",
    GITHUB_SHA: "a".repeat(40),
    GITHUB_REPOSITORY: "Xanhast-pf/flux-ui",
    GITHUB_RUN_ID: "123",
    GITHUB_RUN_ATTEMPT: "1",
  });
  const receipts = Object.fromEntries(
    Object.entries(CHECKS).map(([job, checks]) => [
      job,
      {
        schemaVersion: 1,
        job,
        source,
        finishedAt: new Date().toISOString(),
        checks: checks.map((check) => ({
          ...check,
          status: "passed",
          exitCode: 0,
          durationMs: 1,
        })),
      },
    ]),
  );
  return createEvidence(
    receipts,
    source,
    [
      "quality",
      "browser",
      "size",
      "runtime",
      "browser-tests",
      "consumer-tests",
    ].map((name) => ({
      name: `${name}.json`,
      bytes: 100,
      sha256: "b".repeat(64),
    })),
    true,
  );
}
test("browser parser accepts the exact generator contract", () => {
  assert.equal(parseEvidence(fixture()).status, "passed");
});
test("browser parser rejects malformed, foreign or false-green evidence", () => {
  for (const mutate of [
    (v) => {
      v.schemaVersion = 2;
    },
    (v) => {
      v.source.repository = "attacker/flux-ui";
    },
    (v) => {
      v.jobs[0].checks[0].exitCode = 1;
    },
    (v) => {
      v.jobs[1].checks[0].status = "not-run";
    },
    (v) => {
      v.jobs.pop();
    },
    (v) => {
      v.files[0].name = "../secrets";
    },
    (v) => {
      v.files[1] = v.files[0];
    },
    (v) => {
      v.generatedAt = "invalid";
    },
    (v) => {
      v.files[0].sha256 = "not-a-hash";
    },
    (v) => {
      v.jobs[0].checks[0].durationMs = Infinity;
    },
  ]) {
    const value = fixture();
    mutate(value);
    assert.throws(() => parseEvidence(value));
  }
  for (const invalid of [null, [], "passed", {}])
    assert.throws(() => parseEvidence(invalid));
});
