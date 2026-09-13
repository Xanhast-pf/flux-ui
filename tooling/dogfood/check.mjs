import { readdir, readFile } from "node:fs/promises";
import { resolve, relative } from "node:path";
import { auditSource } from "./source.mjs";
import { auditCss } from "./css.mjs";
const root = process.cwd();
const policy = JSON.parse(
  await readFile(resolve(root, "tooling/dogfood/ownership.json"), "utf8"),
);
const errors = [];
if (policy.schemaVersion !== 2)
  errors.push("Dogfood policy must use schemaVersion 2.");
for (const group of [
  "sourceExceptions",
  "artwork",
  "assets",
  "factories",
  "domAdapters",
  "inlineGeometry",
  "tokenAdapters",
]) {
  for (const entry of policy[group] ?? []) {
    if (
      !entry.file?.startsWith("apps/docs/src/") ||
      entry.file.endsWith("/") ||
      entry.file.includes("..") ||
      !entry.reason?.trim() ||
      "prefix" in entry
    ) {
      errors.push(
        `Invalid ${group} ownership: use an exact source file and a reason.`,
      );
      continue;
    }
    try {
      await readFile(resolve(root, entry.file));
    } catch {
      errors.push(`Stale ${group} owner: ${entry.file}`);
    }
  }
}
if ("teachingFixtures" in policy)
  errors.push(
    "Default examples must not have a blanket teaching-fixture exemption.",
  );
for (const [file, owner] of Object.entries(policy.stylesheets)) {
  if (
    !Number.isSafeInteger(owner.maxDeclarations) ||
    owner.maxDeclarations < 0 ||
    !owner.rules
  )
    errors.push(`Invalid CSS contract: ${file}`);
  try {
    await readFile(resolve(root, file));
  } catch {
    errors.push(`Stale stylesheet owner: ${file}`);
  }
}
let sources = 0;
let stylesheets = 0;
async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "generated") await visit(path);
      continue;
    }
    const file = relative(root, path).replaceAll("\\", "/");
    if (!/\.(?:tsx?|css)$/u.test(file)) continue;
    const source = await readFile(path, "utf8");
    if (file.endsWith(".css")) {
      stylesheets += 1;
      errors.push(...auditCss(source, file, policy.stylesheets[file]));
    } else {
      sources += 1;
      errors.push(
        ...auditSource(source, file, policy).map(
          (issue) =>
            `${issue.file}:${issue.line}:${issue.column} ${issue.message}`,
        ),
      );
    }
  }
}
await visit(resolve(root, "apps/docs/src"));
if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `Dogfood ownership: ${sources} source files and ${stylesheets} stylesheets checked. Artwork/performance exceptions are explicit; this is not an accessibility certification.`,
  );
