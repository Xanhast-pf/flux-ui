import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Tooltip arrow follows the collision-resolved side", async ({ page }) => {
  await page.goto("/#components/tooltip");

  const preview = page.locator(".preview-content");
  const trigger = preview.getByRole("button", { name: "Save draft" });

  await trigger.evaluate((element) => {
    Object.assign((element as HTMLElement).style, {
      position: "fixed",
      insetBlockStart: "0px",
      insetInlineStart: "50%",
      zIndex: "2",
    });
  });

  await trigger.focus();

  const tooltip = page.getByRole("tooltip");
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveAttribute("data-arrow", "true");

  const side = await tooltip.getAttribute("data-side");
  expect(["top", "right", "bottom", "left"]).toContain(side);

  const arrow = tooltip.locator(":scope > span[aria-hidden='true']");
  await expect(arrow).toHaveCount(1);

  const [tooltipBox, arrowBox] = await Promise.all([
    tooltip.boundingBox(),
    arrow.boundingBox(),
  ]);
  expect(tooltipBox).not.toBeNull();
  expect(arrowBox).not.toBeNull();

  if (tooltipBox !== null && arrowBox !== null) {
    const arrowCenterX = arrowBox.x + arrowBox.width / 2;
    const arrowCenterY = arrowBox.y + arrowBox.height / 2;
    if (side === "top")
      expect(arrowCenterY).toBeGreaterThan(
        tooltipBox.y + tooltipBox.height - 1,
      );
    if (side === "bottom") expect(arrowCenterY).toBeLessThan(tooltipBox.y + 1);
    if (side === "left")
      expect(arrowCenterX).toBeGreaterThan(tooltipBox.x + tooltipBox.width - 1);
    if (side === "right") expect(arrowCenterX).toBeLessThan(tooltipBox.x + 1);
  }

  expect(
    (await new AxeBuilder({ page }).include(".preview-content").analyze())
      .violations,
  ).toEqual([]);
});
