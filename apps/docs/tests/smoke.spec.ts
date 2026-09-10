import { expect, test } from "@playwright/test";

test("renders the Flux health page, component categories, and overlay demos", async ({
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
    "Inline",
    "Grid",
    "Container",
  ]) {
    await expect(
      page.getByRole("heading", { name: componentName, exact: true }),
    ).toBeVisible();
  }

  await page.getByRole("tab", { name: "Forms" }).click();
  for (const componentName of ["Input", "Field", "Textarea"]) {
    await expect(
      page.getByRole("heading", { name: componentName, exact: true }),
    ).toBeVisible();
  }
  await expect(
    page.getByRole("textbox", { name: "Email address", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Work email", exact: true }),
  ).toHaveAttribute("required", "");
  await expect(
    page.getByRole("textbox", { name: "Project notes", exact: true }),
  ).toHaveAttribute("rows", "4");

  await page.getByRole("tab", { name: "Interaction" }).click();
  for (const componentName of ["Tabs", "Dialog", "Drawer"]) {
    await expect(
      page.getByRole("heading", { name: componentName, exact: true }),
    ).toBeVisible();
  }

  const overviewTab = page.getByRole("tab", { name: "Overview", exact: true });
  await overviewTab.focus();
  await page.keyboard.press("ArrowRight");
  const activityTab = page.getByRole("tab", { name: "Activity", exact: true });
  await expect(activityTab).toBeFocused();
  await expect(activityTab).toHaveAttribute("aria-selected", "true");

  const dialogTrigger = page.getByRole("button", { name: "Open dialog" });
  await dialogTrigger.click();
  const dialog = page.getByRole("dialog", { name: "Project settings" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(dialogTrigger).toBeFocused();

  await page.getByRole("button", { name: "Open drawer" }).click();
  await expect(
    page.getByRole("dialog", { name: "Project navigation" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close drawer" }).click();

  const themeButton = page.getByRole("button", { name: "Use dark theme" });
  await themeButton.click();
  await expect(page.locator("html")).toHaveAttribute("data-flux-theme", "dark");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-flux-theme", "dark");
  await expect(
    page.getByRole("button", { name: "Use light theme" }),
  ).toBeVisible();
});

test("uses the Flux Drawer for mobile documentation navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByRole("button", { name: "Browse sections" }).click();
  const navigationDrawer = page.getByRole("dialog", {
    name: "Flux UI documentation",
  });
  await expect(navigationDrawer).toBeVisible();

  await navigationDrawer.getByRole("link", { name: "Components" }).click();
  await expect(navigationDrawer).not.toBeVisible();
  await expect(page).toHaveURL(/#components$/);
});
