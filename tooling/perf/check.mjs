import { executableCommand } from "../terminal/executable.mjs";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const isUpdate = process.argv.includes("--update-baseline");
const isSmoke = process.argv.includes("--smoke");
if (isUpdate && isSmoke) {
  throw new Error("Choose either --update-baseline or --smoke, not both.");
}

const mode = isUpdate ? "update" : isSmoke ? "smoke" : "full";
const [executable, args, platformOptions] = executableCommand([
  "pnpm",
  "--filter",
  "@flux-ui/docs",
  "exec",
  "playwright",
  "test",
  "tests/perf.spec.ts",
  "--project=chromium",
  process.env.FLUX_TERMINAL_ACTIVE
    ? `--reporter=line,${fileURLToPath(new URL("../terminal/playwright-reporter.mjs", import.meta.url))}`
    : "--reporter=line",
]);
const result = spawnSync(executable, args, {
  ...platformOptions,
  cwd: process.cwd(),
  env: { ...process.env, FLUX_PERF_MODE: mode },
  stdio: "inherit",
});

process.exitCode = result.status ?? 1;
