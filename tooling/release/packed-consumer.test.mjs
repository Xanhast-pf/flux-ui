import assert from "node:assert/strict";
import test from "node:test";
import { archiveName, hashes } from "./contract.mjs";
import {
  assertConsumerManifest,
  consumerPackageJson,
  consumerPackages,
} from "./packed-consumer-contract.mjs";
function manifest() {
  return {
    schemaVersion: 1,
    tag: "alpha",
    source: { kind: "local" },
    packages: consumerPackages.map((name) => ({
      name,
      version: "0.1.0-alpha.0",
      file: archiveName(name, "0.1.0-alpha.0"),
      ...hashes(Buffer.from(name)),
    })),
  };
}
test("packed consumer requires all public candidate packages and rejects placeholder versions", () => {
  assertConsumerManifest(manifest(), {});
  const missing = manifest();
  missing.packages.pop();
  assert.throws(() => assertConsumerManifest(missing, {}), /Missing/);
  const placeholder = manifest();
  placeholder.packages[0].version = "0.0.0";
  assert.throws(() => assertConsumerManifest(placeholder, {}));
});
test("packed consumer rejects duplicate entries, traversal and invalid digests", () => {
  const duplicate = manifest();
  duplicate.packages.push(duplicate.packages[0]);
  assert.throws(() => assertConsumerManifest(duplicate, {}), /Duplicate/);
  for (const change of [
    (entry) => {
      entry.file = "../candidate.tgz";
    },
    (entry) => {
      entry.sha256 = "abc";
    },
    (entry) => {
      entry.integrity = "sha512-no";
    },
  ]) {
    const value = manifest();
    change(value.packages[0]);
    assert.throws(() => assertConsumerManifest(value, {}));
  }
});
test("CI consumer verification binds to actual run identity, while local checks cannot impersonate CI", () => {
  const value = manifest();
  value.source = {
    kind: "github-actions",
    repository: "Xanhast-pf/flux-ui",
    commit: "abc",
    runId: "42",
    runAttempt: "1",
  };
  const env = {
    GITHUB_ACTIONS: "true",
    GITHUB_SHA: "abc",
    GITHUB_RUN_ID: "42",
    GITHUB_RUN_ATTEMPT: "1",
  };
  assertConsumerManifest(value, env);
  assert.throws(() => assertConsumerManifest(value, {}), /Local/);
  assert.throws(
    () => assertConsumerManifest(value, { ...env, GITHUB_SHA: "other" }),
    /exact/,
  );
  assert.throws(() => assertConsumerManifest(manifest(), env), /exact/);
});
test("isolated consumer uses exact installed tooling and the same archives for transitive Flux dependencies", () => {
  const versions = Object.fromEntries(
    [
      "react",
      "react-dom",
      "@types/react",
      "@types/react-dom",
      "@types/node",
      "typescript",
      "vite",
      "@playwright/test",
    ].map((name) => [name, "1.2.3"]),
  );
  const pkg = consumerPackageJson(manifest(), versions);
  for (const name of consumerPackages) {
    assert.equal(pkg.dependencies[name], pkg.pnpm.overrides[name]);
    assert.match(pkg.dependencies[name], /^file:\.\/vendor\//u);
  }
  assert.equal(pkg.dependencies.react, "1.2.3");
  assert.equal(pkg.scripts, undefined);
  assert.throws(
    () => consumerPackageJson(manifest(), { ...versions, vite: "^8.0.0" }),
    /exact tool/,
  );
});
