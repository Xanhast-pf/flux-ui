import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  commandTree,
  publicCommands,
  resolveCommand,
} from "./public-commands.mjs";
import { commands, taskCommand } from "./commands.mjs";
import { runPipeline } from "./tasks.mjs";

const cli = fileURLToPath(new URL("./cli.mjs", import.meta.url));
test("root and nested help succeeds without executing tasks, even outside the repository", () => {
  for (const args of [
    [],
    ["--help"],
    ["help", "check"],
    ...Object.keys(commandTree.children).map((name) => [name, "--help"]),
  ]) {
    const result = spawnSync(process.execPath, [cli, ...args], {
      cwd: tmpdir(),
      encoding: "utf8",
    });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Usage: pnpm flux/u);
  }
  const result = spawnSync(process.execPath, [cli, "sizes"], {
    encoding: "utf8",
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown Flux command: "sizes"/u);
  assert.match(result.stderr, /size/u);
});

test("every public command explains purpose, usage, audience and writes", () => {
  for (const node of publicCommands) {
    for (const key of ["summary", "usage", "when", "audience", "writes"])
      assert.ok(node[key], `${node.path}: ${key}`);
    assert.ok(node.examples.length);
    const { help } = resolveCommand([...node.path.split(" "), "--help"]);
    assert.ok(help.includes(node.summary));
    assert.ok(help.includes(node.when));
    assert.ok(help.includes(`Writes: ${node.writes}`));
    if (node.path.endsWith(" accept")) {
      assert.equal(node.audience, "maintainer");
      assert.equal(node.writes, "baseline");
      assert.match(
        help,
        /Maintainers only\. Writes an accepted quality baseline after explicit review\./u,
      );
    }
  }
});

test("public dispatch preserves existing tasks and argument arrays", () => {
  const cases = [
    ["dev", "dev"],
    ["check", "check"],
    ["check full", "check:full"],
    ["check all", "verify:all"],
    ["test e2e", "test:e2e"],
    ["build packages", "build:packages"],
    ["component new Button", "component:new", ["Button"]],
    ["component doctor Button", "component:doctor", ["Button"]],
    ["component readiness", "component:readiness"],
    ["size aggregate review", "size:aggregate:review"],
    ["perf smoke", "perf:smoke"],
    ["release guide", "release"],
    ["maintain generate", "generate"],
  ];
  for (const [input, task, args = []] of cases)
    assert.deepEqual(resolveCommand(input.split(" ")), { task, args });
  assert.deepEqual(resolveCommand(["size", "compare", "HEAD", "--json"]), {
    task: "size:compare",
    args: ["HEAD", "working-tree", "--json"],
  });
  assert.deepEqual(resolveCommand(["size", "compare", "HEAD", "main"]), {
    task: "size:compare",
    args: ["HEAD", "main"],
  });
  const args = ["a b", "$(echo unsafe)", '"quoted"', "C:\\path with spaces"];
  assert.deepEqual(resolveCommand(["test", "e2e", ...args]).args, args);
  for (const input of [
    ["component", "new"],
    ["doctor", "extra"],
    ["check", "ful"],
    ["size", "--update-aggregate-baseline"],
    ["release", "publish"],
  ])
    assert.throws(() => resolveCommand(input), /Usage:|Available:/u);
  assert.match(
    resolveCommand(["size", "aggregate"]).help,
    /review[\s\S]*accept/u,
  );
});

test("pipelines keep required gate order and stop on failure", async () => {
  const repositoryRoot = fileURLToPath(new URL("../../", import.meta.url));
  assert.deepEqual(
    commands.check.map((command) => command[2]),
    [
      "generate:check",
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
    ],
  );
  assert.deepEqual(commands["check:full"], [
    taskCommand("check"),
    ["node", "tooling/size/check.mjs", "--release"],
    ...["storybook:build", "test:e2e", "perf:smoke", "consumer:check"].map(
      taskCommand,
    ),
  ]);
  const calls = [];
  const status = await runPipeline("check", [], async (command, options) => {
    calls.push(command);
    assert.equal(options.cwd, repositoryRoot);
    assert.ok(options.label);
    return { status: command[2] === "build" ? 7 : 0 };
  });
  assert.equal(status, 7);
  assert.deepEqual(calls.at(-1), taskCommand("build"));
  assert.ok(!calls.some((command) => command[2] === "size"));
});
