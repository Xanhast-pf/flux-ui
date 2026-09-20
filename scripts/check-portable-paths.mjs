import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { findPortablePathCollisions } from "./lib/portable-paths.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const tracked = execFileSync("git", ["ls-files", "-z"], {
  cwd: root,
  encoding: "utf8",
})
  .split("\0")
  .filter(Boolean);
const collisions = findPortablePathCollisions(tracked);

if (collisions.length > 0) {
  console.error(
    "Tracked paths collide on case-insensitive or Unicode-normalizing filesystems:",
  );
  for (const group of collisions) console.error(`  - ${group.join(" <-> ")}`);
  process.exitCode = 1;
} else {
  console.log(`Portable path check passed (${tracked.length} tracked paths).`);
}
