import { spawnSync } from "node:child_process";
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
const checks = runVerification(plan, ([program, ...args]) => {
  console.log(`\nVerification / ${[program, ...args].join(" ")}`);
  // pnpm supplies its JS entry when launching a package script. Running that entry
  // with Node also avoids shell interpretation and .cmd quoting on Windows.
  const entry = program === "pnpm" ? process.env.npm_execpath : undefined;
  const executable = entry || program === "node" ? process.execPath : program;
  return spawnSync(executable, entry ? [entry, ...args] : args, {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  });
});
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
for (const check of checks) {
  console.log(
    `${check.status.toUpperCase().padEnd(7)} ${check.command.join(" ")}`,
  );
}
console.log(`\nLocal verification receipt: ${destination}`);
process.exitCode = passed ? 0 : 1;
