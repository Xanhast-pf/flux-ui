import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runVerification, verificationPlan } from "./plan.mjs";

const success = { status: 0, error: undefined, signal: null };
const failure = { status: 1, error: undefined, signal: null };

test("verification preserves every command in the existing strict pipeline", async () => {
  const manifest = JSON.parse(
    await readFile(new URL("../../package.json", import.meta.url), "utf8"),
  );
  const plan = verificationPlan(manifest.scripts).map((command) =>
    command.join(" "),
  );
  assert.deepEqual(plan, [
    ...manifest.scripts.check.split(" && "),
    ...manifest.scripts["check:full"].split(" && ").slice(1),
  ]);
  assert.ok(plan.indexOf("pnpm bible:check") > plan.indexOf("pnpm size"));
  assert.ok(plan.includes("pnpm test:e2e"));
  assert.ok(plan.includes("pnpm perf:smoke"));
});
test("a size failure cannot suppress later browser, analyzer or performance checks", () => {
  const plan = [
    ["pnpm", "build"],
    ["pnpm", "size"],
    ["pnpm", "bible:check"],
    ["pnpm", "test:e2e"],
    ["pnpm", "perf:smoke"],
  ];
  const results = runVerification(plan, (command) =>
    command[1] === "size" ? failure : success,
  );
  assert.deepEqual(
    results.map((result) => result.status),
    ["passed", "failed", "passed", "passed", "passed"],
  );
  assert.equal(
    results.every((result) => result.status === "passed"),
    false,
  );
});
test("failed builds block both size gates rather than measuring stale output", () => {
  const executed = [];
  const results = runVerification(
    [
      ["pnpm", "build"],
      ["pnpm", "size"],
      ["node", "tooling/size/check.mjs", "--release"],
      ["pnpm", "test:e2e"],
    ],
    (command) => {
      executed.push(command);
      return command[1] === "build" ? failure : success;
    },
  );
  assert.deepEqual(
    results.map((result) => result.status),
    ["failed", "blocked", "blocked", "passed"],
  );
  assert.equal(executed.length, 2);
});
test("signals and executable errors are failures, never passes", () => {
  for (const result of [
    { ...success, error: new Error("spawn failed") },
    { ...success, signal: "SIGTERM" },
  ]) {
    assert.equal(
      runVerification([["pnpm", "lint"]], () => result)[0].status,
      "failed",
    );
  }
});
test("unexpected script syntax fails explicitly instead of skipping a gate", () => {
  assert.throws(
    () =>
      verificationPlan({
        check: "pnpm lint; echo skipped",
        "check:full": "pnpm check",
      }),
    /Unsupported verification/u,
  );
  assert.throws(
    () => verificationPlan({ check: "pnpm lint", "check:full": "pnpm test" }),
    /must start/u,
  );
});
