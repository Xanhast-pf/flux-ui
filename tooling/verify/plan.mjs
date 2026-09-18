import { commands, taskCommand, taskName } from "../terminal/commands.mjs";

/** Expand the canonical full gate without consulting package scripts. */
export function verificationPlan() {
  const [first, ...rest] = commands["check:full"];
  if (JSON.stringify(first) !== JSON.stringify(taskCommand("check"))) {
    throw new Error("check:full must start with the normal check task.");
  }
  return [...commands.check, ...rest];
}

/** Continue independent checks after failures; never measure stale build output. */
export async function runVerification(plan, execute, onBlocked = () => {}) {
  let buildPassed = false;
  const checks = [];
  for (const [index, command] of plan.entries()) {
    const label = command.join(" ");
    if (
      (taskName(command) === "size" ||
        label.startsWith("node tooling/size/")) &&
      !buildPassed
    ) {
      const blocked = {
        command,
        status: "blocked",
        exitCode: null,
        reason: "The production build did not pass.",
      };
      checks.push(blocked);
      onBlocked(blocked, index);
      continue;
    }
    const result = await execute(command, index);
    const passed = result.status === 0 && !result.error && !result.signal;
    if (taskName(command) === "build") buildPassed = passed;
    checks.push({
      command,
      status: passed ? "passed" : "failed",
      exitCode: result.status,
      reason: result.error?.message ?? result.signal ?? null,
    });
    if (result.signal) break;
  }
  return checks;
}
