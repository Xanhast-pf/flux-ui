import assert from "node:assert/strict";
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { execFileSync, spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { containsSecret, omitFile } from "../../scripts/lib/archive-policy.mjs";
import { findPortablePathCollisions } from "../../scripts/lib/portable-paths.mjs";

async function fixture(run) {
  const dir = await mkdtemp(join(tmpdir(), "flux-safety-"));
  const root = join(dir, "repo");
  await mkdir(root);
  await cp(new URL("../../scripts", import.meta.url), join(root, "scripts"), {
    recursive: true,
  });
  try {
    await run(root, dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test("clean is root-anchored and rejects root, traversal, prefix siblings and source", async () => {
  await fixture(async (root, dir) => {
    const output = join(root, "packages/react/dist");
    await mkdir(output, { recursive: true });
    await writeFile(join(output, "stale.js"), "stale");
    const invoke = (target, cwd = root) =>
      spawnSync(process.execPath, [join(root, "scripts/clean.mjs"), target], {
        cwd,
        encoding: "utf8",
      });
    for (const target of [
      ".",
      "..",
      "../repo-other",
      "packages/react/src",
      "/tmp",
      "packages/react/dist/..",
      "packages/react/dist/../../src",
    ]) {
      assert.notEqual(invoke(target).status, 0, target);
    }
    assert.equal(
      invoke("packages/react/dist", join(root, "packages/react")).status,
      0,
    );
    await assert.rejects(readFile(join(output, "stale.js")), {
      code: "ENOENT",
    });
    await mkdir(join(dir, "outside"));
    await writeFile(join(dir, "outside/keep"), "safe");
    await symlink(join(dir, "outside"), output, "dir");
    assert.notEqual(invoke("packages/react/dist").status, 0);
    assert.equal(await readFile(join(dir, "outside/keep"), "utf8"), "safe");
  });
});
test("archive includes sources/templates but not secrets, symlinks or generated noise", async () => {
  await fixture(async (root) => {
    for (const [file, content] of Object.entries({
      "src/index.ts": "export const ok = true",
      "pnpm-lock.yaml": "lockfileVersion: 9",
      ".env": "TOKEN=secret",
      ".env.local": "SECRET=local",
      ".env.example": "TOKEN=${TOKEN}",
      "key.pem": "test",
      ".npmrc": "//registry.npmjs.org/:_authToken=super-secret-test-value",
      "node_modules/a/index.js": "noise",
      "config/renamed.txt": "-----BEGIN PRIVATE KEY-----\nTEST",
      ".coding-bible/cache/old.json": "{}",
    })) {
      const { dirname } = await import("node:path");
      await mkdir(dirname(join(root, file)), { recursive: true });
      await writeFile(join(root, file), content);
    }
    await symlink(join(root, ".env"), join(root, "env-link"));
    const result = spawnSync(
      process.execPath,
      [join(root, "scripts/archive.mjs")],
      { cwd: join(root, "scripts"), encoding: "utf8" },
    );
    assert.equal(result.status, 0, result.stderr);
    const zip = join(root, "repo.zip");
    const listing = execFileSync("unzip", ["-Z1", zip], { encoding: "utf8" });
    for (const path of ["src/index.ts", "pnpm-lock.yaml", ".env.example"])
      assert.ok(listing.includes(path), path);
    for (const path of [
      "./.env\n",
      ".env.local",
      "key.pem",
      ".npmrc",
      "node_modules/",
      "renamed.txt",
      "env-link",
      ".coding-bible/cache/",
    ])
      assert.ok(!listing.includes(path), path);
    const before = await readFile(zip);
    const failed = spawnSync(
      process.execPath,
      [join(root, "scripts/archive.mjs")],
      { env: { ...process.env, PATH: "" }, encoding: "utf8" },
    );
    assert.notEqual(failed.status, 0);
    assert.deepEqual(
      await readFile(zip),
      before,
      "last good archive survives a zip failure",
    );
  });
});
test("portable paths reject case and Unicode-normalization collisions", () => {
  assert.deepEqual(
    findPortablePathCollisions([
      "src/internal/RovingFocus.tsx",
      "src/internal/rovingfocus.tsx",
      "docs/caf\u00e9.md",
      "docs/cafe\u0301.md",
      "src/index.ts",
    ]),
    [
      ["docs/cafe\u0301.md", "docs/caf\u00e9.md"],
      ["src/internal/RovingFocus.tsx", "src/internal/rovingfocus.tsx"],
    ],
  );
});

test("credential screening distinguishes environment placeholders from literal credentials", () => {
  assert.equal(
    containsSecret(
      ".npmrc",
      Buffer.from(
        "registry=https://registry.npmjs.org\n//host/:_authToken=${NPM_TOKEN}",
      ),
    ),
    false,
  );
  assert.equal(
    containsSecret(".npmrc", Buffer.from("//host/:_authToken=secret")),
    true,
  );
  assert.equal(omitFile(".env.production"), true);
  assert.equal(omitFile(".env.example"), false);
});
