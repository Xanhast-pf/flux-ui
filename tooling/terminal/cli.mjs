import { commands, commandLabel, commandProgress } from "./commands.mjs";
import { reportProgress } from "./progress.mjs";
import { runTask } from "./runner.mjs";
const [name, ...extra] = process.argv.slice(2);
if (!commands[name]) throw new Error(`Unknown pipeline: ${name}`);
const steps = commands[name].split(" && ").map((step) => step.split(" "));
// Explicit machine and verbose interfaces bypass human capture entirely.
const raw = extra.includes("--json") || extra.includes("--verbose");
if (!raw && !process.env.FLUX_TERMINAL_ACTIVE) console.log(`Flux UI ${name}\n`);
for (const [index, command] of steps.entries()) {
  reportProgress(commandProgress(name, command, index, steps.length));
  const isSize = command[1] === "tooling/size/check.mjs";
  const forwarded = name.startsWith("size")
    ? isSize
      ? extra
      : []
    : index === steps.length - 1
      ? extra
      : [];
  const args = [...command, ...forwarded];
  const result = await runTask(args, {
    label: `[${index + 1}/${steps.length}] ${commandLabel(command)}`,
    raw: Boolean(raw),
    stdout:
      extra.includes("--json") && !isSize && name.startsWith("size")
        ? 2
        : "inherit",
  });
  if (result.status !== 0) {
    process.exitCode = result.status;
    break;
  }
}
