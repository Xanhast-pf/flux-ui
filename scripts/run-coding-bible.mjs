import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Prefer the public export of the prepared Git-subdirectory package. Frozen
// installs can instead expose the repository archive, whose CLI is nested.
const cli = import.meta.resolve("@coding-bible/analyzer/bin");
await import(
  existsSync(fileURLToPath(cli))
    ? cli
    : "@coding-bible/analyzer/packages/analyzer/dist/bin/coding-bible.mjs"
);
