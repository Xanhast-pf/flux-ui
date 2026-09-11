import { readdirSync, rmSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { basename, join, relative, resolve } from "node:path";

const root = resolve(".");
const projectName = basename(root);

const output = join(root, `${projectName}.zip`);

const ignoredDirectories = new Set([
  ".git",
  ".idea",
  ".vscode",

  "node_modules",
  "dist",
  "build",
  "coverage",

  ".cache",
  ".turbo",
  ".vite",
  ".next",

  "playwright-report",
  "test-results",

  ".pnpm-store",
]);

const ignoredPaths = new Set([".coding-bible/cache"]);

function shouldIgnoreFile(name) {
  return (
    name === ".DS_Store" ||
    name === "Thumbs.db" ||
    name.endsWith(".log") ||
    name.endsWith(".zip")
  );
}

function normalizePath(path) {
  return path.replaceAll("\\", "/");
}

const files = [];

function walk(directory) {
  for (const entry of readdirSync(directory, {
    withFileTypes: true,
  })) {
    const absolute = join(directory, entry.name);
    const projectRelativePath = normalizePath(relative(root, absolute));

    if (
      entry.isDirectory() &&
      (ignoredDirectories.has(entry.name) ||
        ignoredPaths.has(projectRelativePath))
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      walk(absolute);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (shouldIgnoreFile(entry.name)) {
      continue;
    }

    files.push(projectRelativePath);
  }
}

walk(root);

if (files.length === 0) {
  throw new Error("No files found to archive.");
}

const formatSize = (bytes) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KiB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MiB`;
};

const fileSizes = files.map((file) => ({
  file,
  size: statSync(join(root, file)).size,
}));

const totalSize = fileSizes.reduce((total, { size }) => total + size, 0);

const largestFiles = [...fileSizes]
  .sort((a, b) => b.size - a.size)
  .slice(0, 15);

console.log(`Archiving ${files.length} files`);
console.log(`Source size: ${formatSize(totalSize)}\n`);

console.log("Largest included files:");

for (const { file, size } of largestFiles) {
  console.log(`  ${formatSize(size).padStart(10)}  ${file}`);
}

console.log();

rmSync(output, {
  force: true,
});

execFileSync("zip", ["-q", "-9", output, "-@"], {
  cwd: root,
  input: files.join("\n"),
  stdio: ["pipe", "inherit", "inherit"],
});

const archiveSize = statSync(output).size;

console.log(`Created: ${output}`);
console.log(`Archive size: ${formatSize(archiveSize)}`);
