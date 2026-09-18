import { fileURLToPath, pathToFileURL } from "node:url";
import {
  commands,
  commandLabel,
  commandProgress,
  commandArguments,
} from "./commands.mjs";
import { reportProgress } from "./progress.mjs";
import { runTask } from "./runner.mjs";
export async function runPipeline(name, extra = [], execute = runTask) {
  const root = fileURLToPath(new URL("../../", import.meta.url));
  if (!Object.hasOwn(commands, name))
    throw new Error(`Unknown pipeline: ${name}`);
  const steps = commands[name];
  // Explicit machine and verbose interfaces bypass human capture entirely.
  const raw =
    extra.includes("--json") ||
    extra.includes("--verbose") ||
    ![
      "check",
      "check:full",
      "check:fix",
      "test",
      "size",
      "size:changed",
      "size:release",
      "build",
      "build:packages",
      "generate:check",
      "test:e2e",
      "perf",
      "perf:smoke",
      "consumer:check",
      "storybook:build",
    ].includes(name);
  if (!raw && !process.env.FLUX_TERMINAL_ACTIVE)
    console.log(`Flux UI ${name}\n`);
  for (const [index, command] of steps.entries()) {
    reportProgress(commandProgress(name, command, index, steps.length));
    const isSize = command[1] === "tooling/size/check.mjs";
    const args = commandArguments(name, index, extra);
    const result = await execute(args, {
      cwd: root,
      label: `[${index + 1}/${steps.length}] ${commandLabel(command)}`,
      raw: Boolean(raw),
      stdout:
        extra.includes("--json") && !isSize && name.startsWith("size")
          ? 2
          : "inherit",
    });
    if (result.status !== 0) {
      return result.status;
    }
  }

  return 0;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const [name, ...extra] = process.argv.slice(2);
  process.exitCode = await runPipeline(name, extra);
}
