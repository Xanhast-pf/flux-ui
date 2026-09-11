import { spawnSync } from "node:child_process";
import { REPOSITORY, run, verifyPackage } from "./contract.mjs";

const dryRun = process.env.FLUX_RELEASE_DRY_RUN !== "false";
if (
  process.env.GITHUB_ACTIONS !== "true" ||
  process.env.GITHUB_REPOSITORY !== REPOSITORY ||
  process.env.GITHUB_REF !== "refs/heads/main"
)
  throw new Error(
    "Publishing is limited to this repository's main-branch GitHub workflow.",
  );
if (
  !dryRun &&
  (process.env.ACTIONS_ID_TOKEN_REQUEST_URL === undefined ||
    process.env.NODE_AUTH_TOKEN ||
    process.env.NPM_TOKEN)
)
  throw new Error(
    "Publishing requires OIDC and refuses long-lived npm credentials.",
  );
const [major, minor, patch] = run("npm", ["--version"])
  .trim()
  .split(".")
  .map(Number);
if (
  ![major, minor, patch].every(Number.isInteger) ||
  major < 11 ||
  (major === 11 && (minor < 5 || (minor === 5 && patch < 1)))
)
  throw new Error("Use npm 11.5.1 or newer for trusted publishing.");
const { pkg, path, tag } = await verifyPackage(process.env.FLUX_RELEASE_FILE);
// Only an explicit registry 404 means unpublished. Network/auth failures are fatal.
const view = spawnSync(
  "npm",
  [
    "view",
    `${pkg.name}@${pkg.version}`,
    "dist.integrity",
    "--json",
    "--registry=https://registry.npmjs.org",
  ],
  { encoding: "utf8" },
);
if (view.error !== undefined) throw view.error;
if (view.status === 0) {
  if (JSON.parse(view.stdout) !== pkg.integrity)
    throw new Error(
      "That version already exists with different bytes. Prepare a new version.",
    );
  console.log(
    `${pkg.name}@${pkg.version} already exists with identical bytes; no publish or tag mutation.`,
  );
} else {
  let missing = false;
  try {
    missing = JSON.parse(view.stdout).error?.code === "E404";
  } catch {
    /* Non-JSON errors fail closed. */
  }
  if (!missing) throw new Error(`Registry lookup failed: ${view.stderr}`);
  const args = [
    "publish",
    path,
    "--access=public",
    `--tag=${tag}`,
    "--ignore-scripts",
    "--registry=https://registry.npmjs.org",
  ];
  if (dryRun) args.push("--dry-run");
  else args.push("--provenance");
  run("npm", args, { stdio: "inherit" });
}
