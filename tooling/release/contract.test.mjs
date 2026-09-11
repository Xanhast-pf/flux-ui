import assert from "node:assert/strict";
import { test } from "node:test";
import {
  archiveName,
  assertPackage,
  assertVersion,
  hashes,
  REPOSITORY_URL,
} from "./contract.mjs";
const pkg = {
  name: "@flux-ui/react",
  version: "0.1.0-alpha.0",
  license: "MIT",
  repository: { url: REPOSITORY_URL },
  publishConfig: { access: "public", provenance: true },
  dependencies: { "@flux-ui/tokens": "^0.1.0-alpha.0" },
};
test("release versions and dist-tags cannot silently publish placeholders or prereleases as latest", () => {
  assertVersion("0.1.0-alpha.0", "alpha");
  assertVersion("1.0.0", "latest");
  for (const version of [
    "0.0.0",
    "1.01.0",
    "1.0.0-alpha.01",
    "../1.0.0",
    "1.0.0;echo",
    "1.0.0+",
  ])
    assert.throws(() => assertVersion(version, "latest"));
  assert.throws(() => assertVersion("1.0.0", "alpha"));
  assert.throws(() => assertVersion("1.0.0-alpha.0", "latest"));
});
test("release archive names are confined to the Flux package namespace", () => {
  assert.equal(
    archiveName(pkg.name, pkg.version),
    "flux-ui-react-0.1.0-alpha.0.tgz",
  );
  for (const name of [
    "@other/react",
    "../../evil",
    "@flux-ui/../../evil",
    "@flux-ui/react;echo",
    "react",
  ])
    assert.throws(() => archiveName(name, pkg.version));
});
test("packed metadata cannot hide wrong identity, private packages or local dependency protocols", () => {
  assertPackage(pkg, pkg);
  for (const mutate of [
    (p) => {
      p.private = true;
    },
    (p) => {
      p.name = "@flux-ui/not-react";
    },
    (p) => {
      p.publishConfig.provenance = false;
    },
    (p) => {
      p.repository.url = "https://example.com";
    },
    (p) => {
      p.scripts = { postinstall: "bad" };
    },
  ]) {
    const value = structuredClone(pkg);
    mutate(value);
    assert.throws(() => assertPackage(value, pkg));
  }
  for (const prefix of ["workspace", "catalog", "file", "link"])
    assert.throws(() =>
      assertPackage({ ...pkg, dependencies: { dep: `${prefix}:x` } }, pkg),
    );
});
test("release digests cover the actual bytes", () => {
  const result = hashes(Buffer.from("abc"));
  assert.equal(
    result.sha256,
    "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
  );
  assert.match(result.integrity, /^sha512-/u);
  assert.notDeepEqual(result, hashes(Buffer.from("abcd")));
});
