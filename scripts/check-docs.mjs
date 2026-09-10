import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { validateExampleFiles } from "./docs-catalog.mjs";
const root = process.cwd();
const componentRoot = resolve(root, "packages/react/src/components");
const dirs = (await readdir(componentRoot, { withFileTypes: true })).filter(
  (entry) => entry.isDirectory(),
);
const metadata = await Promise.all(
  dirs.map(async (entry) =>
    JSON.parse(
      await readFile(
        resolve(componentRoot, entry.name, "component.meta.json"),
        "utf8",
      ),
    ),
  ),
);
const filenames = await readdir(resolve(root, "apps/docs/src/examples"));
const errors = validateExampleFiles(
  metadata.map((entry) => entry.slug),
  filenames,
);
if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `Docs coverage: ${metadata.length} public families, one example each.`,
  );
