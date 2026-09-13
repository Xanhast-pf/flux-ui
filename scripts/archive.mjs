import {
  constants,
  closeSync,
  copyFileSync,
  fstatSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  containsSecret,
  omitDirectory,
  omitFile,
} from "./lib/archive-policy.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = join(root, `${basename(root)}.zip`);
const staging = mkdtempSync(join(root, ".archive-"));
const source = join(staging, "source");
const files = [];
const skipped = [];
mkdirSync(source);

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true }).sort(
    (a, b) => a.name.localeCompare(b.name),
  )) {
    const absolute = join(directory, entry.name);
    const path = relative(root, absolute).split("\\").join("/");
    if (entry.isSymbolicLink()) {
      skipped.push(`${path} (symlink)`);
      continue;
    }
    if (entry.isDirectory()) {
      if (!omitDirectory(path, entry.name)) walk(absolute);
      continue;
    }
    if (!entry.isFile() || omitFile(entry.name)) {
      skipped.push(path);
      continue;
    }
    if (/[\r\n]/u.test(path))
      throw new Error("Archive filenames cannot contain line breaks.");
    const fd = openSync(
      absolute,
      constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0),
    );
    let bytes;
    let mode;
    try {
      const info = fstatSync(fd);
      if (!info.isFile()) throw new Error(`Not a regular source file: ${path}`);
      mode = info.mode;
      bytes = readFileSync(fd);
    } finally {
      closeSync(fd);
    }
    if (containsSecret(entry.name, bytes)) {
      skipped.push(`${path} (sensitive content)`);
      continue;
    }
    const dest = join(source, path);
    mkdirSync(dirname(dest), { recursive: true });
    // Zip the screened bytes, not mutable originals. Never print their contents.
    writeFileSync(dest, bytes, { mode });
    files.push({ path, size: bytes.byteLength });
  }
}
try {
  walk(root);
  if (!files.length) throw new Error("No source files found to archive.");
  const stagedZip = join(staging, "snapshot.zip");
  execFileSync("zip", ["-q", "-9", stagedZip, "-@"], {
    cwd: source,
    input: `${files.map(({ path }) => `./${path}`).join("\n")}\n`,
    stdio: ["pipe", "inherit", "inherit"],
  });
  // Keep the previous snapshot until a complete replacement is ready.
  const ready = join(staging, "ready.zip");
  copyFileSync(stagedZip, ready);
  renameSync(ready, output);
  console.log(
    `Created: ${output} (${statSync(output).size} bytes, ${files.length} files)`,
  );
  console.log("Largest included source files:");
  for (const file of [...files].sort((a, b) => b.size - a.size).slice(0, 10))
    console.log(`  ${file.size} B  ${file.path}`);
  console.log(
    `Excluded ${skipped.length} local/noisy/sensitive files. Review an archive before sharing; this is not a complete secret scanner.`,
  );
} finally {
  rmSync(staging, { recursive: true, force: true });
}
