import { expect, test } from "@playwright/test";

test("the homepage offers design, engineering and verification paths", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "One system.",
  );
  for (const route of ["lab", "engineering", "trust", "accessibility"]) {
    await expect(
      page.locator(`main a[href="#${route}"]`).first(),
    ).toBeVisible();
  }
  await expect(page.locator("iframe")).toHaveCount(0);
});

test("the lab is opt-in and produces finite local paired results", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.goto("/#lab");
  await expect(
    page.getByRole("heading", { name: "Live Stress Lab" }),
  ).toBeVisible();
  await expect(page.locator(".lab-surface iframe")).toHaveCount(0);
  await page.getByLabel("Instances", { exact: true }).selectOption("100");
  await page.getByLabel("Paired samples", { exact: true }).selectOption("3");
  await page
    .getByRole("button", { name: "Start benchmark", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Export raw results", exact: true }),
  ).toBeVisible({ timeout: 45_000 });
  await expect(
    page.getByRole("region", { name: "Benchmark results", exact: true }),
  ).toContainText("button × 100");
  await expect(page.locator(".lab-surface iframe")).toHaveCount(0);
  const downloaded = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export raw results", exact: true })
    .click();
  expect((await downloaded).suggestedFilename()).toBe(
    "flux-ui-live-benchmark.json",
  );
});

test("stop removes the active frame and navigation abandons the run", async ({
  page,
}) => {
  await page.goto("/#lab");
  await page
    .getByRole("button", { name: "Start benchmark", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Stop benchmark", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Start benchmark", exact: true }),
  ).toBeEnabled();
  await expect(page.locator(".lab-surface iframe")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Export raw results", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Start benchmark", exact: true })
    .click();
  await page.evaluate(() => {
    window.location.hash = "engineering";
  });
  await expect(page.locator("main h1")).toContainText(
    "A system beneath the surface.",
  );
  await expect(page.locator("iframe")).toHaveCount(0);
});

test("trust never turns a missing report or malformed evidence green", async ({
  page,
}) => {
  await page.route("**/evidence/index.json", (route) =>
    route.fulfill({ status: 404, body: "missing" }),
  );
  await page.goto("/#trust");
  await expect(page.getByRole("status")).toContainText("No generated evidence");
  await expect(
    page.getByText("CI reported passed", { exact: true }),
  ).toHaveCount(0);
  await page.unroute("**/evidence/index.json");
  await page.route("**/evidence/index.json", (route) =>
    route.fulfill({ json: { schemaVersion: 1, status: "passed" } }),
  );
  await page.reload();
  await expect(page.getByRole("status")).toContainText("Invalid evidence");
  await expect(
    page.getByText("CI reported passed", { exact: true }),
  ).toHaveCount(0);
});

test("the live axe demo detects the intentional defect and its repair", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.goto("/#accessibility");
  await expect(page.getByRole("status")).toContainText("Not scanned");
  await page.getByRole("button", { name: "Run axe scan", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("0 violation rules", {
    timeout: 20_000,
  });
  const defect = page.getByRole("checkbox", {
    name: "Introduce an intentional missing button name",
  });
  await defect.check();
  await page.getByRole("button", { name: "Run axe scan", exact: true }).click();
  await expect(
    page.locator("main code").filter({ hasText: /^button-name$/ }),
  ).toBeVisible();
  await defect.uncheck();
  await page.getByRole("button", { name: "Run axe scan", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("0 violation rules");
});

for (const theme of ["light", "dark"] as const) {
  for (const route of [
    "overview",
    "lab",
    "engineering",
    "trust",
    "accessibility",
    "size",
    "performance",
  ]) {
    test(`${route} stays within a mobile viewport in ${theme}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.addInitScript((value) => {
        localStorage.setItem("flux-ui-theme", value);
      }, theme);
      await page.goto(`/#${route}`);
      await expect(page.locator("main h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
      ).toBe(true);
    });
  }
}
