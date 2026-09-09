import { rm } from "node:fs/promises";
import { resolve } from "node:path";

const target = process.argv[2];
if (!target) {
  throw new Error("Usage: node scripts/clean.mjs <relative-path>");
}

const root = process.cwd();
const absolute = resolve(root, target);
if (!absolute.startsWith(root)) {
  throw new Error("Refusing to clean outside the repository.");
}
await rm(absolute, { recursive: true, force: true });
