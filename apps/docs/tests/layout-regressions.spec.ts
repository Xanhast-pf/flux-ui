import { expect, test, type Page } from "@playwright/test";

async function expectNoOverflow(page: Page): Promise<void> {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    ),
  ).toBe(true);
}

for (const width of [320, 390, 768, 1440]) {
  test(`persistent non-modal navigation and no overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#components/card");
    await expect(page.locator(".preview-content")).toBeVisible();
    const trigger = page.getByRole("button", {
      name: "Toggle navigation",
      exact: true,
    });
    await trigger.click();
    const sidebar = page.getByRole("complementary", {
      name: "Documentation sidebar",
    });
    await expect(sidebar).toBeVisible();
    await expect(page.locator("dialog[open], [inert]")).toHaveCount(0);
    await expect(
      sidebar.getByRole("navigation", { name: "Documentation sections" }),
    ).toHaveCount(1);
    const bounds = await sidebar.boundingBox();
    expect(bounds).not.toBeNull();
    if (bounds === null) throw new Error("Sidebar geometry is unavailable.");
    expect(bounds.width).toBeLessThanOrEqual(width + 1);
    await page.keyboard.press("Escape");
    await expect(sidebar).toBeVisible();
    await sidebar.getByRole("link", { name: "Box", exact: true }).click();
    await expect(page).toHaveURL(/#components\/box$/u);
    await expect(page.locator("main")).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(sidebar).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/#components\/card$/u);
    await expect(sidebar).toBeVisible();
    await sidebar
      .getByRole("button", { name: "Close navigation", exact: true })
      .click();
    await expect(sidebar).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await expectNoOverflow(page);
  });
}

for (const slug of ["badge", "card", "input", "link", "grid", "skip-link"]) {
  test(`${slug} preview stays centered at full and compact widths`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`/#components/${slug}`);
    const preview = page.locator(".preview-content");
    await expect(preview).toBeVisible();
    for (const compact of [false, true]) {
      if (compact)
        await page
          .getByRole("button", { name: "Compact preview", exact: true })
          .click();
      const rect = await preview.boundingBox();
      const stage = await page.locator(".preview-stage").boundingBox();
      expect(rect).not.toBeNull();
      expect(stage).not.toBeNull();
      if (rect === null || stage === null)
        throw new Error("Preview geometry is unavailable.");
      expect(
        Math.abs(rect.x + rect.width / 2 - stage.x - stage.width / 2),
      ).toBeLessThan(1);
      expect(rect.width).toBeLessThanOrEqual(compact ? 385 : 705);
      if (slug === "badge" || slug === "input" || slug === "link") {
        const child = await preview.locator(":scope > *").first().boundingBox();
        if (child === null) throw new Error("Demo geometry is unavailable.");
        expect(
          Math.abs(child.x + child.width / 2 - stage.x - stage.width / 2),
        ).toBeLessThan(1);
      }
    }
  });
}

test("default card padding, explicit box padding and consumer CSS survive stylesheet order", async ({
  page,
}) => {
  await page.goto("/#components/card");
  const card = page.locator(".preview-content > *").first();
  await expect(card).toHaveCSS("padding-top", "16px");
  await expect(card.locator(":scope > *").first()).toHaveCSS("gap", "16px");
  await card.evaluate((element) => {
    element.classList.add("consumer-surface");
  });
  await page.evaluate(() => {
    const style = document.createElement("style");
    style.textContent =
      ".consumer-surface { padding: 32px; margin-inline: 12px; }";
    document.head.prepend(style);
  });
  await expect(card).toHaveCSS("padding-top", "32px");
  await expect(card).toHaveCSS("margin-inline-start", "12px");
  await page.goto("/#components/box");
  await expect(page.getByRole("region", { name: "Project summary" })).toHaveCSS(
    "padding-top",
    "24px",
  );
});

test("sparse layout CSS cascades without viewport leakage or inherited instance values", async ({
  page,
}) => {
  await page.goto("/#components/stack");
  const stack = page.getByTestId("example-stack");
  await expect(stack).toBeVisible();
  // Unit tests cover prop-to-variable mapping. This tests the real emitted CSS protocol.
  await stack.evaluate((element) => {
    element.style.setProperty("--f-l-b", "8px");
    element.style.setProperty("--f-l-l", "32px");
    const nested = element.cloneNode(true) as HTMLElement;
    nested.id = "nested-layout-regression";
    nested.removeAttribute("data-testid");
    nested.removeAttribute("style");
    element.append(nested);
  });
  for (const [width, gap] of [
    [390, "8px"],
    [768, "8px"],
    [1024, "32px"],
    [1440, "32px"],
  ] as const) {
    await page.setViewportSize({ width, height: 1000 });
    await expect(stack).toHaveCSS("gap", gap);
    await expect(page.locator("#nested-layout-regression")).toHaveCSS(
      "gap",
      "0px",
    );
  }
  await stack.evaluate((element) => {
    element.dataset.r = "container";
    const parent = element.parentElement;
    if (parent === null) throw new Error("Missing preview container.");
    parent.style.containerType = "inline-size";
    parent.style.containerName = "flux-layout";
    parent.style.inlineSize = "300px";
  });
  await expect(stack).toHaveCSS("gap", "8px");
  await stack.evaluate((element) => {
    const parent = element.parentElement;
    if (parent === null) throw new Error("Missing preview container.");
    parent.style.inlineSize = "1100px";
    parent.style.maxInlineSize = "none";
  });
  await expect(stack).toHaveCSS("gap", "32px");
});

