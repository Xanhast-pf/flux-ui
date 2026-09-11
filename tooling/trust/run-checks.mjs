import { spawnSync } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { CHECKS, sourceContext } from "./evidence.mjs";

const job = process.argv[2];
if (!Object.hasOwn(CHECKS, job ?? ""))
  throw new Error("Usage: node tooling/trust/run-checks.mjs quality|browser");
const directory = resolve(".cache/trust", job);
await rm(directory, { recursive: true, force: true });
await mkdir(directory, { recursive: true });
const source = sourceContext();
const checks = [];
let failed = false;
for (const check of CHECKS[job]) {
  if (failed) {
    checks.push({
      id: check.id,
      label: check.label,
      command: check.command,
      status: "not-run",
      exitCode: null,
      durationMs: 0,
    });
    continue;
  }
  const [program, ...args] = check.command;
  const executable =
    process.platform === "win32" && program === "pnpm" ? "pnpm.cmd" : program;
  console.log(`\nEvidence / ${check.label}`);
  const started = performance.now();
  const result = spawnSync(executable, args, {
    stdio: check.output ? ["ignore", "pipe", "inherit"] : "inherit",
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, FLUX_TRUST_JOB: job },
  });
  const status = result.status === 0 && !result.error ? "passed" : "failed";
  checks.push({
    id: check.id,
    label: check.label,
    command: check.command,
    status,
    exitCode: result.status,
    durationMs: Math.round(performance.now() - started),
  });
  if (check.output && result.stdout)
    await writeFile(resolve(directory, check.output), result.stdout);
  if (result.error) console.error(result.error.message);
  failed = status === "failed";
}
await writeFile(
  resolve(directory, "receipt.json"),
  `${JSON.stringify({ schemaVersion: 1, job, source, checks, finishedAt: new Date().toISOString() }, null, 2)}\n`,
);
process.exitCode = failed ? 1 : 0;
