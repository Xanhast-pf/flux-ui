import assert from "node:assert/strict";
import { join, isAbsolute } from "node:path";
import test from "node:test";
import { diagnose, repositoryRoot } from "./doctor.mjs";

function fixture(overrides = {}) {
  const files = new Map(
    [
      [
        "package.json",
        JSON.stringify({
          engines: { node: ">=24" },
          packageManager: "pnpm@10.34.5",
        }),
      ],
      [".nvmrc", "24\n"],
    ].map(([path, content]) => [join(repositoryRoot, path), content]),
  );
  return {
    node: "v24.1.0",
    probe: (program) => ({ pnpm: "10.34.5" })[program],
    exists: () => true,
    read: (path) => {
      assert.ok(files.has(path));
      return files.get(path);
    },
    browser: () => true,
    ...overrides,
  };
}

test("supported versions and absolute script-relative paths pass with read-only probes", () => {
  assert.ok(isAbsolute(repositoryRoot));
  const result = diagnose(fixture());
  assert.equal(result.exitCode, 0);
  assert.ok(result.checks.every((check) => check.status === "pass"));
});

test("old Node, missing tools and wrong pnpm fail with remedies", () => {
  for (const overrides of [
    { node: "v22.0.0" },
    { probe: () => null },
    { probe: () => "10.34.4" },
  ]) {
    const result = diagnose(fixture(overrides));
    assert.equal(result.exitCode, 1);
    assert.ok(
      result.checks
        .filter((check) => check.status === "fail")
        .every((check) => check.remedy),
    );
  }
});

test("missing workspace/dependencies fail; optional browser absence only warns", () => {
  for (const missing of [
    "pnpm-lock.yaml",
    "pnpm-workspace.yaml",
    "node_modules/.modules.yaml",
    "node_modules/eslint/package.json",
  ]) {
    assert.equal(
      diagnose(
        fixture({ exists: (path) => path !== join(repositoryRoot, missing) }),
      ).exitCode,
      1,
    );
  }
  const result = diagnose(
    fixture({
      browser: () => {
        throw new Error("not installed");
      },
    }),
  );
  assert.equal(result.exitCode, 0);
  assert.equal(result.checks.at(-1).status, "warning");
});

test("unreadable configuration gives a required failure without writing", () => {
  assert.equal(
    diagnose(
      fixture({
        read: () => {
          throw new Error("missing");
        },
      }),
    ).exitCode,
    1,
  );
});

test("doctor only probes pnpm and uses the injected root for all file reads", () => {
  const root = join(repositoryRoot, "fixture with spaces");
  const probes = [];
  const reads = [];
  const original = fixture();
  const result = diagnose(
    fixture({
      root,
      probe: (program) => {
        probes.push(program);
        return "10.34.5";
      },
      read: (path) => {
        reads.push(path);
        return original.read(join(repositoryRoot, path.slice(root.length)));
      },
    }),
  );
  assert.equal(result.exitCode, 0);
  assert.deepEqual(probes, ["pnpm"]);
  assert.deepEqual(reads, [join(root, "package.json"), join(root, ".nvmrc")]);
});
