import { spawnSync } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assertVersion, REPOSITORY } from "./contract.mjs";

export const REQUIRED_CI_JOBS = Object.freeze([
  "Quality",
  "Browser",
  "Required",
]);
const repositoryRoot = fileURLToPath(new URL("../../", import.meta.url));

export function checkReleaseVersions(packages, tag) {
  if (!["alpha", "latest"].includes(tag))
    throw new Error(
      "Explicitly select npm_tag=alpha for prereleases or npm_tag=latest for stable versions.",
    );
  if (!Array.isArray(packages) || packages.length === 0)
    throw new Error("No public packages available to release.");
  const names = new Set();
  for (const pkg of packages) {
    if (
      typeof pkg.name !== "string" ||
      !/^@varua\/[a-z][a-z0-9-]*$/u.test(pkg.name)
    )
      throw new Error("Unexpected public package identity.");
    if (names.has(pkg.name)) throw new Error("Duplicate public package.");
    names.add(pkg.name);
    assertVersion(pkg.version, tag);
  }
  return packages;
}

export async function discoverPublicPackages(root = repositoryRoot) {
  const packages = [];
  const parent = resolve(root, "packages");
  for (const entry of (await readdir(parent, { withFileTypes: true })).sort(
    (a, b) => a.name.localeCompare(b.name),
  )) {
    if (!entry.isDirectory()) continue;
    const pkg = JSON.parse(
      await readFile(resolve(parent, entry.name, "package.json"), "utf8"),
    );
    if (pkg.private === true) continue;
    packages.push({ name: pkg.name, version: pkg.version });
  }
  return packages;
}

export function latestMainCiRun(runs, sha) {
  if (!Array.isArray(runs)) throw new Error("Invalid GitHub CI run listing.");
  const candidates = runs
    .filter(
      (run) =>
        run &&
        run.head_sha === sha &&
        run.head_branch === "main" &&
        (run.event === "push" || run.event === "workflow_dispatch") &&
        run.path === ".github/workflows/ci.yml" &&
        run.head_repository?.full_name?.toLowerCase() ===
          REPOSITORY.toLowerCase() &&
        Number.isSafeInteger(run.id) &&
        run.id > 0,
    )
    .sort((a, b) => b.id - a.id);
  const mostRecent = candidates[0];
  if (!mostRecent)
    throw new Error("No matching main CI run for this exact release commit.");
  if (mostRecent.status !== "completed" || mostRecent.conclusion !== "success")
    throw new Error(
      `Most recent main CI run for this commit is not successful: ${mostRecent.id} (${mostRecent.status ?? "unknown"}/${mostRecent.conclusion ?? "unknown"}).`,
    );
  return mostRecent;
}

export function requireGreenCiJobs(jobs) {
  if (!Array.isArray(jobs)) throw new Error("Invalid GitHub CI job listing.");
  for (const name of REQUIRED_CI_JOBS) {
    const matches = jobs.filter((job) => job?.name === name);
    if (
      matches.length !== 1 ||
      matches[0].status !== "completed" ||
      matches[0].conclusion !== "success"
    )
      throw new Error(`Main CI job ${name} is missing, skipped, or failed.`);
  }
}

async function githubJson(url, token, fetchImpl) {
  const response = await fetchImpl(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok)
    throw new Error(
      `Cannot verify GitHub CI evidence (HTTP ${response.status}).`,
    );
  return response.json();
}

export async function verifyPriorMainCi(sha, token, fetchImpl = fetch) {
  if (!/^[a-f0-9]{40}$/u.test(sha) || !token)
    throw new Error(
      "Missing release commit or GitHub Actions read credentials.",
    );
  const base = `https://api.github.com/repos/${REPOSITORY}`;
  const runs = new URL(`${base}/actions/workflows/ci.yml/runs`);
  runs.searchParams.set("branch", "main");
  runs.searchParams.set("head_sha", sha);
  runs.searchParams.set("per_page", "30");
  const results = await githubJson(runs, token, fetchImpl);
  const selected = latestMainCiRun(results.workflow_runs, sha);
  const jobsUrl = new URL(`${base}/actions/runs/${selected.id}/jobs`);
  jobsUrl.searchParams.set("filter", "latest");
  jobsUrl.searchParams.set("per_page", "100");
  const jobs = await githubJson(jobsUrl, token, fetchImpl);
  requireGreenCiJobs(jobs.jobs);
  return { runId: selected.id, attempt: selected.run_attempt, sha };
}

function gitHead(root) {
  const result = spawnSync("git", ["rev-parse", "HEAD"], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.error || result.status !== 0)
    throw new Error("Cannot resolve the release checkout commit.");
  return result.stdout.trim();
}

export async function runPreflight({
  root = repositoryRoot,
  env = process.env,
  fetchImpl = fetch,
  log = console.log,
  requireCi = false,
} = {}) {
  const tag = env.FLUX_RELEASE_TAG;
  const packages = checkReleaseVersions(
    await discoverPublicPackages(root),
    tag,
  );
  log(
    `Release intent: npm tag ${tag}; ${packages.map((p) => `${p.name}@${p.version}`).join(", ")}.`,
  );

  if (!requireCi) {
    log("Local preflight passed (no network, no publication).");
    return { packages, tag, ci: null };
  }

  const sha = gitHead(root);
  if (
    env.GITHUB_ACTIONS !== "true" ||
    env.GITHUB_REPOSITORY !== REPOSITORY ||
    env.GITHUB_REF !== "refs/heads/main" ||
    env.GITHUB_SHA !== sha
  )
    throw new Error(
      "Release preflight requires the exact main-branch GitHub Actions checkout.",
    );
  const ci = await verifyPriorMainCi(sha, env.GITHUB_TOKEN, fetchImpl);
  log(
    `Reused verified main CI: run ${ci.runId}, attempt ${ci.attempt}, commit ${sha.slice(0, 12)}; Quality, Browser and Required passed.`,
  );
  return { packages, tag, ci };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  if (process.argv.slice(2).some((arg) => arg !== "--require-ci")) {
    console.error(
      "Usage: FLUX_RELEASE_TAG=latest node tooling/release/preflight.mjs [--require-ci]",
    );
    process.exitCode = 1;
  } else {
    try {
      await runPreflight({ requireCi: process.argv.includes("--require-ci") });
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    }
  }
}