test("grid modes, axis gaps and placements keep their breakpoint semantics", async ({
  page,
}) => {
  await page.goto("/#components/grid");
  const grid = page.getByTestId("example-grid");
  await expect(grid).toBeVisible();
  await grid.evaluate((element) => {
    element.style.setProperty("--f-k-b", "repeat(1, minmax(0, 1fr))");
    element.style.setProperty("--f-k-m", "repeat(3, minmax(0, 1fr))");
    element.style.setProperty("--f-g-b", "8px");
    element.style.setProperty("--f-r-m", "24px");
  });
  for (const [width, count, gap] of [
    [390, 1, "8px"],
    [800, 3, "24px"],
    [1440, 3, "24px"],
  ] as const) {
    await page.setViewportSize({ width, height: 1000 });
    const tracks = await grid.evaluate(
      (element) =>
        getComputedStyle(element).gridTemplateColumns.split(" ").length,
    );
    expect(tracks).toBe(count);
    await expect(grid).toHaveCSS("row-gap", gap);
    await expect(grid).toHaveCSS("column-gap", "8px");
  }
});

test("all drawer sides keep native geometry and honor reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1000, height: 800 });
  await page.goto("/#components/drawer");
  await page.getByRole("button", { name: "Open drawer", exact: true }).click();
  const drawer = page.getByRole("dialog", {
    name: "Project navigation",
    exact: true,
  });
  await expect(drawer).toBeVisible();
  for (const side of ["left", "right", "top", "bottom"]) {
    await drawer.evaluate((element, value) => {
      element.dataset.side = value;
    }, side);
    await expect(drawer).toHaveCSS("animation-name", "none");
    const rect = await drawer.boundingBox();
    if (rect === null) throw new Error("Drawer geometry is unavailable.");
    if (side === "left") expect(rect.x).toBeCloseTo(0);
    if (side === "right") expect(rect.x + rect.width).toBeCloseTo(1000);
    if (side === "top") expect(rect.y).toBeCloseTo(0);
    if (side === "bottom") expect(rect.y + rect.height).toBeCloseTo(800);
  }
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open drawer", exact: true }),
  ).toBeFocused();
});

test("surface defaults do not erase footer spacing or header auto alignment", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#components/card");
  await expect(page.locator(".preview-stage")).toHaveCSS("padding-top", "32px");
  await expect(page.locator("main")).toHaveCSS("gap", "64px");
  await expect(page.locator(".site-footer")).toHaveCSS("padding-top", "32px");
  await expect(page.locator(".header-inner")).toHaveCSS("gap", "8px");
  await expect(page.locator(".header-inner")).toHaveCSS(
    "justify-content",
    "space-between",
  );
  const search = await page
    .getByRole("banner")
    .getByRole("button", { name: "Search docs", exact: true })
    .boundingBox();
  const brand = await page
    .getByRole("link", { name: "Flux UI home" })
    .boundingBox();
  if (search === null || brand === null)
    throw new Error("Header geometry unavailable.");
  expect(search.x).toBeGreaterThan(brand.x + brand.width);
});

test("sidebar preserves its own scroll position through routing and its toggle stays reachable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 600 });
  await page.goto("/#components/card");
  const toggle = page.getByRole("button", {
    name: "Toggle navigation",
    exact: true,
  });
  await toggle.click();
  const sidebar = page.getByRole("complementary", {
    name: "Documentation sidebar",
  });
  const lastLink = sidebar.getByRole("link", {
    name: "VisuallyHidden",
    exact: true,
  });
  await lastLink.scrollIntoViewIfNeeded();
  const scroll = await sidebar.evaluate((element) => element.scrollTop);
  expect(scroll).toBeGreaterThan(0);
  await lastLink.click();
  await expect(page).toHaveURL(/#components\/visually-hidden$/u);
  expect(
    Math.abs((await sidebar.evaluate((element) => element.scrollTop)) - scroll),
  ).toBeLessThanOrEqual(1);
  await expect(toggle).toBeInViewport();
  await toggle.click();
  await expect(sidebar).not.toBeVisible();
  await toggle.click();
  expect(
    Math.abs((await sidebar.evaluate((element) => element.scrollTop)) - scroll),
  ).toBeLessThanOrEqual(1);
});

for (const theme of ["light", "dark"]) {
  test(`responsive shell and benchmark cards retain spacing in ${theme}`, async ({
    page,
  }) => {
    await page.goto("/#performance");
    await page.locator("html").evaluate((element, value) => {
      element.dataset.fluxTheme = value;
    }, theme);
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await expect(
        page.getByRole("heading", {
          level: 1,
          name: "Runtime benchmark health",
        }),
      ).toBeVisible();
      await expect(page.locator(".desktop-sidebar")).toHaveCount(0);
      await expect(page.locator("main article").first()).toHaveCSS(
        "padding-top",
        "24px",
      );
      await expect(page.locator("main article").first()).toHaveCSS(
        "padding-inline-start",
        "24px",
      );
      await expectNoOverflow(page);
    }
  });
}
