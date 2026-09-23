import { gitBoolean, gitConfigValue } from "./git-config.mjs";
import { executableCommand } from "../terminal/executable.mjs";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const repositoryRoot = fileURLToPath(new URL("../../", import.meta.url));

export function probeVersion(program, platform = process.platform) {
  const [executable, args, platformOptions] = executableCommand(
    [program, "--version"],
    platform,
  );
  const result = spawnSync(executable, args, {
    ...platformOptions,
    encoding: "utf8",
    timeout: 5000,
  });
  return result.status === 0 && !result.error ? result.stdout.trim() : null;
}

export function readGitHooksPath({
  root = repositoryRoot,
  exists = existsSync,
  read = (path) => readFileSync(path, "utf8"),
  isDirectory = (path) => statSync(path).isDirectory(),
} = {}) {
  const dotGit = join(root, ".git");
  if (!exists(dotGit)) return null;

  let gitDir = dotGit;
  if (!isDirectory(dotGit)) {
    const match = /^gitdir:\s*(.+)$/imu.exec(read(dotGit));
    if (!match)
      throw new Error(
        "Invalid .git pointer; cannot verify local hook configuration.",
      );
    gitDir = resolve(dirname(dotGit), match[1].trim());
  }

  let commonDir = gitDir;
  const commonDirFile = join(gitDir, "commondir");
  if (exists(commonDirFile)) {
    const relativeCommonDir = read(commonDirFile).trim();
    if (relativeCommonDir) commonDir = resolve(gitDir, relativeCommonDir);
  }

  const commonConfigPath = join(commonDir, "config");
  if (!exists(commonConfigPath))
    throw new Error(
      "Local Git config is missing; cannot verify hook configuration.",
    );
  const commonConfig = read(commonConfigPath);
  let hooksPath = gitConfigValue(commonConfig, "core", "hooksPath");

  const worktreeConfigEnabled = gitBoolean(
    gitConfigValue(commonConfig, "extensions", "worktreeConfig"),
  );
  const worktreeConfigPath = join(gitDir, "config.worktree");
  if (worktreeConfigEnabled && exists(worktreeConfigPath)) {
    const worktreeHooksPath = gitConfigValue(
      read(worktreeConfigPath),
      "core",
      "hooksPath",
    );
    if (worktreeHooksPath !== null) hooksPath = worktreeHooksPath;
  }

  if (hooksPath?.startsWith("~") || hooksPath?.startsWith("%(prefix)"))
    throw new Error(
      "Expanded Git hook paths require manual effective-path verification.",
    );
  return hooksPath;
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
  gitHooksPath = () => readGitHooksPath({ root }),
  exists = existsSync,
  readable = (path) => {
    try {
      readFileSync(path);
      return true;
    } catch {
      return false;
    }
  },
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

  let hooksPath = null;
  try {
    hooksPath = gitHooksPath();
  } catch (error) {
    add(
      false,
      `Local Git hook configuration: ${error.message}`,
      "Inspect git config --show-origin --get core.hooksPath manually; doctor does not evaluate global/system configuration or includes.",
    );
  }
  if (hooksPath && /(^|[\\/])\.husky([\\/]|$)/u.test(hooksPath)) {
    const hooksRoot = isAbsolute(hooksPath)
      ? hooksPath
      : resolve(root, hooksPath);
    const bootstrap = join(hooksRoot, "h");
    add(
      exists(bootstrap) && readable(bootstrap),
      `Husky Git hook bootstrap (${hooksPath})`,
      "Run pnpm prepare (or pnpm install --frozen-lockfile) to restore the local Husky bootstrap.",
    );
  }

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
