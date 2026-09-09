import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const name = process.argv[2];
if (!name) {
  console.error("Usage: pnpm component:doctor ComponentName");
  process.exit(1);
}
const dir = resolve(process.cwd(), "packages/react/src/components", name);
const required = [
  `${name}.tsx`,
  `${name}.types.ts`,
  `${name}.css.ts`,
  `${name}.test.tsx`,
  `${name}.stories.tsx`,
  `${name}.bench.tsx`,
  "component.meta.json",
  "index.ts",
];
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
  const validSizeClasses = [
    "primitive",
    "interactive",
    "overlay",
    "composite",
    "data-heavy",
  ];
  if (!validSizeClasses.includes(meta.sizeClass)) {
    failed = true;
    console.error(
      `✗ component.meta.json invalid sizeClass ${JSON.stringify(meta.sizeClass)}`,
    );
  }
} catch {
  failed = true;
}
if (failed) process.exitCode = 1;
else console.log(`\n${name} satisfies the Flux component scaffold contract.`);
