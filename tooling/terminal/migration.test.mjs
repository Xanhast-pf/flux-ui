import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  commands,
  taskCommand,
  taskName,
  commandArguments,
  commandLabel,
} from "./commands.mjs";
import { executableCommand } from "./executable.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const read = (path) => readFile(join(root, path), "utf8");

test("root scripts stay limited to the Flux CLI and lifecycle hook", async () => {
  assert.deepEqual(JSON.parse(await read("package.json")).scripts, {
    flux: "node tooling/terminal/cli.mjs",
    prepare: "husky",
  });
  for (const path of [
    "README.md",
    "CONTRIBUTING.md",
    "AGENTS.md",
    "docs/development.md",
    "tooling/terminal/README.md",
    "tooling/size/README.md",
    "tooling/perf/README.md",
    "tooling/icons/README.md",
    "docs/trust/SETUP.md",
    ".github/pull_request_template.md",
    "apps/docs/src/pages/EngineeringPage.tsx",
    "apps/docs/src/pages/DocumentationPage.tsx",
    "apps/docs/src/pages/InstallPage.tsx",
  ]) {
    assert.doesNotMatch(
      await read(path),
      /(?:\bJust \d|Install Just|tooling\/just)/u,
      path,
    );
    assert.doesNotMatch(
      await read(path),
      /\bjust\s+(?:check|dev|size|perf|component|maintain)\b/u,
      path,
    );
    assert.doesNotMatch(
      await read(path),
      /pnpm\s+(?:run\s+)?(?:check(?::[\w-]+)?|verify:all|component:new|component:doctor|size:update|perf:update|generate)(?![\w:-])/u,
      path,
    );
  }
});

test("all registry references resolve without cycles or removed package scripts", () => {
  function visit(name, parents = []) {
    assert.ok(
      !parents.includes(name),
      `Task cycle: ${[...parents, name].join(" -> ")}`,
    );
    for (const command of commands[name]) {
      assert.ok(command.every((arg) => typeof arg === "string"));
      assert.ok(
        !(command[0] === "pnpm" && Object.hasOwn(commands, command[1])),
      );
      if (taskName(command)) {
        assert.deepEqual(command.slice(0, 3), taskCommand(taskName(command)));
        visit(taskName(command), [...parents, name]);
      }
    }
  }
  for (const name of Object.keys(commands)) visit(name);
});

test("size selection reaches only measurement; other focused task arguments survive", () => {
  assert.deepEqual(
    commandArguments("size:update", 0, ["Button"]),
    taskCommand("build:packages"),
  );
  assert.deepEqual(commandArguments("size:update", 1, ["Button"]), [
    "node",
    "tooling/size/check.mjs",
    "--update-bundled-baseline",
    "Button",
  ]);
  for (const name of ["size:compare", "size:test", "component:new"]) {
    assert.deepEqual(commandArguments(name, 0, ["a b", "--json"]).slice(-2), [
      "a b",
      "--json",
    ]);
  }
  assert.equal(commandLabel(taskCommand("bible:check")), "Coding Bible");
});

test("Windows pnpm executable and npm-provided JS entry preserve argv", () => {
  assert.deepEqual(executableCommand(["pnpm", "exec", "tsc"], {}, "win32"), [
    "cmd.exe",
    ["/d", "/s", "/c", '"pnpm.cmd ^"exec^" ^"tsc^""'],
    { windowsVerbatimArguments: true },
  ]);
  assert.deepEqual(
    executableCommand(
      ["pnpm", "exec", "tsc"],
      { npm_execpath: "C:\\tools\\pnpm.cjs" },
      "win32",
    ),
    [process.execPath, ["C:\\tools\\pnpm.cjs", "exec", "tsc"], {}],
  );
});

test("Windows batch arguments protect metacharacters, quotes and trailing path slashes", () => {
  const [, args, options] = executableCommand(
    ["pnpm", "a&b", "%PATH%", "!name!", 'a"b', "C:\\x y\\"],
    {},
    "win32",
  );
  assert.deepEqual(options, { windowsVerbatimArguments: true });
  assert.equal(
    args[3],
    '"pnpm.cmd ^"a^&b^" ^"^%PATH^%^" ^"^!name^!^" ^"a\\^"b^" ^"C:\\x^ y\\\\^""',
  );
  assert.throws(
    () => executableCommand(["pnpm", "first\nsecond"], {}, "win32"),
    /line breaks/u,
  );
});
