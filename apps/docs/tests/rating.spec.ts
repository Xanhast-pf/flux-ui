import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Rating keeps native radio keyboard and form behavior", async ({
  page,
}) => {
  await page.goto("/#components/rating");

  const preview = page.locator(".preview-content");
  const form = preview.getByRole("form", { name: "Rating example" });
  const group = form.getByRole("group", { name: "Product quality" });
  const four = group.getByRole("radio", { name: "4 of 5 stars" });
  const five = group.getByRole("radio", { name: "5 of 5 stars" });

  await expect(four).toBeChecked();

  const stars = group.locator("label > span");
  const filledColor = await stars
    .nth(0)
    .evaluate((element) => getComputedStyle(element).color);
  await expect(stars.nth(3)).toHaveCSS("color", filledColor);
  await expect(stars.nth(4)).not.toHaveCSS("color", filledColor);

  await four.focus();
  await page.keyboard.press("ArrowRight");
  await expect(five).toBeFocused();
  await expect(five).toBeChecked();
  await expect(stars.nth(4)).toHaveCSS("color", filledColor);
  await expect(form.getByRole("status")).toHaveText("5 of 5 stars");

  const submitted = await form.evaluate((element) => {
    if (!(element instanceof HTMLFormElement)) {
      throw new Error("Expected a form.");
    }
    return [...new FormData(element).entries()];
  });
  expect(submitted).toEqual([["quality", "5"]]);

  await page.keyboard.press("ArrowLeft");
  await expect(four).toBeFocused();
  await expect(four).toBeChecked();

  expect(
    (await new AxeBuilder({ page }).include(".preview-content").analyze())
      .violations,
  ).toEqual([]);
});
