import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("TreeView follows the core tree keyboard and expansion model", async ({
  page,
}) => {
  await page.goto("/#components/tree-view");

  const preview = page.locator(".preview-content");
  const tree = preview.getByRole("tree", { name: "Project files" });
  const src = tree.getByRole("treeitem", { name: "src" });
  const components = tree.getByRole("treeitem", { name: "components" });

  await expect(src).toHaveAttribute("aria-expanded", "true");
  await expect(components).toHaveAttribute("aria-expanded", "false");

  await src.focus();
  await page.keyboard.press("ArrowRight");
  await expect(components).toBeFocused();

  await page.keyboard.press("ArrowRight");
  await expect(components).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("ArrowRight");
  const button = tree.getByRole("treeitem", { name: "Button.tsx" });
  await expect(button).toBeFocused();

  await page.keyboard.press("ArrowDown");
  await expect(tree.getByRole("treeitem", { name: "Input.tsx" })).toBeFocused();

  await page.keyboard.press("ArrowLeft");
  await expect(components).toBeFocused();

  await page.keyboard.press("ArrowLeft");
  await expect(components).toHaveAttribute("aria-expanded", "false");

  await page.keyboard.press("End");
  await expect(tree.getByRole("treeitem", { name: "README.md" })).toBeFocused();

  await page.keyboard.press("Home");
  await expect(src).toBeFocused();

  await page.keyboard.press("ArrowLeft");
  await expect(src).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Enter");
  await expect(src).toHaveAttribute("aria-expanded", "true");

  expect(
    (await new AxeBuilder({ page }).include(".preview-content").analyze())
      .violations,
  ).toEqual([]);
});
