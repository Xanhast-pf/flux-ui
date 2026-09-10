import { expect, test } from "@playwright/test";

test("renders the Flux health page and persists theme selection", async ({
  page,
}) => {
  await page.goto("/");

  await page.evaluate(() => {
    window.localStorage.setItem("flux-ui-theme", "light");
  });

  await page.reload();

  await expect(
    page.getByRole("heading", {
      name: "Flux UI project health & documentation",
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("complementary", { name: "Site status" }),
  ).toContainText(/Under construction/i);

  for (const componentName of [
    "Button",
    "Stack",
    "Textarea",
    "Inline",
    "Input",
    "Field",
    "Grid",
    "Container",
  ]) {
    await expect(
      page.getByRole("heading", { name: componentName, exact: true }),
    ).toBeVisible();
  }

  await expect(
    page.getByRole("button", { name: "Primary action" }),
  ).toBeVisible();

  await expect(
    page.getByRole("textbox", { name: "Email address", exact: true }),
  ).toBeVisible();

  await expect(
    page.getByRole("textbox", { name: "Work email", exact: true }),
  ).toHaveAttribute("required", "");

  await expect(
    page.getByRole("textbox", { name: "Project notes", exact: true }),
  ).toHaveAttribute("rows", "4");

  const themeButton = page.getByRole("button", {
    name: "Use dark theme",
  });

  await themeButton.click();

  await expect(page.locator("html")).toHaveAttribute("data-flux-theme", "dark");

  await page.reload();

  await expect(page.locator("html")).toHaveAttribute("data-flux-theme", "dark");

  await expect(
    page.getByRole("button", {
      name: "Use light theme",
    }),
  ).toBeVisible();
});
