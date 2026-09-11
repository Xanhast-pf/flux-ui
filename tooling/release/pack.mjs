import {
  appendFile,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { resolve } from "node:path";
import { sourceContext } from "../trust/evidence.mjs";
import {
  archiveName,
  assertPackage,
  assertVersion,
  hashes,
  inspectArchive,
  REPOSITORY,
  run,
} from "./contract.mjs";

const source = sourceContext();
const tag = process.env.FLUX_RELEASE_TAG ?? "alpha";
if (
  source.kind === "github-actions" &&
  (source.repository !== REPOSITORY ||
    process.env.GITHUB_REF !== "refs/heads/main")
)
  throw new Error("Only this repository's main branch may prepare a release.");
const output = resolve(".cache/release");
const packages = [];
for (const entry of (await readdir("packages", { withFileTypes: true })).sort(
  (a, b) => a.name.localeCompare(b.name),
)) {
  if (!entry.isDirectory()) continue;
  const directory = resolve("packages", entry.name);
  const pkg = JSON.parse(
    await readFile(resolve(directory, "package.json"), "utf8"),
  );
  if (pkg.private === true) continue;
  assertVersion(pkg.version, tag);
  packages.push({
    directory,
    name: pkg.name,
    version: pkg.version,
    file: archiveName(pkg.name, pkg.version),
  });
}
if (packages.length === 0) throw new Error("No public packages discovered.");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const packed = [];
for (const pkg of packages) {
  run("pnpm", ["pack", "--pack-destination", output], {
    cwd: pkg.directory,
    stdio: "inherit",
    env: { ...process.env, npm_config_ignore_scripts: "true" },
  });
  const archive = resolve(output, pkg.file);
  assertPackage(inspectArchive(archive), pkg);
  packed.push({
    name: pkg.name,
    version: pkg.version,
    file: pkg.file,
    ...hashes(await readFile(archive)),
  });
}
const manifest = {
  schemaVersion: 1,
  createdAt: new Date().toISOString(),
  source,
  tag,
  packages: packed,
};
await writeFile(
  resolve(output, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
if (process.env.GITHUB_OUTPUT !== undefined)
  await appendFile(
    process.env.GITHUB_OUTPUT,
    `matrix=${JSON.stringify({ package: packed })}\n`,
  );
console.log(
  `Prepared ${packed.length} immutable archives. Nothing was published.`,
);
