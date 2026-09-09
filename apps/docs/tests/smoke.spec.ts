import { expect, test } from "@playwright/test";

test("renders the Flux health page and persists theme selection", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("flux-ui-theme", "light");
  });

  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Flux UI project health & documentation",
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("complementary", { name: "Site status" }),
  ).toContainText(/Under construction/i);

  const themeButton = page.getByRole("button", {
    name: "Use dark theme",
  });

  await themeButton.click();

  await expect(page.locator("html")).toHaveAttribute("data-flux-theme", "dark");

  await page.reload();

  await expect(page.locator("html")).toHaveAttribute("data-flux-theme", "dark");
});
