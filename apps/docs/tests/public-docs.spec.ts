import { expect, test } from "@playwright/test";

for (const [route, title] of [
  ["components/sidebar", "Sidebar · Components · Flux UI"],
  ["install", "Getting started · Flux UI"],
  ["rules", "Engineering · Flux UI"],
  ["components/not-real", "Component not found · Flux UI"],
  ["not-real", "Page not found · Flux UI"],
] as const) {
  test(`route title describes ${route}`, async ({ page }) => {
    await page.goto(`/#${route}`);
    await expect(page).toHaveTitle(title);
    await expect(page.locator("main h1")).toBeVisible();
    if (route === "rules")
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Engineering",
      );
  });
}
test("getting-started consumer and contributor guidance preserves content and spacing", async ({
  page,
}) => {
  await page.goto("/#install");
  for (const name of [
    "Use Flux in your app",
    "Use a dashboard recipe",
    "Server rendering",
    "Contribute",
  ]) {
    const heading = page.getByRole("heading", { name, exact: true });
    await expect(heading).toBeVisible();
    const gap = await heading.evaluate((element) => {
      const next = element.nextElementSibling;
      if (next === null) throw new Error("Missing installation content.");
      return (
        next.getBoundingClientRect().top -
        element.getBoundingClientRect().bottom
      );
    });
    expect(gap).toBeGreaterThanOrEqual(15);
  }
  await expect(
    page.getByRole("region", { name: "Consumer candidate setup", exact: true }),
  ).toContainText("pnpm add ./vendor/varua-flux-ui.tgz");
  await expect(
    page.getByRole("region", {
      name: "Repository contributor setup",
      exact: true,
    }),
  ).toContainText("pnpm flux dev");
  await expect(
    page.getByRole("region", {
      name: "Component scaffolding and generation",
      exact: true,
    }),
  ).toContainText("pnpm flux component new");
});
