import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function expectNoViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
}

test("docs landing page has no detectable accessibility violations", async ({
  page,
}) => {
  await page.goto("/");
  await expectNoViolations(page);
});

test("interactive component demos remain accessible when opened", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Interaction" }).click();

  await page.getByRole("button", { name: "Open dialog" }).click();
  await expectNoViolations(page);
  await page.getByRole("button", { name: "Close dialog" }).click();

  await page.getByRole("button", { name: "Open drawer" }).click();
  await expectNoViolations(page);
});

for (const theme of ["light", "dark"] as const) {
  test(`form demos remain accessible in ${theme} theme`, async ({ page }) => {
    await page.goto("/");
    await page.evaluate((value) => {
      window.localStorage.setItem("flux-ui-theme", value);
    }, theme);
    await page.reload();
    await page.getByRole("tab", { name: "Forms", exact: true }).click();
    await expectNoViolations(page);
    await page
      .getByRole("checkbox", { name: "All channels", exact: true })
      .click();
    await page
      .getByRole("checkbox", { name: "Accept the project terms", exact: true })
      .check();
    await expectNoViolations(page);
  });
}
