import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Combobox groups preserve flat keyboard navigation and selection", async ({
  page,
}) => {
  await page.goto("/#components/combobox");

  const preview = page.locator(".preview-content");
  const input = preview.getByRole("combobox", { name: "Assign to team" });

  await input.click();

  const listbox = page.getByRole("listbox", { name: "Available teams" });
  const product = listbox.getByRole("group", { name: "Product" });
  const engineering = listbox.getByRole("group", { name: "Engineering" });

  await expect(product.getByRole("option")).toHaveCount(2);
  await expect(engineering.getByRole("option")).toHaveCount(2);
  await expect(
    engineering.getByRole("option", { name: "Archived team" }),
  ).toHaveAttribute("aria-disabled", "true");

  await input.fill("eng");
  await expect(listbox.getByRole("group", { name: "Product" })).toHaveCount(0);
  await expect(
    listbox.getByRole("group", { name: "Engineering" }).getByRole("option"),
  ).toHaveCount(1);

  await input.press("ArrowDown");
  const engineeringOption = listbox.getByRole("option", {
    name: "Engineering",
  });
  await expect(engineeringOption).toHaveAttribute("aria-selected", "false");
  const engineeringId = await engineeringOption.getAttribute("id");
  expect(engineeringId).not.toBeNull();
  if (engineeringId === null) throw new Error("Missing combobox option ID.");
  await expect(input).toHaveAttribute("aria-activedescendant", engineeringId);
  await input.press("Enter");
  await expect(input).toHaveValue("Engineering");
  await expect(input).toHaveAttribute("aria-expanded", "false");

  expect(
    (await new AxeBuilder({ page }).include(".preview-content").analyze())
      .violations,
  ).toEqual([]);
});
