import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const BOOTSTRAP_VERSION = "0.0.1";
export const BOOTSTRAP_TAG = "bootstrap";
export const BOOTSTRAP_PACKAGES = Object.freeze([
  { name: "@varua/flux-ui", description: "Flux UI React component library" },
  { name: "@varua/icons", description: "Flux UI icons" },
  { name: "@varua/tokens", description: "Flux UI design tokens" },
]);

const registry = "https://registry.npmjs.org/";
const confirmation = "--confirm-register-varua";

export function parseBootstrapArgs(argv) {
  let stage = false;
  let confirmed = false;
  let packageName;
  let help = false;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") help = true;
    else if (arg === "--stage") stage = true;
    else if (arg === confirmation) confirmed = true;
    else if (arg === "--package") {
      if (packageName !== undefined)
        throw new Error("--package may be provided only once.");
      const value = argv[++i];
      if (value === undefined || value.startsWith("-"))
        throw new Error("--package requires a package name.");
      packageName = value;
    } else throw new Error(`Unknown bootstrap option: ${arg}`);
  }
  if (help) return { help: true };
  if (
    packageName !== undefined &&
    !BOOTSTRAP_PACKAGES.some((p) => p.name === packageName)
  )
    throw new Error(
      "Only @varua/flux-ui, @varua/icons and @varua/tokens may be bootstrapped.",
    );
  if (stage !== confirmed)
    throw new Error(`Staging requires both --stage and ${confirmation}.`);
  return {
    stage,
    packages: packageName
      ? BOOTSTRAP_PACKAGES.filter((p) => p.name === packageName)
      : BOOTSTRAP_PACKAGES,
  };
}

export function supportsVersion(version, minimum) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/u.exec(version.trim());
  if (!match) return false;
  const parts = match.slice(1).map(Number);
  for (let i = 0; i < 3; i++) {
    if (parts[i] !== minimum[i]) return parts[i] > minimum[i];
  }
  return true;
}

export function bootstrapManifest(name) {
  const pkg = BOOTSTRAP_PACKAGES.find((entry) => entry.name === name);
  if (!pkg) throw new Error("Unknown Flux package.");
  return {
    name: pkg.name,
    version: BOOTSTRAP_VERSION,
    description: "Registration placeholder: " + pkg.description,
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/Xanhast-pf/flux-ui.git",
    },
    publishConfig: { access: "public" },
  };
}

function npm(args, { cwd, quiet } = {}) {
  return spawnSync(process.platform === "win32" ? "npm.cmd" : "npm", args, {
    cwd,
    encoding: "utf8",
    stdio: quiet ? ["ignore", "pipe", "pipe"] : "inherit",
    shell: process.platform === "win32",
    env: { ...process.env, npm_config_ignore_scripts: "true" },
  });
}

function requireSuccessfulCommand(run, args, label, options) {
  const result = run(args, options);
  if (result.error || result.status !== 0)
    throw new Error(
      `${label} failed. Check local npm authentication and organization permissions.`,
    );
  return result.stdout ?? "";
}

export const bootstrapHelp = `One-time registration of the three @varua package names on npm.

Usage:
  node tooling/release/bootstrap.mjs
  node tooling/release/bootstrap.mjs --package "@varua/flux-ui"
  node tooling/release/bootstrap.mjs --stage --package "@varua/flux-ui" ${confirmation}
  node tooling/release/bootstrap.mjs --stage ${confirmation}

Without --stage, this is an offline preview (no files or network requests).
Staging requires npm >=11.15.0, Node >=22.14.0 and npm login with @varua
publishing rights. It creates a PUBLIC 0.0.0-stage registration placeholder
and an unapproved, NOT-PUBLIC staged 0.0.1 version tagged "bootstrap".
Do NOT approve the temporary staged version or use npm publish.
Only your authorized maintainer workstation should run --stage; never CI.
`;

export async function bootstrap(
  argv,
  {
    run = npm,
    log = console.log,
    env = process.env,
    nodeVersion = process.versions.node,
  } = {},
) {
  const options = parseBootstrapArgs(argv);
  if (options.help) {
    log(bootstrapHelp);
    return;
  }
  const names = options.packages.map((pkg) => pkg.name);
  log(`Flux npm name registration: ${names.join(", ")}`);
  log(
    `Temporary version ${BOOTSTRAP_VERSION}, tag ${BOOTSTRAP_TAG}; real release versions are untouched.`,
  );
  if (!options.stage) {
    log(
      `PREVIEW ONLY. No files created, no npm commands run.\n${bootstrapHelp}`,
    );
    return;
  }
  if (env.CI || env.GITHUB_ACTIONS)
    throw new Error(
      "Package bootstrap must run on a maintainer workstation, not in CI.",
    );
  if (!supportsVersion(nodeVersion, [22, 14, 0]))
    throw new Error("Staging requires Node.js 22.14.0 or newer.");
  const version = requireSuccessfulCommand(
    run,
    ["--version"],
    "npm version check",
    {
      quiet: true,
    },
  ).trim();
  if (!supportsVersion(version, [11, 15, 0]))
    throw new Error("Staging requires npm 11.15.0 or newer.");
  requireSuccessfulCommand(
    run,
    ["whoami", `--registry=${registry}`],
    "npm login check",
    { quiet: true },
  );

  for (const { name } of options.packages) {
    const directory = await mkdtemp(join(tmpdir(), "flux-npm-bootstrap-"));
    try {
      await writeFile(
        join(directory, "package.json"),
        `${JSON.stringify(bootstrapManifest(name), null, 2)}\n`,
      );
      await writeFile(
        join(directory, "README.md"),
        `# ${name}\n\nTemporary registration package only. Do not approve this staged version.\nThe actual Flux UI release is published by the protected GitHub workflow.\n`,
      );
      log(
        `Staging ${name}@${BOOTSTRAP_VERSION} from a temporary, dependency-free directory...`,
      );
      const result = run(
        [
          "stage",
          "publish",
          "--access=public",
          `--tag=${BOOTSTRAP_TAG}`,
          `--registry=${registry}`,
          "--ignore-scripts",
        ],
        { cwd: directory },
      );
      if (result.error || result.status !== 0)
        throw new Error(
          `Staging ${name} failed. Do not rerun blindly: check npm stage list ${name} and your @varua permissions. Earlier names may already have been registered.`,
        );
      log(`Staged ${name}. Do NOT approve staged ${BOOTSTRAP_VERSION}.`);
    } finally {
      // Only the temporary directory created by this invocation is removed.
      await rm(directory, { recursive: true, force: true });
    }
  }
  log("Registration staging finished. Verify npm stage list for all names.");
  log(
    "Then configure trusted publishers and perform the protected release dry run.",
  );
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    await bootstrap(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
