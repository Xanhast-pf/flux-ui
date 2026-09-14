import { commandLabel } from "../tooling/terminal/commands.mjs";
import { runTask } from "../tooling/terminal/runner.mjs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runVerification, verificationPlan } from "../tooling/verify/plan.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const manifest = JSON.parse(
  await readFile(resolve(root, "package.json"), "utf8"),
);
const directory = resolve(root, ".cache/verify-all");
await mkdir(directory, { recursive: true });
// A rerun immediately replaces any old successful receipt with a running state.
const receipt = {
  schemaVersion: 1,
  source: "local",
  node: process.version,
  requiredPackageManager: manifest.packageManager,
  startedAt: new Date().toISOString(),
  status: "running",
  checks: [],
};
const destination = resolve(directory, "receipt.json");
await writeFile(destination, `${JSON.stringify(receipt, null, 2)}\n`);
if (Number(process.versions.node.split(".")[0]) < 24) {
  const reason =
    "Flux verification requires Node 24 or newer. Run nvm use first.";
  await writeFile(
    destination,
    `${JSON.stringify(
      {
        ...receipt,
        status: "blocked",
        reason,
        finishedAt: new Date().toISOString(),
      },
      null,
      2,
    )}\n`,
  );
  throw new Error(reason);
}
const plan = verificationPlan(manifest.scripts);
console.log("Flux UI verify\n");
const started = performance.now();
const checks = await runVerification(
  plan,
  (command, index) =>
    runTask(command, {
      cwd: root,
      label: `[${index + 1}/${plan.length}] ${commandLabel(command)}`,
    }),
  (check, index) =>
    console.log(
      `BLOCKED [${index + 1}/${plan.length}] ${check.command.join(" ")}: ${check.reason}`,
    ),
);
const passed = checks.every((check) => check.status === "passed");
await writeFile(
  destination,
  `${JSON.stringify(
    {
      ...receipt,
      status: passed ? "passed" : "failed",
      finishedAt: new Date().toISOString(),
      checks,
    },
    null,
    2,
  )}\n`,
);
console.log(
  `\n${passed ? "All checks passed" : "Verification failed"} in ${((performance.now() - started) / 1000).toFixed(1)}s`,
);
console.log(`Local verification receipt: ${destination}`);
process.exitCode = passed
  ? 0
  : (checks.at(-1)?.reason?.startsWith("SIG")
      ? checks.at(-1).exitCode
      : checks.find((check) => check.status === "failed")?.exitCode) || 1;
