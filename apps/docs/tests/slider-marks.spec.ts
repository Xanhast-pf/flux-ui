import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Slider marks and value output preserve native range behavior", async ({
  page,
}) => {
  await page.goto("/#components/slider");

  const previews = page.locator(".preview-content");
  const preview = previews.first();
  const slider = preview.getByRole("slider", { name: "Preview volume" });
  const output = preview.locator("output");
  const datalist = preview.locator("datalist");

  await expect(datalist).toHaveCount(1);
  await expect(datalist.locator("option")).toHaveCount(5);
  await expect(datalist.locator("option[value='0']")).toHaveAttribute(
    "label",
    "Mute",
  );
  await expect(datalist.locator("option[value='100']")).toHaveAttribute(
    "label",
    "Max",
  );
  await expect(output).toHaveText("40%");
  await expect(output).toHaveAttribute("aria-hidden", "true");

  await slider.focus();
  await page.keyboard.press("ArrowRight");
  await expect(slider).toHaveValue("45");
  await expect(slider).toHaveAttribute("aria-valuetext", "45%");
  await expect(output).toHaveText("45%");

  await preview.getByRole("button", { name: "Reset volume" }).click();
  await expect(slider).toHaveValue("40");
  await expect(output).toHaveText("40%");

  const verticalSlider = previews
    .nth(1)
    .getByRole("slider", { name: "Vertical level" });
  await expect(verticalSlider).toHaveAttribute("aria-orientation", "vertical");
  await expect(verticalSlider).toHaveValue("65");

  expect(
    (await new AxeBuilder({ page }).include(".preview-frame").analyze())
      .violations,
  ).toEqual([]);
});
