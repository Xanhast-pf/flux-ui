import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const ref = process.argv[2];
if (!ref) {
  console.error("Usage: pnpm bible:pin <canary-green-tag-or-sha>");
  process.exit(1);
}

if (["main", "master"].includes(ref)) {
  console.error(
    "Ref must be an immutable Canary-green tag or commit SHA, not a moving branch.",
  );
  process.exit(1);
}
const path = resolve(process.cwd(), "package.json");
const pkg = JSON.parse(await readFile(path, "utf8"));
pkg.devDependencies["@coding-bible/analyzer"] =
  `github:Xanhast-pf/coding-bible#${ref}&path:packages/analyzer`;
await writeFile(path, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
console.log(
  `Pinned Coding Bible analyzer to ${ref}. Run pnpm install to refresh the lockfile.`,
);
