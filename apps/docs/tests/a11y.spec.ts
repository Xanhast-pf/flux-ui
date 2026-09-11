import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { components } from "../src/generated/components.js";
async function expectNoViolations(
  page: Page,
  include?: string,
  tags?: string[],
) {
  // Wait for lazy preview content; auditing a Suspense fallback misses the control.
  await expect(page.locator("main h1")).toBeVisible();
  if (page.url().includes("#components/")) {
    await expect(page.locator(".preview-content")).toBeVisible();
  }
  const builder = new AxeBuilder({ page });
  if (include !== undefined) {
    const surface = page.locator(include).first();
    await expect(surface).toBeVisible();
    await surface.evaluate(async (element) => {
      await Promise.all(
        element.getAnimations().map(async (animation) => {
          await animation.finished;
        }),
      );
    });
    builder.include(include);
  }
  if (tags !== undefined) builder.withTags(tags);
  const results = await builder.analyze();
  expect(
    results.violations,
    results.violations
      .map((violation) => `${violation.id}: ${violation.help}`)
      .join("\n"),
  ).toEqual([]);
}
for (const theme of ["light", "dark"] as const) {
  for (const route of [
    "overview",
    "components",
    "icons",
    "identity",
    "playground",
    "tokens",
    "health",
    "size",
    "performance",
    "rules",
    "install",
    "documentation",
  ]) {
    test(`${route} is accessible in ${theme}`, async ({ page }) => {
      await page.addInitScript((value) => {
        window.localStorage.setItem("flux-ui-theme", value);
      }, theme);
      await page.goto(`/#${route}`);
      await expectNoViolations(page);
    });
  }
  for (const component of components) {
    test(`${component.name} preview is accessible in ${theme}`, async ({
      page,
    }) => {
      await page.addInitScript((value) => {
        window.localStorage.setItem("flux-ui-theme", value);
      }, theme);
      await page.goto(`/#components/${component.slug}`);
      await expectNoViolations(page);
    });
  }
}

const modalWcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test("overlays are accessible while open", async ({ page }) => {
  await page.goto("/#components/dialog");
  await page.getByRole("button", { name: "Open dialog", exact: true }).click();
  await expectNoViolations(page, "dialog[open]", modalWcagTags);
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  await page.goto("/#components/drawer");
  await page.getByRole("button", { name: "Open drawer", exact: true }).click();
  await expectNoViolations(page, "dialog[open]", modalWcagTags);
  await page.getByRole("button", { name: "Close drawer", exact: true }).click();
  await page.getByRole("button", { name: /Search docs/ }).click();
  await expectNoViolations(page, "dialog[open]", modalWcagTags);
});
for (const theme of ["light", "dark"] as const) {
  for (const accent of ["teal", "rose"] as const) {
    test(`${accent} workshop preset stays accessible in ${theme}`, async ({
      page,
    }) => {
      await page.addInitScript(
        (value) => {
          window.localStorage.setItem("flux-ui-theme", value.theme);
          window.localStorage.setItem("flux-ui-docs-accent", value.accent);
        },
        { theme, accent },
      );
      await page.goto("/");
      await expectNoViolations(page);
    });
  }
}

for (const theme of ["light", "dark"] as const) {
  test(`collection interactions and loading stay accessible in ${theme}`, async ({
    page,
  }) => {
    await page.addInitScript((value) => {
      window.localStorage.setItem("flux-ui-theme", value);
    }, theme);
    await page.goto("/#playground");
    await page
      .getByRole("tab", { name: "Collection lab", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Collection lab", exact: true }),
    ).toBeVisible();
    await expectNoViolations(page);
    await page.getByRole("button", { name: "Saved only", exact: true }).click();
    await expectNoViolations(page);
    await page
      .getByRole("button", { name: "Preview loading", exact: true })
      .click();
    await expectNoViolations(page);
  });
}
