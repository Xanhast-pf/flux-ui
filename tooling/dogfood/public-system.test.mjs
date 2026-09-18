import { commands, taskName, taskCommand } from "../terminal/commands.mjs";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
const root = new URL("../../", import.meta.url);
const source = (file) => readFile(new URL(file, root), "utf8");
test("display-owning primitives preserve hidden and until-found locally", async () => {
  for (const file of [
    "packages/react/src/internal/flexLayout.css.ts",
    "packages/react/src/internal/actionButtonStyles.ts",
    "packages/react/src/components/AspectRatio/AspectRatio.css.ts",
    "packages/react/src/components/Badge/Badge.css.ts",
    "packages/react/src/components/Breadcrumbs/Breadcrumbs.css.ts",
    "packages/react/src/components/Kbd/Kbd.css.ts",
    "packages/react/src/components/Skeleton/Skeleton.css.ts",
    "packages/react/src/components/Toggle/Toggle.css.ts",
    "packages/react/src/components/Toolbar/Toolbar.css.ts",
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
  const button = await source(
    "packages/react/src/components/Button/Button.tsx",
  );
  const link = await source("packages/react/src/components/Link/Link.tsx");
  assert.match(button, /!buttonProps\.hidden && action/u);
  assert.match(link, /!props\.hidden && link/u);
  assert.match(link, /!props\.hidden && actionLike && action/u);
  const index = await source("packages/react/src/index.ts");
  assert.doesNotMatch(index, /global\.css/u);
});
test("Tabs styling state is part-local, never inherited through an ancestor selector", async () => {
  const css = await source("packages/react/src/components/Tabs/Tabs.css.ts");
  assert.doesNotMatch(css, /\$\{root\}/u);
  assert.match(css, /&\[data-a='pill'\]/u);
  assert.match(css, /&\[aria-orientation='vertical'\]/u);
  const component = await source(
    "packages/react/src/components/Tabs/TabsList.tsx",
  );
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
  assert.match(app, /<Drawer.Root\s+open=\{compactNavigation && mobileOpen\}/u);
  assert.match(nav, /!mobile &&/u);
  assert.match(nav, /<Sidebar.Panel/u);
  assert.match(nav, /<Drawer.Popup/u);
  assert.match(nav, /onNavigate=\{onNavigate\}/u);
  assert.doesNotMatch(sidebar, /Drawer|setOpen\(false\).*route/u);
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
  assert.ok(
    commands["check:full"].some(
      (command) => taskName(command) === "consumer:check",
    ),
  );
  for (const name of ["icons:size", "icons:size:update"]) {
    assert.deepEqual(commands[name][0], [
      "pnpm",
      "--filter",
      "@flux-ui/icons",
      "build",
    ]);
    assert.equal(commands[name][1][1], "tooling/icons/check.mjs");
  }
  assert.deepEqual(
    commands["consumer:check"][0],
    taskCommand("build:packages"),
  );
});
test("fresh checkouts build public declarations before type-aware consumer lint", () => {
  for (const [name, lint] of [
    ["check", "lint"],
    ["check:fix", "lint:fix"],
  ]) {
    const tasks = commands[name].map(taskName);
    assert.ok(tasks.indexOf("build:packages") >= 0);
    assert.ok(tasks.indexOf("build:packages") < tasks.indexOf(lint));
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
