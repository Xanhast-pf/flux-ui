import assert from "node:assert/strict";
import { commands, taskCommand, taskName } from "../terminal/commands.mjs";
import test from "node:test";
import { runVerification, verificationPlan } from "./plan.mjs";

const success = { status: 0, error: undefined, signal: null };
const failure = { status: 1, error: undefined, signal: null };

test("verification preserves every command in the existing strict pipeline", async () => {
  const plan = verificationPlan();
  assert.deepEqual(plan, [
    ...commands.check,
    ...commands["check:full"].slice(1),
  ]);
  assert.deepEqual(commands.check.map(taskName), [
    "generate:check",
    "drift:check",
    "docs:check",
    "dogfood:check",
    "format:check",
    "build:packages",
    "lint",
    "typecheck",
    "knip",
    "test",
    "build",
    "size",
    "bible:check",
  ]);
  assert.deepEqual(plan.slice(-5), [
    ["node", "tooling/size/check.mjs", "--release"],
    ...["storybook:build", "test:e2e", "perf:smoke", "consumer:check"].map(
      taskCommand,
    ),
  ]);
});

test("a size failure cannot suppress later browser, analyzer or performance checks", async () => {
  const plan = [
    taskCommand("build"),
    taskCommand("size"),
    taskCommand("bible:check"),
    taskCommand("test:e2e"),
    taskCommand("perf:smoke"),
  ];
  const results = await runVerification(plan, (command) =>
    taskName(command) === "size" ? failure : success,
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
test("failed builds block both size gates rather than measuring stale output", async () => {
  const executed = [];
  const results = await runVerification(
    [
      taskCommand("build"),
      taskCommand("size"),
      ["node", "tooling/size/check.mjs", "--release"],
      taskCommand("test:e2e"),
    ],
    (command) => {
      executed.push(command);
      return taskName(command) === "build" ? failure : success;
    },
  );
  assert.deepEqual(
    results.map((result) => result.status),
    ["failed", "blocked", "blocked", "passed"],
  );
  assert.equal(executed.length, 2);
});
test("signals and executable errors are failures, never passes", async () => {
  for (const result of [
    { ...success, error: new Error("spawn failed") },
    { ...success, signal: "SIGTERM" },
  ]) {
    assert.equal(
      (await runVerification([taskCommand("lint")], () => result))[0].status,
      "failed",
    );
  }
});
test("interruption stops the verification plan immediately", async () => {
  const executed = [];
  const checks = await runVerification(
    [taskCommand("lint"), taskCommand("test")],
    async (command) => {
      executed.push(command);
      return { status: 130, signal: "SIGINT" };
    },
  );
  assert.equal(executed.length, 1);
  assert.equal(checks[0].exitCode, 130);
});
