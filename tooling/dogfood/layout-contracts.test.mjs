import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  gapToCssValue,
  setSpacing,
} from "../../packages/react/src/internal/spacing.ts";
import { setResponsiveCssVariable } from "../../packages/react/src/internal/responsiveValue.ts";
import { responsiveStyle } from "../../packages/react/src/internal/responsive.css.ts";

const root = new URL("../../", import.meta.url);

test("all named and numbered gap tokens map to the same public CSS contract", () => {
  for (const [alias, step] of Object.entries({
    xs: 1,
    sm: 2,
    md: 4,
    lg: 6,
    xl: 8,
  })) {
    assert.equal(gapToCssValue(alias), `var(--flux-space-${step})`);
  }
  for (const step of [1, 2, 3, 4, 5, 6, 8, 10, 12, 16]) {
    assert.equal(gapToCssValue(step), `var(--flux-space-${step})`);
  }
  assert.equal(gapToCssValue("none"), "0rem");
});
test("scalar gaps serialize exactly once instead of expanding six breakpoints", () => {
  const style = {};
  setResponsiveCssVariable(style, "f-l", "md", gapToCssValue);
  assert.deepEqual(style, { "--f-l-b": "var(--flux-space-4)" });
});
test("sparse responsive values preserve authored zero and empty entries", () => {
  const style = {};
  setResponsiveCssVariable(style, "f-k", { base: 1, md: 0, "2xl": 4 }, String);
  assert.deepEqual(style, {
    "--f-k-b": "1",
    "--f-k-m": "0",
    "--f-k-2": "4",
  });
  const absent = {};
  setResponsiveCssVariable(absent, "f-l", undefined, String);
  setResponsiveCssVariable(absent, "f-l", {}, String);
  assert.deepEqual(absent, {});
});
test("sparse breakpoint aliases refer only to locally declared predecessors", () => {
  const rule = responsiveStyle({
    gap: "var(--f-l-b, 0)",
    "@media": {
      "(min-width: 48rem)": { gap: "var(--f-l-m, 0)" },
      "(min-width: 80rem)": { gap: "var(--f-l-x, 0)" },
    },
  });
  assert.deepEqual(rule.vars, {
    "--f-l-b": "initial",
    "--f-l-m": "var(--f-l-b)",
    "--f-l-x": "var(--f-l-m)",
  });
});
test("native spacing honors each axis and consumer padding shorthand", () => {
  const style = {};
  setSpacing(style, "md", "sm", 6);
  assert.deepEqual(style, {
    padding: "var(--flux-space-4)",
    paddingBlock: "var(--flux-space-2)",
    paddingInline: "var(--flux-space-6)",
  });
  const overridden = {};
  setSpacing(overridden, "md", "sm", 6, { padding: "3rem" });
  assert.deepEqual(overridden, {});
});
test("docs no longer mount or style a second, fixed navigation panel", async () => {
  const app = await readFile(new URL("apps/docs/src/App.tsx", root), "utf8");
  const css = await readFile(new URL("apps/docs/src/styles.css", root), "utf8");
  assert.doesNotMatch(app + css, /desktop-sidebar|sidebar-sticky/u);
  assert.match(app, /<DocumentationNavigation route=\{route\}/u);
});
test("new browser regressions are discovered and performance tests remain separately runnable", async () => {
  const manifest = JSON.parse(
    await readFile(new URL("apps/docs/package.json", root), "utf8"),
  );
  const config = await readFile(
    new URL("apps/docs/playwright.config.ts", root),
    "utf8",
  );
  assert.equal(manifest.scripts["test:e2e"], "playwright test");
  assert.match(
    config,
    /FLUX_PERF_MODE === undefined \? "\*\*\/perf.spec.ts" : \[\]/u,
  );
});
test("Card default padding is CSS, not an implicit inline override of user classes", async () => {
  const source = await readFile(
    new URL("packages/react/src/components/Card/Card.tsx", root),
    "utf8",
  );
  const css = await readFile(
    new URL("packages/react/src/components/Card/Card.css.ts", root),
    "utf8",
  );
  assert.doesNotMatch(source, /padding = "md"/u);
  assert.match(css, /:where\(&\)/u);
  assert.match(css, /padding: "var\(--flux-space-4\)"/u);
});
test("no dev-only declarations are deliberately published", async () => {
  const config = JSON.parse(
    await readFile(new URL("packages/react/tsconfig.build.json", root), "utf8"),
  );
  for (const pattern of [
    "src/**/*.stories.tsx",
    "src/**/*.test.ts",
    "src/**/*.test.tsx",
    "src/**/*.bench.tsx",
    "src/test/**",
  ])
    assert.ok(config.exclude.includes(pattern), pattern);
  assert.equal(config.compilerOptions.declarationMap, true);
});
