import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { validSizeClasses } from "../tooling/size/budgets.mjs";
import {
  createComponentReadiness,
  requiredComponentFiles,
} from "./lib/component-readiness.mjs";
import { createPublicContracts } from "./lib/public-contracts.mjs";

const name = process.argv[2];
if (!name) {
  console.error("Usage: pnpm flux component doctor ComponentName");
  process.exit(1);
}
const dir = resolve(process.cwd(), "packages/react/src/components", name);
const required = requiredComponentFiles.map((suffix) =>
  suffix.startsWith(".") ? name + suffix : suffix,
);
let failed = false;
for (const file of required) {
  try {
    await access(resolve(dir, file));
    console.log(`✓ ${file}`);
  } catch {
    failed = true;
    console.error(`✗ ${file}`);
  }
}
try {
  const meta = JSON.parse(
    await readFile(resolve(dir, "component.meta.json"), "utf8"),
  );
  for (const key of [
    "name",
    "slug",
    "category",
    "status",
    "description",
    "sizeClass",
  ]) {
    if (!meta[key]) {
      failed = true;
      console.error(`✗ component.meta.json missing ${key}`);
    }
  }
  try {
    await access(
      resolve(
        process.cwd(),
        "apps/docs/src/examples",
        `${meta.slug}.example.tsx`,
      ),
    );
    console.log(`✓ ${meta.slug}.example.tsx`);
  } catch {
    failed = true;
    console.error(`✗ missing live docs example for ${meta.slug}`);
  }
  if (!validSizeClasses.includes(meta.sizeClass)) {
    failed = true;
    console.error(
      `✗ component.meta.json invalid sizeClass ${JSON.stringify(meta.sizeClass)}`,
    );
  }
} catch {
  failed = true;
}
const { contracts, errors: contractErrors } = createPublicContracts(
  process.cwd(),
);
for (const error of contractErrors.filter((message) =>
  message.startsWith(name + ":"),
)) {
  failed = true;
  console.error("✗ " + error);
}
const readiness = createComponentReadiness(process.cwd(), contracts);
const componentReadiness = readiness.components.find(
  (component) => component.name === name,
);
for (const error of readiness.errors.filter((message) =>
  message.startsWith(name + ":"),
)) {
  failed = true;
  console.error("✗ " + error);
}
if (componentReadiness !== undefined) {
  if (componentReadiness.blockers.length === 0)
    console.log("✓ eligible for beta review");
  else
    console.log(
      "i alpha promotion blockers: " + componentReadiness.blockers.join("; "),
    );
}
if (failed) process.exitCode = 1;
else console.log(`\n${name} satisfies the Flux component scaffold contract.`);
