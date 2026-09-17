import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Overflow selects hidden tabs, preserves keyboard focus, resizes and stays accessible", async ({
  page,
}) => {
  await page.goto("/#components/overflow");
  const preview = page.locator(".preview-content");
  const list = preview.getByRole("tablist", {
    name: "Overflow project sections",
  });
  const trigger = preview.getByRole("combobox", { name: "More items" });
  await expect(trigger).toBeVisible();
  await trigger.focus();
  await expect(trigger.getByRole("option", { name: "Billing" })).toBeDisabled();
  await trigger.selectOption({ label: "History" });
  await expect(list.getByRole("tab", { name: "History" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(
    preview.getByRole("tabpanel", { name: "History" }),
  ).toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.press("Escape");
  await expect(trigger).toBeFocused();
  expect(
    (await new AxeBuilder({ page }).include(".preview-content").analyze())
      .violations,
  ).toEqual([]);
  await preview.getByRole("button", { name: "Toggle available width" }).click();
  await expect(list.getByRole("tab")).not.toHaveCount(2);
  await preview.getByRole("button", { name: "Toggle available width" }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(trigger).toBeVisible();
  await expect(list.getByRole("tab", { name: "History" })).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).include(".preview-content").analyze())
      .violations,
  ).toEqual([]);
});
