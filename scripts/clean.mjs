import { rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { confinedPath, isBuildOutput } from "./lib/safe-paths.mjs";

const target = process.argv[2];
if (process.argv.length !== 3 || !target || !isBuildOutput(target)) {
  throw new Error(
    "Usage: node scripts/clean.mjs <.cache|packages/name/dist|apps/name/dist>",
  );
}
// Package scripts run from their package directory, not necessarily the root.
const root = fileURLToPath(new URL("../", import.meta.url));
await rm(await confinedPath(root, target), { recursive: true, force: true });
