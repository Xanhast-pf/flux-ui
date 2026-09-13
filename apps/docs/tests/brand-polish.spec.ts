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
    const drawer = page.getByRole("complementary", {
      name: "Documentation sidebar",
    });
    for (const group of ["Build", "Design", "Inspect"]) {
      await expect(drawer.getByText(group, { exact: true })).toBeVisible();
    }
    await page.keyboard.press("Escape");
    await expect(drawer).toBeVisible();
    await drawer.getByRole("button", { name: "Close navigation" }).click();
    await expect(trigger).toBeFocused();
  });
}

test("brand SVG downloads are vectors and the favicon resolves", async ({
  page,
}) => {
  await page.goto("/#identity");
  await expect(
    page.getByRole("heading", { name: "The ribbon F." }),
  ).toBeVisible();
  for (const name of ["Download SVG", "App icon SVG", "Monochrome SVG"]) {
    const link = page.getByRole("link", { name, exact: true });
    const href = await link.getAttribute("href");
    if (!href) throw new Error("Missing brand asset URL.");
    const response = await page.request.get(new URL(href, page.url()).href);
    expect(response.ok()).toBe(true);
    const svg = await response.text();
    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(svg.match(/<path /gu)).toHaveLength(3);
    expect(svg).not.toMatch(/<image|<script|<foreignObject|data:image/u);
  }
  const favicon = await page.locator('link[rel="icon"]').getAttribute("href");
  if (!favicon) throw new Error("Missing favicon.");
  expect((await page.request.get(new URL(favicon, page.url()).href)).ok()).toBe(
    true,
  );
});

test("finance transaction titles and metadata have distinct lines", async ({
  page,
}) => {
  await page.goto("/#playground?scene=finance&mood=paper");
  const activity = page.getByRole("region", { name: "Recent demo activity" });
  await expectSeparateLines(
    activity.getByText("Studio North", { exact: true }),
    activity.getByText("Invoice · 1042", { exact: true }),
  );
});

test("marketing audience copy does not run together", async ({ page }) => {
  await page.goto("/#playground?scene=marketing&mood=paper");
  await expectSeparateLines(
    page.getByText("Made for your people.", { exact: true }),
    page.getByText("Fictional audience preview", { exact: true }),
  );
});

test("social author metadata is separate and like stays content-sized", async ({
  page,
}) => {
  await page.goto("/#playground?scene=social&mood=paper");
  const post = page
    .getByRole("article")
    .filter({ has: page.getByRole("button", { name: "Like post mira" }) });
  await expectSeparateLines(
    post.getByText("Mira Chen", { exact: true }),
    post.getByText("Designer · fictional profile", { exact: true }),
  );
  const button = await bounds(
    post.getByRole("button", { name: "Like post mira" }),
  );
  const card = await bounds(post);
  expect(button.width).toBeLessThan(card.width - 64);
});

test("commerce separates the bag total from its action", async ({ page }) => {
  await page.goto("/#playground?scene=commerce&mood=paper");
  const summary = page.getByRole("region", { name: "Demo bag summary" });
  const total = await bounds(summary.getByText("$0", { exact: true }));
  const clear = await bounds(
    summary.getByRole("button", { name: "Clear demo bag" }),
  );
  expect(clear.x - total.x - total.width).toBeGreaterThanOrEqual(15);
});

for (const outer of ["light", "dark"]) {
  test(`video headings stay light across all artwork and moods in ${outer}`, async ({
    page,
  }) => {
    for (const mood of ["paper", "studio", "bloom", "terminal"]) {
      await page.goto(`/#playground?scene=video&mood=${mood}`);
      await expect(page.locator('[data-scene="video"]')).toBeVisible();
      await page.locator("html").evaluate((element, theme) => {
        element.dataset.fluxTheme = theme;
      }, outer);
      const clips = page.getByRole("group", { name: "Storyboard clips" });
      for (const name of ["01 / Coastline", "02 / Dunes", "03 / Afterglow"]) {
        await clips.getByRole("button", { name: new RegExp(name) }).click();
        await expect(page.locator(".video-frame h3")).toHaveCSS(
          "color",
          "rgb(255, 255, 255)",
        );
      }
    }
  });
}

test("video frame control produces the requested geometry", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#playground?scene=video&mood=paper");
  const select = page.getByLabel("Frame shape", { exact: true });
  for (const [value, ratio] of [
    ["16 / 9", 16 / 9],
    ["1 / 1", 1],
    ["9 / 16", 9 / 16],
  ] as const) {
    await select.selectOption(value);
    await expect
      .poll(async () => {
        const rect = await bounds(page.locator(".video-frame"));
        return Math.abs(rect.width / rect.height - ratio);
      })
      .toBeLessThan(0.01);
  }
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

for (const width of [390, 1440]) {
  test(`music playhead starts with the track lanes at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/#playground?scene=music&mood=paper");
    const lanes = page.locator(".track-lane");
    await expect(lanes).toHaveCount(4);
    for (const lane of await lanes.all()) {
      const track = await bounds(lane);
      const playhead = await bounds(lane.locator(".sequencer-playhead"));
      expect(Math.abs(playhead.y - track.y)).toBeLessThan(1);
      expect(playhead.x).toBeGreaterThanOrEqual(track.x - 1);
      expect(playhead.x + playhead.width).toBeLessThanOrEqual(
        track.x + track.width + 1,
      );
    }
    const rows = page.locator(".track-row");
    const first = await bounds(rows.nth(0));
    const second = await bounds(rows.nth(1));
    expect(Math.abs(second.y - first.y - first.height)).toBeLessThan(1);
  });
}
