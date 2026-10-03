import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Breadcrumbs disclosure bounds long trails and preserves focus", async ({
  page,
}) => {
  await page.goto("/#components/breadcrumbs");

  const preview = page.locator(".preview-content");
  const navigation = preview.getByRole("navigation", {
    name: "Example breadcrumb",
  });
  const list = navigation.getByRole("list");

  await expect(list.getByRole("listitem")).toHaveCount(4);
  await expect(navigation.getByRole("link", { name: "Guides" })).toHaveCount(0);

  const toggle = navigation.getByRole("button", {
    name: "Show full breadcrumb path",
  });
  await toggle.focus();
  await toggle.click();

  const expandedToggle = navigation.getByRole("button", {
    name: "Collapse breadcrumb path",
  });
  await expect(expandedToggle).toBeFocused();
  await expect(expandedToggle).toHaveAttribute("aria-expanded", "true");
  await expect(list.getByRole("listitem")).toHaveCount(7);
  await expect(
    navigation.getByRole("link", { name: "Guides" }),
  ).toHaveAttribute("href", "#components/stack");
  await expect(navigation.getByText("Breadcrumbs")).toHaveAttribute(
    "aria-current",
    "page",
  );

  await page.keyboard.press("Tab");
  await expect(navigation.getByRole("link", { name: "Guides" })).toBeFocused();

  await expandedToggle.focus();
  await expandedToggle.click();
  const collapsedToggle = navigation.getByRole("button", {
    name: "Show full breadcrumb path",
  });
  await expect(collapsedToggle).toBeFocused();
  await expect(collapsedToggle).toHaveAttribute("aria-expanded", "false");
  await expect(list.getByRole("listitem")).toHaveCount(4);

  expect(
    (await new AxeBuilder({ page }).include(".preview-content").analyze())
      .violations,
  ).toEqual([]);
});
