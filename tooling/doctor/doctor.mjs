import { executableCommand } from "../terminal/executable.mjs";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";

export const repositoryRoot = fileURLToPath(new URL("../../", import.meta.url));

export function probeVersion(program, platform = process.platform) {
  const [executable, args, platformOptions] = executableCommand(
    [program, "--version"],
    process.env,
    platform,
  );
  const result = spawnSync(executable, args, {
    ...platformOptions,
    encoding: "utf8",
    timeout: 5000,
  });
  return result.status === 0 && !result.error ? result.stdout.trim() : null;
}

function version(value) {
  const match = /^v?(\d+)\.(\d+)\.(\d+)$/u.exec(value ?? "");
  return match?.slice(1).map(Number);
}

function atLeast(actual, minimum) {
  const parts = version(actual);
  const required = version(minimum);
  if (!parts || !required) return false;
  for (let index = 0; index < 3; index++) {
    if (parts[index] !== required[index]) return parts[index] > required[index];
  }
  return true;
}

/** Only injected reads/probes: doctor never installs, accesses the network or writes. */
export function diagnose({
  root = repositoryRoot,
  node = process.version,
  probe = probeVersion,
  exists = existsSync,
  read = (path) => readFileSync(path, "utf8"),
  browser = () => {
    const result = spawnSync(
      process.execPath,
      [join(root, "apps/docs/scripts/browser-prerequisite.mjs")],
      { timeout: 5000, stdio: "ignore" },
    );
    return result.status === 0 && !result.error;
  },
} = {}) {
  const checks = [];
  const add = (ok, message, remedy) =>
    checks.push({ status: ok ? "pass" : "fail", message, remedy });
  add(
    isAbsolute(root) && exists(join(root, "package.json")),
    "Repository root resolved from doctor script",
    "Run doctor from a complete Flux checkout.",
  );
  for (const path of [
    "pnpm-workspace.yaml",
    "pnpm-lock.yaml",
    ".nvmrc",
    "tooling/terminal/cli.mjs",
  ]) {
    add(
      exists(join(root, path)),
      path,
      "Restore the required tracked workspace file.",
    );
  }
  try {
    const manifest = JSON.parse(read(join(root, "package.json")));
    const engine = /^>=(\d+)$/u.exec(manifest.engines.node);
    const nvm = read(join(root, ".nvmrc")).trim();
    add(
      Boolean(engine) &&
        /^\d+$/u.test(nvm) &&
        atLeast(node, `${Math.max(Number(engine?.[1]), Number(nvm))}.0.0`),
      `Node ${node}; engines ${manifest.engines.node}, .nvmrc ${nvm}`,
      "Install the Node version in .nvmrc (nvm use where available).",
    );
    const expected = manifest.packageManager.replace(/^pnpm@/u, "");
    const pnpm = probe("pnpm");
    add(
      pnpm === expected,
      `pnpm ${pnpm ?? "missing"}; required ${expected}`,
      `Install/activate pnpm ${expected}, then pnpm install --frozen-lockfile.`,
    );
  } catch (error) {
    add(
      false,
      `Toolchain configuration: ${error.message}`,
      "Restore readable package.json and .nvmrc files.",
    );
  }
  add(
    exists(join(root, "node_modules/.modules.yaml")) &&
      exists(join(root, "node_modules/eslint/package.json")),
    "Installed workspace dependencies",
    "Run pnpm install --frozen-lockfile.",
  );
  let available = false;
  try {
    available = browser();
  } catch {
    /* Optional browser check must not hide required results. */
  }
  checks.push({
    status: available ? "pass" : "warning",
    message: "Optional Chromium browser prerequisite",
    remedy:
      "For full checks, run pnpm --filter @flux-ui/docs exec playwright install chromium; system libraries may also be required.",
  });
  return {
    checks,
    exitCode: checks.some((check) => check.status === "fail") ? 1 : 0,
  };
}
