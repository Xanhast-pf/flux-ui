import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { sceneIds } from "./showcase-fixtures.js";

const primaryPalettes = ["indigo", "teal", "amber", "rose"] as const;

for (const outer of ["light", "dark"] as const) {
  for (const scene of sceneIds) {
    for (const primary of primaryPalettes) {
      test(`${scene} is axe-clean with recommended ${primary} pairing inside ${outer}`, async ({
        page,
      }) => {
        await page.addInitScript(
          ({ theme, palette }) => {
            localStorage.setItem("flux-ui-theme", theme);
            localStorage.setItem("flux-ui-docs-palette", palette);
            localStorage.removeItem("flux-ui-docs-secondary-palette");
          },
          { theme: outer, palette: primary },
        );

        await page.goto(`/#playground?scene=${scene}`);
        await expect(page.locator(`[data-scene="${scene}"]`)).toBeVisible();

        const surface = page.locator(".world-surface");
        await expect(surface).toHaveAttribute("data-flux-theme", outer);
        await expect(surface).toHaveAttribute("data-flux-palette", primary);
        await expect(surface).toHaveAttribute(
          "data-flux-secondary-palette",
          /.+/u,
        );

        const results = await new AxeBuilder({ page }).analyze();
        expect(
          results.violations,
          results.violations
            .map((violation) => `${violation.id}: ${violation.help}`)
            .join("\n"),
        ).toEqual([]);
      });
    }
  }
}

test("forced colors preserve scene selection and keyboard-operable controls", async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page.goto("/#playground?scene=music");
  const mute = page.getByRole("button", {
    name: "Mute Drum machine",
    exact: true,
  });
  await expect(mute).toBeVisible();
  await mute.press("Space");
  await expect(mute).toHaveAttribute("aria-pressed", "true");
  expect(
    await page.locator("html").evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        accent: style.getPropertyValue("--flux-color-accent").trim(),
        accentForeground: style
          .getPropertyValue("--flux-color-accent-foreground")
          .trim(),
        canvas: style.getPropertyValue("--flux-color-canvas").trim(),
        text: style.getPropertyValue("--flux-color-text").trim(),
      };
    }),
  ).toEqual({
    accent: "Highlight",
    accentForeground: "HighlightText",
    canvas: "Canvas",
    text: "CanvasText",
  });
  // In forced-colors mode the OS owns contrast through system colors. Headless
  // WebKit's synthetic Highlight palette is not a meaningful author-color audit.
  const results = await new AxeBuilder({ page })
    .disableRules(["color-contrast"])
    .analyze();
  expect(results.violations).toEqual([]);
});
