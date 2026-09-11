import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { moods } from "../src/showcase/model.js";
import { sceneIds } from "./showcase-fixtures.js";
for (const scene of sceneIds) {
  for (const mood of moods) {
    test(`${scene} is axe-clean in ${mood.label}`, async ({ page }) => {
      await page.goto(`/#playground?scene=${scene}&mood=${mood.id}`);
      await expect(
        page.locator(`.product-scene[data-scene="${scene}"]`),
      ).toBeVisible();
      const results = await new AxeBuilder({ page }).analyze();
      expect(
        results.violations,
        results.violations
          .map((violation) => `${violation.id}: ${violation.help}`)
          .join("\n"),
      ).toEqual([]);
    });
  }
}
test("forced colors preserve scene selection and keyboard-operable controls", async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page.goto("/#playground?scene=music&mood=terminal");
  const mute = page.getByRole("button", {
    name: "Mute Drum machine",
    exact: true,
  });
  await expect(mute).toBeVisible();
  await mute.press("Space");
  await expect(mute).toHaveAttribute("aria-pressed", "true");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
