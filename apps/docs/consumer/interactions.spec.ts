import { expect, test } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});
test("built Field associates opaque and root-owned descriptions", async ({
  page,
}) => {
  await expect(
    page.getByRole("textbox", { name: "Wrapped field", exact: true }),
  ).toHaveAccessibleDescription("Wrapped helper is associated.");
  await expect(
    page.getByRole("textbox", { name: "Root slot field" }),
  ).toHaveAccessibleDescription("Root-owned server description.");
});
test("built Tabs recover selection without stealing an external action's focus", async ({
  page,
}) => {
  const remove = page.getByRole("button", {
    name: "Remove selected consumer tab",
  });
  await remove.click();
  await expect(remove).toBeFocused();
  await expect(
    page.getByRole("tab", { name: "Dynamic three" }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(
    page.getByRole("tab", { name: "Dynamic three" }),
  ).toHaveAttribute("tabindex", "0");
});
test("built popover and menu follow keyboard focus and preserve native actions", async ({
  page,
}) => {
  const trigger = page.getByRole("button", {
    name: "Consumer filters",
    exact: true,
  });
  await trigger.click();
  await expect(
    page.getByRole("textbox", { name: "Consumer filter text" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  const menu = page.getByRole("button", { name: "Consumer menu" });
  await menu.focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("menuitem", { name: "Export choice" }),
  ).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("menuitem", { name: "Rename choice" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Rename chosen", { exact: true })).toBeVisible();
  await expect(menu).toBeFocused();
});
test("built combobox, tooltip, alert and notification compose", async ({
  page,
}) => {
  const input = page.getByRole("combobox", { name: "Consumer assignee" });
  await input.fill("sam");
  await page.keyboard.press("Enter");
  await expect(input).toHaveValue("Sam Rivera");
  await expect(input).toHaveAttribute("aria-expanded", "false");
  const help = page.getByRole("button", { name: "Consumer help", exact: true });
  await help.focus();
  await expect(page.getByRole("tooltip")).toHaveText(
    "Accessible consumer help",
  );
  await page.keyboard.press("Escape");
  await expect(help).toBeFocused();
  const destructive = page.getByRole("button", {
    name: "Consumer destructive action",
  });
  await destructive.click();
  await expect(
    page.getByRole("alertdialog", { name: "Remove the local draft?" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Keep local draft" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(destructive).toBeFocused();
  await page.getByRole("button", { name: "Notify consumer save" }).click();
  await expect(page.getByText("Consumer saved", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Dismiss notification" }).click();
  await expect(page.getByText("Consumer saved", { exact: true })).toHaveCount(
    0,
  );
});
