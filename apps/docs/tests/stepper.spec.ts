import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Stepper preserves ordered progress semantics and native navigation", async ({
  page,
}) => {
  await page.goto("/#components/stepper");

  const preview = page.locator(".preview-content");
  const stepper = preview.getByRole("list", { name: "Checkout progress" });
  const items = stepper.getByRole("listitem");

  await expect(items).toHaveCount(4);
  await expect(items.nth(0)).toHaveAttribute("data-status", "complete");
  await expect(items.nth(1)).toHaveAttribute("aria-current", "step");
  await expect(items.nth(2)).toHaveAttribute("data-status", "pending");

  expect(
    (await new AxeBuilder({ page }).include(".preview-content").analyze())
      .violations,
  ).toEqual([]);

  const account = stepper.getByRole("link", { name: "Account" });
  await account.focus();
  await expect(account).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#components\/stepper\?step=account$/u);
});

test("Stepper keeps horizontal connectors clear of labels", async ({
  page,
}) => {
  await page.goto("/#components/stepper");

  const stepper = page
    .locator(".preview-content")
    .getByRole("list", { name: "Checkout progress" });
  const firstItem = stepper.getByRole("listitem").first();

  const geometry = await firstItem.evaluate((item) => {
    const content = item.querySelector(":scope > div");
    if (!(content instanceof HTMLElement))
      throw new Error("Missing Stepper item content.");

    const itemBox = item.getBoundingClientRect();
    const contentBox = content.getBoundingClientRect();
    const connector = getComputedStyle(item, "::after");
    const connectorStart =
      itemBox.right -
      Number.parseFloat(connector.right) -
      Number.parseFloat(connector.width);

    return {
      connectorStart,
      contentEnd: contentBox.right,
    };
  });

  expect(geometry.connectorStart).toBeGreaterThanOrEqual(
    geometry.contentEnd - 1,
  );
});

test("Stepper keeps horizontal sequence scrollable at narrow widths", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/#components/stepper");

  const stepper = page
    .locator(".preview-content")
    .getByRole("list", { name: "Checkout progress" });

  const dimensions = await stepper.evaluate((element) => {
    element.style.inlineSize = "12rem";
    element.style.maxInlineSize = "12rem";
    return {
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    };
  });

  expect(dimensions.scrollWidth).toBeGreaterThan(dimensions.clientWidth);

  const first = await stepper.getByRole("listitem").nth(0).boundingBox();
  const last = await stepper.getByRole("listitem").nth(3).boundingBox();

  expect(first).not.toBeNull();
  expect(last).not.toBeNull();
  expect(Math.abs((last?.y ?? 0) - (first?.y ?? 0))).toBeLessThan(1);
});
