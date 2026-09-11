import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CHECKS,
  createEvidence,
  digest,
  sourceContext,
  validateReceipt,
} from "./evidence.mjs";
const context = sourceContext({
  GITHUB_ACTIONS: "true",
  GITHUB_SHA: "a".repeat(40),
  GITHUB_REPOSITORY: "Xanhast-pf/flux-ui",
  GITHUB_RUN_ID: "123",
  GITHUB_RUN_ATTEMPT: "1",
});
function receipt(job) {
  return {
    schemaVersion: 1,
    job,
    source: context,
    finishedAt: "2026-09-10T12:00:00Z",
    checks: CHECKS[job].map(({ id, label, command }) => ({
      id,
      label,
      command,
      status: "passed",
      exitCode: 0,
      durationMs: 10,
    })),
  };
}
test("CI context rejects partial identity and local execution never becomes CI", () => {
  assert.throws(() => sourceContext({ GITHUB_ACTIONS: "true" }), /requires/u);
  assert.equal(sourceContext({}).kind, "local");
});
test("evidence is bound to the exact commit, run and attempt", () => {
  for (const key of ["commit", "repository", "runId", "runAttempt", "kind"]) {
    const value = receipt("quality");
    value.source = { ...context, [key]: "other" };
    assert.throws(
      () => validateReceipt(value, "quality", context),
      /mismatched/u,
    );
  }
});
test("missing checks, fake success, changed commands and duplicate checks fail closed", () => {
  for (const mutate of [
    (value) => value.checks.pop(),
    (value) => {
      value.checks[0].exitCode = 1;
    },
    (value) => {
      value.checks[0].command = ["echo", "green"];
    },
    (value) => {
      value.checks[1] = value.checks[0];
    },
    (value) => {
      value.checks[0].durationMs = -1;
    },
  ]) {
    const value = receipt("quality");
    mutate(value);
    assert.throws(() => validateReceipt(value, "quality", context));
  }
});
test("only complete CI receipts can be published as passing", () => {
  const receipts = { quality: receipt("quality"), browser: receipt("browser") };
  assert.equal(createEvidence(receipts, context, [], true).status, "passed");
  receipts.browser.checks[0].status = "not-run";
  assert.throws(
    () => createEvidence(receipts, context, [], true),
    /incomplete/u,
  );
  assert.throws(
    () => createEvidence(receipts, sourceContext({}), [], true),
    /local/u,
  );
});
test("hashes change with the evidence bytes", () => {
  assert.equal(
    digest("abc"),
    "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
  );
  assert.notEqual(digest("abc"), digest("abcd"));
});
