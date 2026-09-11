import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { responsiveStyle } from "../../packages/react/src/internal/responsive.css.ts";
import { cssVars } from "../../packages/tokens/src/index.ts";
const presets = await readFile(
  new URL("../../packages/tokens/src/presets.css", import.meta.url),
  "utf8",
);
const theme = await readFile(
  new URL("../../packages/tokens/src/theme.css", import.meta.url),
  "utf8",
);
const colors = Object.values(cssVars.color);
test("all optional palettes declare the complete semantic color contract", () => {
  for (const name of ["paper", "studio", "bloom", "terminal"]) {
    const block = new RegExp(
      `\\[data-flux-theme="${name}"\\]\\s*\\{([^}]+)\\}`,
      "u",
    ).exec(presets)?.[1];
    assert.ok(block, name);
    for (const variable of colors)
      assert.match(
        block,
        new RegExp(`${variable}:\\s*#[\\da-f]{6}\\s*;`, "iu"),
        `${name}: ${variable}`,
      );
    assert.match(block, /--flux-font-body:/u);
  }
});
test("forced-color mapping is centralized and wins over docs accent selectors", () => {
  const forced = theme.slice(theme.indexOf("@media (forced-colors: active)"));
  assert.match(
    forced,
    /\[data-flux-theme\]\[data-flux-theme\]\[data-flux-theme\]/u,
  );
  for (const variable of colors)
    assert.ok(forced.includes(`${variable}:`), variable);
});
test("container layout has an explicit viewport opt-out and static instance resets", () => {
  const result = responsiveStyle({
    gap: "var(--f-s-g-b, 0)",
    "@media": {
      "(min-width: 48rem)": {
        gap: "var(--f-s-g-m, 0)",
      },
    },
  });
  assert.deepEqual(result.vars, {
    "--f-s-g-b": "initial",
    "--f-s-g-m": "var(--f-s-g-b)",
  });
  assert.deepEqual(
    result["@media"]["(min-width: 48rem)"].selectors[
      "&:not([data-r='container'])"
    ],
    { gap: "var(--f-s-g-m, 0)" },
  );
  assert.deepEqual(
    result["@container"]["flux-layout (min-width: 48rem)"].selectors[
      "&[data-r='container']"
    ],
    { gap: "var(--f-s-g-m, 0)" },
  );
});
test("static layout keeps explicit custom-variable defaults and no runtime observer", () => {
  const result = responsiveStyle({
    gap: "var(--f-g-g-b, 0)",
    vars: { "--f-g-g-b": "1rem" },
  });
  assert.equal(result.vars["--f-g-g-b"], "1rem");
  assert.equal(result["@container"], undefined);
});
