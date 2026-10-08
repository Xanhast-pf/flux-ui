import { expect, test, type Locator } from "@playwright/test";
async function bounds(locator: Locator) {
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  if (box === null) throw new Error("Expected visible layout geometry.");
  return box;
}
async function expectSeparateLines(first: Locator, second: Locator) {
  const a = await bounds(first);
  const b = await bounds(second);
  expect(b.y).toBeGreaterThanOrEqual(a.y + a.height - 1);
}
for (const width of [320, 390, 768, 1440]) {
  test(`single app bar places an icon-only menu before the brand at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#playground");
    const header = page.getByRole("banner");
    const trigger = header.getByRole("button", {
      name: "Toggle navigation",
      exact: true,
    });
    const brand = header.getByRole("link", { name: "Flux UI home" });
    await expect(trigger).toHaveCount(1);
    await expect(trigger).toHaveText("");
    await expect(page.locator(".mobile-header-row")).toHaveCount(0);
    const menuBox = await bounds(trigger);
    const brandBox = await bounds(brand);
    expect(menuBox.x + menuBox.width).toBeLessThanOrEqual(brandBox.x + 1);
    expect(
      Math.abs(
        menuBox.y + menuBox.height / 2 - brandBox.y - brandBox.height / 2,
      ),
    ).toBeLessThan(1);
    const searchBox = await bounds(
      header.getByRole("button", { name: "Search docs", exact: true }),
    );
    expect(searchBox.x + searchBox.width).toBeLessThanOrEqual(width + 1);
    await expect
      .poll(() =>
        brand
          .locator("img")
          .evaluate(
            (image: HTMLImageElement) =>
              image.complete && image.naturalWidth > 0,
          ),
      )
      .toBe(true);
    await trigger.click();
    const drawer =
      width < 768
        ? page.getByRole("dialog", { name: "Documentation", exact: true })
        : page.getByRole("complementary", { name: "Documentation sidebar" });
    for (const group of ["Build", "Design", "Inspect"]) {
      await expect(drawer.getByText(group, { exact: true })).toBeVisible();
    }
    await page.keyboard.press("Escape");
    if (width < 768) {
      await expect(drawer).not.toBeVisible();
      await expect(trigger).toBeFocused();
      await trigger.click();
    }
    await expect(drawer).toBeVisible();
    await drawer.getByRole("button", { name: "Close navigation" }).click();
    await expect(trigger).toBeFocused();
  });
}
test("brand SVG assets are vectors and the favicon resolves", async ({
  page,
}) => {
  await page.goto("/");
  for (const file of [
    "flux-mark.svg",
    "flux-app-icon.svg",
    "flux-mark-mono.svg",
  ]) {
    const response = await page.request.get(new URL(file, page.url()).href);
    expect(response.ok()).toBe(true);
    const svg = await response.text();
    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(svg.match(/<path /gu)).toHaveLength(3);
    const forbidden = ["<image", "<script", "<foreignObject", "data:image"];
    for (const marker of forbidden) expect(svg).not.toContain(marker);
  }
  const favicon = await page.locator('link[rel="icon"]').getAttribute("href");
  if (!favicon) throw new Error("Missing favicon.");
  expect((await page.request.get(new URL(favicon, page.url()).href)).ok()).toBe(
    true,
  );
});
test("Revenue keeps executive context on distinct lines", async ({ page }) => {
  await page.goto("/#playground?scene=revenue-command");
  const dashboard = page.locator('[data-scene="revenue-command"]');
  await expectSeparateLines(
    dashboard.getByRole("heading", { name: "Revenue overview" }),
    dashboard.getByText("Fictional data · updated moments ago", {
      exact: true,
    }),
  );
});

test("Product Pulse keeps research context readable inside dense cards", async ({
  page,
}) => {
  await page.goto("/#playground?scene=product-pulse");
  await page.getByRole("tab", { name: "Experiments" }).click();
  const dashboard = page.locator('[data-scene="product-pulse"]');
  await expectSeparateLines(
    dashboard.getByRole("heading", { name: "Research confidence" }),
    dashboard.getByText("4 of 5 from the local research review.", {
      exact: true,
    }),
  );
});

test("Commerce Ops keeps customer metadata separate and actions content-sized", async ({
  page,
}) => {
  await page.goto("/#playground?scene=commerce-ops");
  const dashboard = page.locator('[data-scene="commerce-ops"]');
  await expectSeparateLines(
    dashboard.getByText("Maya Chen", { exact: true }),
    dashboard.getByText("Priority customer · Montreal", { exact: true }),
  );
  const action = await bounds(
    dashboard.getByRole("button", { name: "Open order details" }),
  );
  const canvas = await bounds(dashboard);
  expect(action.width).toBeLessThan(canvas.width / 2);
});

test("Relay keeps ticket identity and customer metadata on distinct lines", async ({
  page,
}) => {
  await page.goto("/#playground?scene=service-desk");
  const dashboard = page.locator('[data-scene="service-desk"]');
  await expectSeparateLines(
    dashboard.getByRole("heading", {
      name: "Sync stopped after workspace migration",
    }),
    dashboard.getByText("Mara Li · Northwind Studio · 12 minutes ago", {
      exact: true,
    }),
  );
});

test("Launchpad keeps service identity and deploy metadata on distinct lines", async ({
  page,
}) => {
  await page.goto("/#playground?scene=deploy-control");
  const dashboard = page.locator('[data-scene="deploy-control"]');
  await expectSeparateLines(
    dashboard.getByRole("heading", { name: "web / production" }),
    dashboard.getByText(/Commit 5e806d1/),
  );
});
test("workbench tabs wrap at narrow widths", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/#playground");
  await page.getByText("Component workbench", { exact: true }).click();
  const list = page.getByRole("tablist", { name: "Playground modes" });
  await expect(list).toBeVisible();
  for (const tab of await list.getByRole("tab").all()) {
    const rect = await bounds(tab);
    expect(rect.x).toBeGreaterThanOrEqual(-1);
    expect(rect.x + rect.width).toBeLessThanOrEqual(321);
  }
});
