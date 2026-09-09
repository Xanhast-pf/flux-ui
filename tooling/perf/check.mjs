import { spawnSync } from "node:child_process";

const isUpdate = process.argv.includes("--update-baseline");
const isSmoke = process.argv.includes("--smoke");
if (isUpdate && isSmoke) {
  throw new Error("Choose either --update-baseline or --smoke, not both.");
}

const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const mode = isUpdate ? "update" : isSmoke ? "smoke" : "full";
const result = spawnSync(
  pnpm,
  [
    "--filter",
    "@flux-ui/docs",
    "exec",
    "playwright",
    "test",
    "tests/perf.spec.ts",
    "--project=chromium",
    "--reporter=line",
  ],
  {
    cwd: process.cwd(),
    env: { ...process.env, FLUX_PERF_MODE: mode },
    stdio: "inherit",
  },
);

process.exitCode = result.status ?? 1;
