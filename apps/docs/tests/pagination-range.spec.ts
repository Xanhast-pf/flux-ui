import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Pagination renders a bounded range and preserves native button focus", async ({
  page,
}) => {
  await page.goto("/#components/pagination");

  const preview = page.locator(".preview-content");
  const navigation = preview.getByRole("navigation", {
    name: "Example pagination",
  });
  const status = preview.getByRole("status");

  await expect(navigation.getByRole("button")).toHaveCount(9);
  await expect(
    navigation.getByRole("button", { name: "Page 6" }),
  ).toHaveAttribute("aria-current", "page");
  await expect(navigation.getByText("…")).toHaveCount(2);

  const current = navigation.getByRole("button", { name: "Page 6" });
  await current.focus();
  await page.keyboard.press("Tab");
  await expect(
    navigation.getByRole("button", { name: "Page 7" }),
  ).toBeFocused();

  await navigation.getByRole("button", { name: "Last" }).click();
  await expect(status).toHaveText("Example page 12 of 12.");
  await expect(
    navigation.getByRole("button", { name: "Page 12" }),
  ).toHaveAttribute("aria-current", "page");
  await expect(navigation.getByRole("button", { name: "Last" })).toBeDisabled();

  await navigation.getByRole("button", { name: "First" }).click();
  await expect(status).toHaveText("Example page 1 of 12.");
  await expect(
    navigation.getByRole("button", { name: "First" }),
  ).toBeDisabled();

  expect(
    (await new AxeBuilder({ page }).include(".preview-content").analyze())
      .violations,
  ).toEqual([]);
});
