import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

export const REPOSITORY = "Xanhast-pf/flux-ui";
export const REPOSITORY_URL = `git+https://github.com/${REPOSITORY}.git`;
const versionPattern =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/u;

export function assertVersion(version, tag) {
  const match =
    typeof version === "string" ? versionPattern.exec(version) : null;
  if (
    match === null ||
    version === "0.0.0" ||
    (match[4]?.split(".").some((part) => /^0\d+$/u.test(part)) ?? false)
  ) {
    throw new Error(
      "Prepare a real, valid release version with Changesets before packing.",
    );
  }
  if (
    !["alpha", "latest"].includes(tag) ||
    (tag === "latest") !== (match[4] === undefined)
  ) {
    throw new Error(
      "Use the alpha tag for prereleases and latest for stable versions.",
    );
  }
}

export function archiveName(name, version) {
  if (
    typeof name !== "string" ||
    !/^@flux-ui\/[a-z][a-z0-9-]*$/u.test(name) ||
    typeof version !== "string" ||
    !versionPattern.test(version)
  ) {
    throw new Error("Unsafe package identity.");
  }
  return `${name.slice(1).replace("/", "-")}-${version}.tgz`;
}

export function assertPackage(pkg, expected) {
  if (
    pkg.name !== expected.name ||
    pkg.version !== expected.version ||
    pkg.private === true ||
    pkg.license !== "MIT" ||
    pkg.repository?.url !== REPOSITORY_URL ||
    pkg.publishConfig?.access !== "public" ||
    pkg.publishConfig?.provenance !== true
  ) {
    throw new Error(
      "Packed package identity, repository, license or publishing policy does not match.",
    );
  }
  for (const group of [
    "dependencies",
    "optionalDependencies",
    "peerDependencies",
  ]) {
    for (const specifier of Object.values(pkg[group] ?? {})) {
      if (
        typeof specifier !== "string" ||
        /^(?:workspace|catalog|file|link):/u.test(specifier)
      )
        throw new Error("Unresolved local dependency in packed package.");
    }
  }
  for (const hook of ["preinstall", "install", "postinstall"]) {
    if (Object.hasOwn(pkg.scripts ?? {}, hook))
      throw new Error(
        "Install-time lifecycle scripts are not allowed in Flux packages.",
      );
  }
}

export function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    ...options,
  });
  if (result.error !== undefined) throw result.error;
  if (result.status !== 0)
    throw new Error(
      `${command} failed (${result.status}): ${result.stderr ?? ""}`,
    );
  return result.stdout;
}

export function inspectArchive(path) {
  const entries = run("tar", ["-tzf", path]).trim().split("\n");
  const hasControlCharacters = (entry) =>
    [...entry].some((character) => character.charCodeAt(0) <= 0x1f);
  if (
    entries.length === 0 ||
    new Set(entries).size !== entries.length ||
    entries.some(
      (entry) =>
        !entry.startsWith("package/") ||
        entry.includes("\\") ||
        entry.split("/").includes("..") ||
        hasControlCharacters(entry),
    )
  ) {
    throw new Error("Unsafe or duplicate archive paths.");
  }
  const types = run("tar", ["-tvzf", path]).trim().split("\n");
  if (types.some((line) => !["-", "d"].includes(line[0])))
    throw new Error("Archive links and special files are not allowed.");
  if (
    !entries.some(
      (entry) => entry.startsWith("package/dist/") && !entry.endsWith("/"),
    )
  )
    throw new Error("Packed package has no built output.");
  return JSON.parse(run("tar", ["-xOf", path, "package/package.json"]));
}

export function hashes(bytes) {
  return {
    sha256: createHash("sha256").update(bytes).digest("hex"),
    integrity: `sha512-${createHash("sha512").update(bytes).digest("base64")}`,
  };
}

export async function verifyPackage(file, env = process.env) {
  const manifest = JSON.parse(
    await readFile(resolve(".cache/release/manifest.json"), "utf8"),
  );
  if (
    manifest.schemaVersion !== 1 ||
    !Array.isArray(manifest.packages) ||
    manifest.packages.length === 0 ||
    manifest.source.repository !== REPOSITORY ||
    manifest.source.commit !== env.GITHUB_SHA ||
    manifest.source.runId !== env.GITHUB_RUN_ID ||
    manifest.source.runAttempt !== env.GITHUB_RUN_ATTEMPT
  )
    throw new Error("Release manifest is not from this exact workflow run.");
  const pkg = manifest.packages.find((entry) => entry.file === file);
  if (pkg === undefined || pkg.file !== archiveName(pkg.name, pkg.version))
    throw new Error("Archive is not listed in the release manifest.");
  assertVersion(pkg.version, manifest.tag);
  const path = resolve(".cache/release", pkg.file);
  const computed = hashes(await readFile(path));
  if (computed.sha256 !== pkg.sha256 || computed.integrity !== pkg.integrity)
    throw new Error("Release archive digest mismatch.");
  assertPackage(inspectArchive(path), pkg);
  return { pkg, path, tag: manifest.tag };
}
