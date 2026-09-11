import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { inspectArchive, run } from "./contract.mjs";

// The release worker is Linux. Skip tar-dependent integration tests when tar is absent locally.
let hasTar = true;
try {
  run("tar", ["--version"]);
} catch {
  hasTar = false;
}
async function fixture(callback) {
  const root = await mkdtemp(join(tmpdir(), "flux-archive-"));
  try {
    await mkdir(join(root, "package/dist"), { recursive: true });
    await writeFile(
      join(root, "package/package.json"),
      JSON.stringify({ name: "@flux-ui/react", version: "0.1.0-alpha.0" }),
    );
    await writeFile(
      join(root, "package/dist/index.js"),
      "export const version = 1;\n",
    );
    await callback(root, join(root, "package.tgz"));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}
test(
  "archive inspection reads metadata without extracting package files",
  { skip: !hasTar },
  async () => {
    await fixture(async (root, archive) => {
      run("tar", ["-czf", archive, "-C", root, "package"]);
      assert.equal(inspectArchive(archive).name, "@flux-ui/react");
    });
  },
);
test(
  "archive inspection rejects empty build output",
  { skip: !hasTar },
  async () => {
    await fixture(async (root, archive) => {
      await rm(join(root, "package/dist"), { recursive: true });
      run("tar", ["-czf", archive, "-C", root, "package"]);
      assert.throws(() => inspectArchive(archive), /no built output/u);
    });
  },
);
test(
  "archive inspection rejects links instead of following them",
  { skip: !hasTar || process.platform === "win32" },
  async () => {
    await fixture(async (root, archive) => {
      await symlink("../../outside", join(root, "package/dist/unsafe"));
      run("tar", ["-czf", archive, "-C", root, "package"]);
      assert.throws(() => inspectArchive(archive), /links/u);
    });
  },
);
