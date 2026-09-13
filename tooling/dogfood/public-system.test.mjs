import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
const root = new URL("../../", import.meta.url);
const source = (file) => readFile(new URL(file, root), "utf8");

test("display-owning primitives preserve hidden and until-found locally", async () => {
  for (const file of [
    "packages/react/src/internal/flexLayout.css.ts",
    "packages/react/src/components/Grid/Grid.css.ts",
    "packages/react/src/components/Field/Field.css.ts",
    "packages/react/src/components/Avatar/Avatar.css.ts",
    "packages/react/src/components/Box/Box.css.ts",
  ]) {
    const css = await source(file);
    assert.match(
      css,
      /&\[hidden\]:not\(\[hidden=["']until-found["'] i\]\)/u,
      `${file} must preserve hidden without cancelling until-found`,
    );
    assert.match(css, /display:\s*["']none !important["']/u);
  }
  const index = await source("packages/react/src/index.ts");
  assert.doesNotMatch(index, /global\.css/u);
});
test("Tabs styling state is part-local, never inherited through an ancestor selector", async () => {
  const css = await source("packages/react/src/components/Tabs/Tabs.css.ts");
  assert.doesNotMatch(css, /\$\{root\}/u);
  assert.match(css, /&\[data-a='pill'\]/u);
  assert.match(css, /&\[aria-orientation='vertical'\]/u);
  const component = await source("packages/react/src/components/Tabs/Tabs.tsx");
  assert.match(component, /closest\('\[role="tablist"\]'\)/u);
});
test("Sidebar is distinct from the native modal implementation and lives outside route content", async () => {
  const sidebar = await source(
    "packages/react/src/components/Sidebar/Sidebar.tsx",
  );
  const app = await source("apps/docs/src/App.tsx");
  const nav = await source("apps/docs/src/ui/Navigation.tsx");
  assert.doesNotMatch(
    sidebar,
    /NativeModal|showModal|localStorage|location\.hash/u,
  );
  assert.match(sidebar, /hidden=\{!state\.open\}/u);
  assert.match(sidebar, /aria-expanded=\{state\.open\}/u);
  assert.match(app, /<Sidebar.Root>/u);
  assert.match(app, /<Sidebar.Content>/u);
  assert.doesNotMatch(nav, /Drawer|setOpen\(false\)|onNavigate/u);
});
test("default examples have exact ownership and consumer build cannot silently use sources", async () => {
  const policy = JSON.parse(await source("tooling/dogfood/ownership.json"));
  assert.equal(policy.schemaVersion, 2);
  assert.equal("teachingFixtures" in policy, false);
  assert.ok(
    policy.sourceExceptions.every(
      (entry) =>
        entry.file && !entry.prefix && !entry.file.includes("examples/"),
    ),
  );
  const config = await source("apps/docs/consumer/vite.config.ts");
  assert.doesNotMatch(config, /alias:|vanillaExtractPlugin/u);
  assert.match(config, /Consumer bypassed a public built export/u);
  const entry = await source("apps/docs/consumer/main.tsx");
  assert.doesNotMatch(entry, /from ["']\.\.\//u);
  assert.match(entry, /@flux-ui\/tokens\/reset\.css/u);
});
test("consumer runs in the full gate and standalone icon checks cannot read stale builds", async () => {
  const manifest = JSON.parse(await source("package.json"));
  assert.match(manifest.scripts["check:full"], /pnpm consumer:check/u);
  for (const name of ["icons:size", "icons:size:update"])
    assert.match(
      manifest.scripts[name],
      /^pnpm --filter @flux-ui\/icons build && node tooling\/icons\/check\.mjs/u,
    );
  assert.match(manifest.scripts["consumer:check"], /^pnpm build:packages &&/u);
});

test("fresh checkouts build public declarations before type-aware consumer lint", async () => {
  const { scripts } = JSON.parse(await source("package.json"));
  for (const [name, lint] of [
    ["check", "pnpm lint"],
    ["check:fix", "pnpm lint:fix"],
  ]) {
    const commands = scripts[name].split(" && ");
    assert.ok(commands.indexOf("pnpm build:packages") >= 0);
    assert.ok(commands.indexOf("pnpm build:packages") < commands.indexOf(lint));
  }
});

test("until-found is exercised as a platform attribute, not a React boolean prop", async () => {
  const semantic = await source(
    "packages/react/src/internal/semantic.types.ts",
  );
  const entry = await source("apps/docs/consumer/main.tsx");
  const spec = await source("apps/docs/consumer/consumer.spec.ts");

  assert.doesNotMatch(semantic, /HiddenState|until-found/u);
  assert.doesNotMatch(entry, /hidden=["']until-found["']/u);
  assert.match(spec, /setAttribute\("hidden", "until-found"\)/u);
});
