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
