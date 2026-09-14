import assert from "node:assert/strict";
import {
  mkdtemp,
  mkdir,
  readFile,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import {
  collectRecipeSources,
  generateShowcaseRecipes,
  recipeProject,
} from "../lib/showcase-recipes.mjs";
const catalog = await readFile(
  new URL("../../pnpm-workspace.yaml", import.meta.url),
  "utf8",
);
async function fixture(t) {
  const directory = await mkdtemp(resolve(tmpdir(), "flux-recipe-test-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(resolve(directory, "src"));
  return directory;
}
test("recipe source closure includes relative helpers, type imports and artwork without workspace aliases", async (t) => {
  const directory = await fixture(t);
  const root = resolve(directory, "src");
  await writeFile(
    resolve(root, "entry.tsx"),
    'import { Text } from "@flux-ui/react"; import { value } from "./model.js"; import "./art.css"; export default function Scene(){return <Text>{value}</Text>;}',
  );
  await writeFile(
    resolve(root, "model.ts"),
    'export type Identity = import("./type.js").Identity; export const value = "Hello";',
  );
  await writeFile(resolve(root, "type.ts"), "export type Identity = string;");
  await writeFile(resolve(root, "art.css"), ".art { aspect-ratio: 1; }");
  const files = await collectRecipeSources(root, "entry.tsx");
  assert.deepEqual(Object.keys(files), [
    "src/art.css",
    "src/entry.tsx",
    "src/model.ts",
    "src/type.ts",
  ]);
  assert.match(files["src/model.ts"], /Hello/);
});
test("recipe traversal, symlink escape, missing helpers and undeclared dependencies fail explicitly", async (t) => {
  const directory = await fixture(t);
  const root = resolve(directory, "src");
  await writeFile(
    resolve(directory, "outside.ts"),
    'export const secret = "not exported";',
  );
  const entry = resolve(root, "entry.ts");
  await writeFile(entry, 'import "../outside.ts";');
  await assert.rejects(collectRecipeSources(root, "entry.ts"), /escapes/);
  await symlink(resolve(directory, "outside.ts"), resolve(root, "linked.ts"));
  await writeFile(entry, 'import "./linked.ts";');
  await assert.rejects(collectRecipeSources(root, "entry.ts"), /escapes/);
  await writeFile(entry, 'import "./missing.js";');
  await assert.rejects(
    collectRecipeSources(root, "entry.ts"),
    /Missing recipe/,
  );
  for (const specifier of [
    "private-runtime",
    "@flux-ui/react/internal",
    "@flux-ui/icons/private",
  ]) {
    await writeFile(entry, `import "${specifier}";`);
    await assert.rejects(collectRecipeSources(root, "entry.ts"), /undeclared/);
  }
});
test("recipe generation rejects computed imports, unsupported CSS assets and invalid syntax", async (t) => {
  const directory = await fixture(t);
  const root = resolve(directory, "src");
  const entry = resolve(root, "entry.ts");
  await writeFile(
    entry,
    "export function load(path: string) { return import(path); }",
  );
  await assert.rejects(collectRecipeSources(root, "entry.ts"), /Computed/);
  await writeFile(entry, 'import "./art.css";');
  await writeFile(
    resolve(root, "art.css"),
    '.art { background: url("missing.png"); }',
  );
  await assert.rejects(collectRecipeSources(root, "entry.ts"), /CSS assets/);
  await writeFile(entry, "export const invalid = ;");
  await assert.rejects(collectRecipeSources(root, "entry.ts"), /syntax/);
});
test("recipe consumer setup points to exact local Flux artifacts and includes the MIT notice", () => {
  const files = recipeProject("finance", catalog, "Test MIT notice");
  const pkg = JSON.parse(files["package.json"]);
  for (const name of ["react", "tokens", "icons"]) {
    assert.equal(
      pkg.dependencies[`@flux-ui/${name}`],
      `file:./vendor/flux-ui-${name}.tgz`,
    );
    assert.equal(
      pkg.dependencies[`@flux-ui/${name}`],
      pkg.pnpm.overrides[`@flux-ui/${name}`],
    );
  }
  assert.equal(files.LICENSE, "Test MIT notice");
  assert.match(files["src/main.tsx"], /ThemeScope/);
  assert.match(files["README.md"], /not a release attestation/);
  assert.throws(() => recipeProject("../private", catalog, ""), /Unsafe/);
});
test("generated recipe checks catch drift and orphan output rather than silently deleting files", async (t) => {
  const root = await fixture(t);
  const scenes = resolve(root, "apps/docs/src/showcase/scenes");
  await mkdir(scenes, { recursive: true });
  await writeFile(resolve(root, "pnpm-workspace.yaml"), catalog);
  await writeFile(resolve(root, "LICENSE"), "Test notice");
  await writeFile(resolve(scenes, "example.scene.ts"), "export default {};");
  await writeFile(
    resolve(scenes, "example.preview.tsx"),
    "export default function Scene(){ return null; }",
  );
  assert.equal(await generateShowcaseRecipes(root, false), true);
  assert.equal(await generateShowcaseRecipes(root, true), true);
  await writeFile(
    resolve(scenes, "example.preview.tsx"),
    'export default function Scene(){ return "updated"; }',
  );
  assert.equal(await generateShowcaseRecipes(root, true), false);
  assert.equal(await generateShowcaseRecipes(root, false), true);
  const orphan = resolve(root, "apps/docs/src/generated/recipes/old.json");
  await writeFile(orphan, "{}");
  assert.equal(await generateShowcaseRecipes(root, true), false);
  await assert.rejects(generateShowcaseRecipes(root, false), /orphan/);
  assert.equal(await readFile(orphan, "utf8"), "{}");
});

test("repair workflow refreshes source exports after lint and formatting edits", async () => {
  const pkg = JSON.parse(
    await readFile(new URL("../../package.json", import.meta.url), "utf8"),
  );
  const commands = pkg.scripts["check:fix"].split(" && ");
  const format = commands.indexOf("pnpm format");
  assert.ok(format > commands.indexOf("pnpm lint:fix"));
  assert.equal(commands[format + 1], "pnpm generate");
  assert.equal(commands.at(-1), "pnpm check");
});
