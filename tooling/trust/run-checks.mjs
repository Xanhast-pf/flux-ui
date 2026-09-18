import { executableCommand } from "../terminal/executable.mjs";
import { spawnSync } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { CHECKS, sourceContext } from "./evidence.mjs";

const job = process.argv[2];
const requestedCheck = process.argv[3] ?? null;
if (!Object.hasOwn(CHECKS, job ?? ""))
  throw new Error(
    "Usage: node tooling/trust/run-checks.mjs quality|browser [check-id]",
  );
const selected = requestedCheck
  ? CHECKS[job].filter((check) => check.id === requestedCheck)
  : CHECKS[job];
if (selected.length === 0)
  throw new Error(`Unknown ${job} evidence check: ${requestedCheck}`);

const directory = resolve(".cache/trust", job);
const receiptPath = resolve(directory, "receipt.json");
const source = sourceContext();
await mkdir(directory, { recursive: true });

function emptyResult(check) {
  return {
    id: check.id,
    label: check.label,
    command: check.command,
    status: "not-run",
    exitCode: null,
    durationMs: 0,
  };
}

async function initialChecks() {
  if (!requestedCheck) {
    await rm(directory, { recursive: true, force: true });
    await mkdir(directory, { recursive: true });
    return CHECKS[job].map(emptyResult);
  }
  try {
    const previous = JSON.parse(await readFile(receiptPath, "utf8"));
    const sameSource =
      previous?.schemaVersion === 1 &&
      previous?.job === job &&
      JSON.stringify(previous.source) === JSON.stringify(source);
    if (sameSource && Array.isArray(previous.checks)) {
      return CHECKS[job].map((check) => {
        const result = previous.checks.find((item) => item?.id === check.id);
        return result ?? emptyResult(check);
      });
    }
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  return CHECKS[job].map(emptyResult);
}

const checks = await initialChecks();
let failed = false;
for (const check of selected) {
  const [executable, args, platformOptions] = executableCommand(check.command);
  console.log(`\nEvidence / ${check.label}`);
  const started = performance.now();
  const result = spawnSync(executable, args, {
    ...platformOptions,
    stdio: check.output ? ["ignore", "pipe", "inherit"] : "inherit",
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, FLUX_TRUST_JOB: job },
  });
  const status = result.status === 0 && !result.error ? "passed" : "failed";
  const index = checks.findIndex((item) => item.id === check.id);
  checks[index] = {
    id: check.id,
    label: check.label,
    command: check.command,
    status,
    exitCode: result.status,
    durationMs: Math.round(performance.now() - started),
  };
  if (check.output && result.stdout)
    await writeFile(resolve(directory, check.output), result.stdout);
  if (result.error) console.error(result.error.message);
  failed = status === "failed";
  if (failed) break;
}
await writeFile(
  receiptPath,
  `${JSON.stringify({ schemaVersion: 1, job, source, checks, finishedAt: new Date().toISOString() }, null, 2)}\n`,
);
process.exitCode = failed ? 1 : 0;
