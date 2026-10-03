import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("BottomNavigation preserves navigation semantics and native link behavior", async ({
  page,
}) => {
  await page.goto("/#components/bottom-navigation");

  const preview = page.locator(".preview-content");
  const navigation = preview.getByRole("navigation", {
    name: "Primary destinations",
  });
  const home = navigation.getByRole("link", { name: "Home" });
  const search = navigation.getByRole("link", { name: "Search" });
  const profile = navigation.getByRole("link", { name: "Profile" });

  await expect(navigation.getByRole("link")).toHaveCount(3);
  await expect(home).toHaveAttribute("aria-current", "page");
  await expect(search).not.toHaveAttribute("aria-current");
  await expect(profile).not.toHaveAttribute("aria-current");

  expect(
    (await new AxeBuilder({ page }).include(".preview-content").analyze())
      .violations,
  ).toEqual([]);

  await home.focus();
  await page.keyboard.press("Tab");
  await expect(search).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(
    /#components\/bottom-navigation\?destination=search$/u,
  );
});
