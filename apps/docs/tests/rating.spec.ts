import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Rating renders empty, half and full states with native half-step radios", async ({
  page,
}) => {
  await page.goto("/#components/rating");

  const preview = page.locator(".preview-content");
  const form = preview.getByRole("form", { name: "Rating example" });
  const group = form.getByRole("group", { name: "Product quality" });
  const threeHalf = group.getByRole("radio", { name: "3.5 of 5 stars" });
  const four = group.getByRole("radio", { name: "4 of 5 stars" });
  const fourHalf = group.getByRole("radio", { name: "4.5 of 5 stars" });

  await expect(threeHalf).toBeChecked();

  const options = group.locator("label");
  const stars = group.locator(":scope > span");
  await expect(options).toHaveCount(10);
  await expect(stars).toHaveCount(5);

  const fourthHalf = stars.nth(3).locator("svg[data-fill='half']");
  const fourthFull = stars.nth(3).locator("svg[data-fill='full']");
  const fifthHalf = stars.nth(4).locator("svg[data-fill='half']");
  const fifthFull = stars.nth(4).locator("svg[data-fill='full']");

  await expect(fourthHalf).toHaveCSS("opacity", "1");
  await expect(fourthFull).toHaveCSS("opacity", "0");
  await expect(fifthHalf).toHaveCSS("opacity", "0");
  await expect(fifthFull).toHaveCSS("opacity", "0");

  const fourthTargets = stars.nth(3).locator("label");
  const startBox = await fourthTargets.nth(0).boundingBox();
  const endBox = await fourthTargets.nth(1).boundingBox();
  expect(startBox?.width).toBeCloseTo(endBox?.width ?? 0, 1);
  expect(endBox?.x).toBeCloseTo((startBox?.x ?? 0) + (startBox?.width ?? 0), 1);

  await threeHalf.focus();
  await page.keyboard.press("ArrowRight");
  await expect(four).toBeFocused();
  await expect(four).toBeChecked();

  await expect(fourthHalf).toHaveCSS("opacity", "0");
  await expect(fourthFull).toHaveCSS("opacity", "1");

  await page.keyboard.press("ArrowRight");
  await expect(fourHalf).toBeFocused();
  await expect(fourHalf).toBeChecked();
  await expect(form.getByRole("status")).toHaveText("4.5 of 5 stars");

  await expect(fifthHalf).toHaveCSS("opacity", "1");
  await expect(fifthFull).toHaveCSS("opacity", "0");

  const submitted = await form.evaluate((element) => {
    if (!(element instanceof HTMLFormElement)) {
      throw new Error("Expected a form.");
    }
    return [...new FormData(element).entries()];
  });
  expect(submitted).toEqual([["quality", "4.5"]]);

  await page.keyboard.press("ArrowLeft");
  await expect(four).toBeFocused();
  await expect(four).toBeChecked();

  expect(
    (await new AxeBuilder({ page }).include(".preview-content").analyze())
      .violations,
  ).toEqual([]);
});

test("Rating supports press-and-drag scrubbing in both directions", async ({
  page,
}) => {
  await page.goto("/#components/rating");

  const preview = page.locator(".preview-content");
  const form = preview.getByRole("form", { name: "Rating example" });
  const group = form.getByRole("group", { name: "Product quality" });
  const options = group.locator("label");

  const start = await options.nth(4).boundingBox();
  const lower = await options.nth(2).boundingBox();
  const higher = await options.nth(8).boundingBox();

  expect(start).not.toBeNull();
  expect(lower).not.toBeNull();
  expect(higher).not.toBeNull();

  await page.mouse.move(
    (start?.x ?? 0) + (start?.width ?? 0) / 2,
    (start?.y ?? 0) + (start?.height ?? 0) / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    (start?.x ?? 0) + (start?.width ?? 0) / 2 + 1,
    (start?.y ?? 0) + (start?.height ?? 0) / 2,
  );

  await expect(
    group.getByRole("radio", { name: "2.5 of 5 stars" }),
  ).toBeChecked();

  await page.mouse.move(
    (lower?.x ?? 0) + (lower?.width ?? 0) / 2,
    (lower?.y ?? 0) + (lower?.height ?? 0) / 2,
  );
  await expect(
    group.getByRole("radio", { name: "1.5 of 5 stars" }),
  ).toBeChecked();
  await expect(form.getByRole("status")).toHaveText("1.5 of 5 stars");

  await page.mouse.move(
    (higher?.x ?? 0) + (higher?.width ?? 0) / 2,
    (higher?.y ?? 0) + (higher?.height ?? 0) / 2,
  );
  await expect(
    group.getByRole("radio", { name: "4.5 of 5 stars" }),
  ).toBeChecked();
  await expect(form.getByRole("status")).toHaveText("4.5 of 5 stars");

  await page.mouse.up();

  await expect(
    group.getByRole("radio", { name: "4.5 of 5 stars" }),
  ).toBeChecked();
});
