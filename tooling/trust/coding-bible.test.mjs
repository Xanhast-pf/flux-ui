import assert from "node:assert/strict";
import { readFile, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("main declaration retains a concrete installed revision and explicit refresh", async () => {
  const pkg = JSON.parse(await read("package.json"));
  const ref = "github:Xanhast-pf/coding-bible#main&path:packages/analyzer";
  assert.equal(pkg.devDependencies["@coding-bible/analyzer"], ref);
  assert.equal(
    pkg.scripts["bible:refresh"],
    "pnpm update -w @coding-bible/analyzer",
  );
  const lock = await read("pnpm-lock.yaml");
  assert.ok(lock.includes(`specifier: ${ref}`));
  const revisions = [
    ...lock.matchAll(/coding-bible\/tar\.gz\/([a-f0-9]{40})/gu),
  ];
  assert.ok(revisions.length >= 3);
  assert.equal(new Set(revisions.map((match) => match[1])).size, 1);
  const workspace = await read("pnpm-workspace.yaml");
  assert.ok(
    workspace.includes(
      `onlyBuiltDependencies:\n  - esbuild\n  - "coding-bible@https://codeload.github.com/Xanhast-pf/coding-bible/tar.gz/${revisions[0][1]}"\n`,
    ),
    "Git preparation must be allowed for the exact locked Coding Bible revision",
  );
});

test("live project canary is independent from frozen normal CI", async () => {
  const canary = await read(".github/workflows/coding-bible.yml");
  assert.match(canary, /uses: Xanhast-pf\/coding-bible@main\n/u);
  assert.match(canary, /scope: project/u);
  assert.match(canary, /config: coding-bible\.config\.json/u);
  assert.match(canary, /schedule:\n\s+- cron:/u);
  assert.doesNotMatch(canary, /exclude-rules:|continue-on-error:|pnpm update/u);
  const ci = await read(".github/workflows/ci.yml");
  const installs = [...ci.matchAll(/run: (pnpm install[^\n]*)/gu)];
  assert.ok(installs.length > 0);
  for (const [, command] of installs)
    assert.equal(command, "pnpm install --frozen-lockfile");
  assert.doesNotMatch(ci, /pnpm (?:update|bible:refresh)/u);
  assert.match(ci, /run-checks\.mjs quality coding-bible/u);
});

test("manual pin preserves other manifest fields and explains the main workflow", async () => {
  const cwd = await mkdtemp(join(tmpdir(), "flux-bible-pin-"));
  const path = join(cwd, "package.json");
  const original = { name: "fixture", devDependencies: { other: "1.0.0" } };
  await writeFile(path, JSON.stringify(original));
  const script = fileURLToPath(new URL("scripts/pin-coding-bible.mjs", root));
  for (const ref of ["v0.28.1", "a".repeat(40)]) {
    const result = spawnSync(process.execPath, [script, ref], {
      cwd,
      encoding: "utf8",
    });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    const pkg = JSON.parse(await readFile(path, "utf8"));
    assert.equal(
      pkg.devDependencies["@coding-bible/analyzer"],
      `github:Xanhast-pf/coding-bible#${ref}&path:packages/analyzer`,
    );
    assert.equal(pkg.devDependencies.other, "1.0.0");
    assert.equal(pkg.name, original.name);
  }
  const before = await readFile(path, "utf8");
  const result = spawnSync(process.execPath, [script, "main"], {
    cwd,
    encoding: "utf8",
  });
  assert.ifError(result.error);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /bible:refresh/u);
  assert.equal(await readFile(path, "utf8"), before);
});
