import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Textarea autosize grows, caps and resets with native form behavior", async ({
  page,
}) => {
  await page.goto("/#components/textarea");

  const preview = page.locator(".preview-content");
  const textarea = preview.getByRole("textbox", { name: "Project notes" });
  const reset = preview.getByRole("button", { name: "Reset notes" });

  await expect(textarea).toHaveAttribute("data-auto-size", "true");
  await expect(textarea).not.toHaveAttribute("rows");
  expect(
    await textarea.evaluate((element) =>
      getComputedStyle(element).getPropertyValue("field-sizing"),
    ),
  ).toBe("content");

  const initial = await textarea.boundingBox();
  expect(initial).not.toBeNull();

  await textarea.fill("one\ntwo\nthree\nfour\nfive");
  const grown = await textarea.boundingBox();
  expect(grown).not.toBeNull();
  expect(grown?.height ?? 0).toBeGreaterThan(initial?.height ?? 0);

  await textarea.fill(
    Array.from({ length: 12 }, (_, index) => `line ${index + 1}`).join("\n"),
  );
  const capped = await textarea.boundingBox();
  expect(capped).not.toBeNull();
  expect(capped?.height ?? 0).toBeGreaterThanOrEqual(grown?.height ?? 0);
  expect(
    await textarea.evaluate(
      (element) => element.scrollHeight > element.clientHeight,
    ),
  ).toBe(true);

  await reset.click();
  await expect(textarea).toHaveValue("");
  const resetSize = await textarea.boundingBox();
  expect(resetSize).not.toBeNull();
  expect(
    Math.abs((resetSize?.height ?? 0) - (initial?.height ?? 0)),
  ).toBeLessThan(1);

  await textarea.fill("x".repeat(500));
  const wrapped = await textarea.boundingBox();
  expect(wrapped).not.toBeNull();
  expect(wrapped?.height ?? 0).toBeGreaterThan(initial?.height ?? 0);

  expect(
    (await new AxeBuilder({ page }).include(".preview-content").analyze())
      .violations,
  ).toEqual([]);
});
