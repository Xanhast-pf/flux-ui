import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";
import {
  checkReleaseVersions,
  discoverPublicPackages,
  latestMainCiRun,
  requireGreenCiJobs,
  runPreflight,
  verifyPriorMainCi,
} from "./preflight.mjs";

const sha = "f".repeat(40);
const names = [
  { name: "@varua/flux-ui", version: "0.2.0" },
  { name: "@varua/icons", version: "0.1.0" },
  { name: "@varua/tokens", version: "0.1.0" },
];
const job = (name, conclusion = "success") => ({
  name,
  status: "completed",
  conclusion,
});
const jobs = ["Quality", "Browser", "Required"].map((name) => job(name));
const run = (overrides = {}) => ({
  id: 123,
  head_sha: sha,
  head_branch: "main",
  event: "push",
  path: ".github/workflows/ci.yml",
  head_repository: { full_name: "Xanhast-pf/flux-ui" },
  status: "completed",
  conclusion: "success",
  run_attempt: 1,
  ...overrides,
});
const reply = (data, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => data,
});

test("release tag must match every public package version", () => {
  assert.deepEqual(checkReleaseVersions(names, "latest"), names);
  assert.equal(
    checkReleaseVersions(
      [{ name: "@varua/flux-ui", version: "0.2.0-alpha.1" }],
      "alpha",
    ).length,
    1,
  );
  assert.throws(() => checkReleaseVersions(names, "alpha"), /alpha tag/u);
  assert.throws(() => checkReleaseVersions(names, undefined));
  assert.throws(() => checkReleaseVersions(names, "bootstrap"));
  assert.throws(() => checkReleaseVersions([], "latest"), /No public/u);
  assert.throws(
    () => checkReleaseVersions([...names, { ...names[0] }], "latest"),
    /Duplicate/u,
  );
  assert.throws(
    () =>
      checkReleaseVersions(
        [{ name: "@other/pkg", version: "1.0.0" }],
        "latest",
      ),
    /identity/u,
  );
  assert.throws(
    () =>
      checkReleaseVersions(
        [{ name: "@varua/flux-ui", version: "0.2.0-alpha.1" }],
        "latest",
      ),
    /alpha tag/u,
  );
});

test("local preflight checks packages without making a network request", async () => {
  const root = await mkdtemp(join(tmpdir(), "flux-release-preflight-"));
  try {
    for (const [directory, pkg] of [
      ["react", names[0]],
      ["icons", names[1]],
      ["tokens", names[2]],
      ["private", { name: "@varua/private", version: "0.0.0", private: true }],
    ]) {
      const path = resolve(root, "packages", directory);
      await mkdir(path, { recursive: true });
      await writeFile(resolve(path, "package.json"), JSON.stringify(pkg));
    }
    const found = await discoverPublicPackages(root);
    assert.deepEqual(
      found.map((entry) => entry.name),
      ["@varua/icons", "@varua/flux-ui", "@varua/tokens"],
    );
    const logs = [];
    const result = await runPreflight({
      root,
      env: { FLUX_RELEASE_TAG: "latest" },
      log: (msg) => logs.push(msg),
      fetchImpl: () => {
        throw new Error("Offline preview unexpectedly accessed the network.");
      },
    });
    assert.equal(result.ci, null);
    assert.equal(result.packages.length, 3);
    assert.match(logs.join("\n"), /Local preflight passed/u);
    await assert.rejects(
      runPreflight({ root, env: { FLUX_RELEASE_TAG: "alpha" }, log: () => {} }),
      /alpha tag/u,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("only the latest exact-main official CI run counts", () => {
  assert.equal(latestMainCiRun([run()], sha).id, 123);
  assert.equal(
    latestMainCiRun(
      [run({ id: 121 }), run({ id: 122, event: "workflow_dispatch" })],
      sha,
    ).id,
    122,
  );
  for (const changed of [
    { head_sha: "a".repeat(40) },
    { head_branch: "dev" },
    { event: "pull_request" },
    { path: ".github/workflows/other.yml" },
    { head_repository: { full_name: "attacker/flux-ui" } },
    { head_repository: null },
  ])
    assert.throws(() => latestMainCiRun([run(changed)], sha), /No matching/u);
  assert.throws(
    () =>
      latestMainCiRun(
        [run({ id: 122 }), run({ id: 124, conclusion: "failure" })],
        sha,
      ),
    /not successful/u,
  );
  assert.throws(
    () =>
      latestMainCiRun([run({ status: "in_progress", conclusion: null })], sha),
    /not successful/u,
  );
  assert.throws(() => latestMainCiRun(null, sha), /Invalid/u);
});

test("main CI must report successful Quality, Browser and Required jobs", () => {
  requireGreenCiJobs(jobs);
  assert.throws(() => requireGreenCiJobs(jobs.slice(1)), /Quality/u);
  assert.throws(
    () =>
      requireGreenCiJobs(
        jobs.map((j) => (j.name === "Browser" ? job("Browser", "skipped") : j)),
      ),
    /Browser/u,
  );
  assert.throws(
    () => requireGreenCiJobs([...jobs, job("Required")]),
    /Required/u,
  );
  assert.throws(() => requireGreenCiJobs(null), /Invalid/u);
});

test("remote CI evidence lookup fails closed on missing permissions or incomplete checks", async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url.toString());
    return reply(calls.length === 1 ? { workflow_runs: [run()] } : { jobs });
  };
  const verified = await verifyPriorMainCi(sha, "fixture", fetchImpl);
  assert.deepEqual(verified, { runId: 123, attempt: 1, sha });
  assert.match(calls[0], /head_sha=f{40}/u);
  assert.match(calls[0], /branch=main/u);
  assert.match(calls[1], /actions\/runs\/123\/jobs/u);
  await assert.rejects(
    verifyPriorMainCi(sha, "fixture", async () => reply({}, 403)),
    /HTTP 403/u,
  );
  await assert.rejects(
    verifyPriorMainCi(sha, undefined, fetchImpl),
    /Missing/u,
  );
  await assert.rejects(
    verifyPriorMainCi(sha, "fixture", async (url) =>
      reply(
        url.toString().includes("/jobs")
          ? { jobs: jobs.slice(1) }
          : { workflow_runs: [run()] },
      ),
    ),
    /Quality/u,
  );
});
