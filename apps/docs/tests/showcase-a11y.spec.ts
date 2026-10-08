import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { sceneIds } from "./showcase-fixtures.js";

const primaryPalettes = ["indigo", "teal", "amber", "rose"] as const;

for (const theme of ["light", "dark"] as const) {
  test(`front-page app grid is axe-clean in ${theme}`, async ({ page }) => {
    await page.addInitScript((savedTheme) => {
      localStorage.setItem("flux-ui-theme", savedTheme);
      localStorage.setItem("flux-ui-docs-palette", "indigo");
      localStorage.setItem("flux-ui-docs-secondary-palette", "lime");
    }, theme);

    await page.goto("/#overview");
    await expect(page.locator("[data-overview-showcase]")).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations,
      results.violations
        .map((violation) => `${violation.id}: ${violation.help}`)
        .join("\n"),
    ).toEqual([]);
  });
}

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

test("theme configurator and custom light/dark editor are axe-clean", async ({
  page,
}) => {
  await page.goto("/#overview");
  await page.getByText(/Advanced token routing/u).click();

  const accent = page.locator('[data-theme-token="accent"]');
  await accent.getByRole("radio", { name: "Custom", exact: true }).check();
  await accent
    .getByRole("button", { name: "Edit light & dark", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Custom Accent colors" }),
  ).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations,
    results.violations
      .map((violation) => `${violation.id}: ${violation.help}`)
      .join("\n"),
  ).toEqual([]);
});

test("forced colors preserve dashboard selection and keyboard-operable controls", async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page.goto("/#playground?scene=deploy-control");
  const canary = page.getByRole("button", {
    name: "Canary enabled",
    exact: true,
  });
  await expect(canary).toBeVisible();
  await canary.press("Space");
  await expect(
    page.getByRole("button", { name: "Canary disabled", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");

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

  const results = await new AxeBuilder({ page })
    .disableRules(["color-contrast"])
    .analyze();
  expect(results.violations).toEqual([]);
});
