import { scriptSource } from "../terminal/commands.mjs";

/** Expand the existing full gate without maintaining a second check list. */
export function verificationPlan(scripts) {
  function commands(source) {
    if (typeof source !== "string") throw new Error("Missing check script.");
    return source.split(" && ").map((command) => {
      // This runner deliberately accepts only the repository's simple commands.
      // Reject shell syntax instead of accidentally changing its meaning.
      if (
        !/^(pnpm [\w:.-]+|node tooling\/size\/check\.mjs --release)$/u.test(
          command,
        )
      ) {
        throw new Error(`Unsupported verification command: ${command}`);
      }
      return command.split(" ");
    });
  }
  const full = commands(scriptSource(scripts, "check:full"));
  const first = full.shift();
  if (first?.join(" ") !== "pnpm check") {
    throw new Error("check:full must start with pnpm check.");
  }
  return [...commands(scriptSource(scripts, "check")), ...full];
}

/** Continue independent checks after failures; never measure stale build output. */
export async function runVerification(plan, execute, onBlocked = () => {}) {
  let buildPassed = false;
  const checks = [];
  for (const [index, command] of plan.entries()) {
    const label = command.join(" ");
    if (
      (label === "pnpm size" || label.startsWith("node tooling/size/")) &&
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
    if (label === "pnpm build") buildPassed = passed;
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
