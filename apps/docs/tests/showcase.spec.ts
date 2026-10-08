import { expect, test } from "@playwright/test";
import { sceneIds } from "./showcase-fixtures.js";

test("the landing page leads with a live app gallery, not a documentation rail", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /One system\.\s*Different worlds\./u,
  );
  await expect(page.locator(".desktop-sidebar")).toHaveCount(0);
  await expect(page.locator("[data-overview-showcase]")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Your team", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Product pulse", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("tablist", { name: "Dashboard examples" }),
  ).toHaveCount(0);
  await expect(page.locator(".release-room")).toHaveCount(0);

  await page.goto("/#components");
  await expect(page.locator(".desktop-sidebar")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Toggle navigation", exact: true })
    .click();
  const navigation = page.getByRole("complementary", {
    name: "Documentation sidebar",
    exact: true,
  });
  await expect(navigation).toBeVisible();
  await expect(
    navigation.getByRole("navigation", { name: "Documentation sections" }),
  ).toHaveCount(1);
  await navigation
    .getByRole("button", { name: "Close navigation", exact: true })
    .click();
  await expect(navigation).not.toBeVisible();
});

for (const scene of sceneIds) {
  test(`${scene} is the only mounted dashboard and survives a reloadable deep link`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => {
      errors.push(error.message);
    });
    await page.goto(`/#playground?scene=${scene}`);
    await expect(page.locator(`[data-scene="${scene}"]`)).toBeVisible();
    await expect(page.locator("[data-scene]")).toHaveCount(1);
    await page.reload();
    await expect(page.locator(`[data-scene="${scene}"]`)).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("dashboard tabs use manual activation and reset local state", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("flux-ui-theme", "dark");
    localStorage.setItem("flux-ui-docs-palette", "indigo");
    localStorage.removeItem("flux-ui-docs-secondary-palette");
  });
  await page.goto("/#playground");

  const dashboards = page.getByRole("tablist", { name: "Dashboard examples" });
  await expect(dashboards.getByRole("tab")).toHaveCount(5);
  const revenue = dashboards.getByRole("tab", {
    name: "Revenue",
    exact: true,
  });
  await revenue.focus();
  await page.keyboard.press("ArrowRight");
  const product = dashboards.getByRole("tab", {
    name: "Product",
    exact: true,
  });
  await expect(product).toBeFocused();
  await expect(revenue).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Enter");
  await expect(page.locator('[data-scene="product-pulse"]')).toBeVisible();
  await expect(product).toBeFocused();

  const dashboard = page.locator('[data-scene="product-pulse"]');
  await dashboard
    .getByRole("tab", { name: "Experiments", exact: true })
    .click();
  const confidence = dashboard.getByRole("slider", {
    name: /Decision confidence/u,
  });
  await confidence.press("ArrowRight");
  await expect(confidence).toHaveValue("83");

  const surface = page.locator(".world-surface");
  await expect(page.getByLabel("Primary palette", { exact: true })).toHaveCount(
    0,
  );
  await expect(
    page.getByLabel("Secondary palette", { exact: true }),
  ).toHaveCount(0);

  await expect(confidence).toHaveValue("83");
  await expect(surface).toHaveAttribute("data-flux-theme", "dark");
  await expect(surface).toHaveAttribute("data-flux-palette", "indigo");

  const rootAccent = await page
    .locator("html")
    .evaluate((element) =>
      getComputedStyle(element).getPropertyValue("--flux-color-accent").trim(),
    );
  const surfaceAccent = await surface.evaluate((element) =>
    getComputedStyle(element).getPropertyValue("--flux-color-accent").trim(),
  );
  expect(surfaceAccent).toBe(rootAccent);

  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await dashboard
    .getByRole("tab", { name: "Experiments", exact: true })
    .click();
  await expect(
    dashboard.getByRole("slider", { name: /Decision confidence/u }),
  ).toHaveValue("82");
});

test("secondary palette selection no longer blends front-page semantic surfaces", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("flux-ui-theme", "dark");
    localStorage.setItem("flux-ui-docs-palette", "indigo");
    localStorage.setItem("flux-ui-docs-secondary-palette", "lime");
  });
  await page.goto("/#overview");

  const performance = page.locator('[data-showcase-card="performance"]');
  const pairedSurface = await performance.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  await expect(page.getByLabel("Primary palette", { exact: true })).toHaveCount(
    0,
  );
  await expect(
    page.getByLabel("Secondary palette", { exact: true }),
  ).toHaveCount(0);

  await page.goto("/#tokens");
  await page
    .getByLabel("Secondary palette", { exact: true })
    .selectOption("off");
  await page.goto("/#overview");
  const primaryOnlySurface = await performance.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );

  expect(pairedSurface).toBe(primaryOnlySurface);
  await expect(
    page.getByRole("tablist", { name: "Dashboard examples" }),
  ).toHaveCount(0);
  await expect(page.locator("[data-scene]")).toHaveCount(0);
});

test("design-token theme configurator routes tokens independently and exports light/dark CSS", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("flux-ui-theme", "light");
    localStorage.setItem("flux-ui-docs-palette", "indigo");
    localStorage.setItem("flux-ui-docs-secondary-palette", "amber");
  });
  await page.goto("/#tokens");

  await page.getByText(/Advanced token routing/u).click();

  const tokenSelect = page.getByRole("combobox", {
    name: "Token to customize",
  });
  await expect(page.locator("[data-theme-token]")).toHaveCount(1);
  await tokenSelect.selectOption("surfaceSubtle");

  const subtle = page.locator('[data-theme-token="surfaceSubtle"]');
  await subtle.getByRole("radio", { name: "Secondary", exact: true }).check();
  await expect(tokenSelect.locator('option[value="surfaceSubtle"]')).toHaveText(
    "Surface subtle (Secondary)",
  );

  const lightPreview = page.locator('[data-theme-preview="light"]');
  const darkPreview = page.locator('[data-theme-preview="dark"]');
  await expect
    .poll(() =>
      lightPreview.evaluate((element) =>
        element.style.getPropertyValue("--flux-color-surface-subtle").trim(),
      ),
    )
    .toBe("var(--flux-palette-amber-100)");
  await expect
    .poll(() =>
      darkPreview.evaluate((element) =>
        element.style.getPropertyValue("--flux-color-surface-subtle").trim(),
      ),
    )
    .toBe("var(--flux-palette-amber-900)");

  await tokenSelect.selectOption("accent");
  const accent = page.locator('[data-theme-token="accent"]');
  await accent.getByRole("radio", { name: "Custom", exact: true }).check();
  await expect(tokenSelect.locator('option[value="accent"]')).toHaveText(
    "Accent (Custom)",
  );
  await accent
    .getByRole("button", { name: "Edit light & dark", exact: true })
    .click();

  const customEditor = page.getByRole("dialog", {
    name: "Custom Accent colors",
  });
  await customEditor
    .getByRole("group", { name: "Accent light color" })
    .getByRole("textbox", { name: "Hex color" })
    .fill("#123456");
  await customEditor
    .getByRole("group", { name: "Accent dark color" })
    .getByRole("textbox", { name: "Hex color" })
    .fill("#abcdef");

  await expect
    .poll(() =>
      lightPreview.evaluate((element) =>
        element.style.getPropertyValue("--flux-color-accent").trim(),
      ),
    )
    .toBe("#123456");
  await expect
    .poll(() =>
      darkPreview.evaluate((element) =>
        element.style.getPropertyValue("--flux-color-accent").trim(),
      ),
    )
    .toBe("#abcdef");

  await page
    .getByRole("button", { name: "Export palette", exact: true })
    .click();
  const exported = page.getByRole("region", {
    name: "Your Flux theme CSS",
  });
  await expect(exported).toContainText(
    "--flux-color-surface-subtle: var(--flux-palette-amber-100);",
  );
  await expect(exported).toContainText("--flux-color-accent: #123456;");
  await expect(exported).toContainText(
    '.flux-custom-theme[data-flux-theme="dark"]',
  );
  await expect(exported).toContainText("--flux-color-accent: #abcdef;");
});

test("invalid dashboard and legacy mood parameters fall back safely", async ({
  page,
}) => {
  await page.goto("/#playground?scene=not-a-scene&mood=%3Cscript%3E");
  await expect(page.locator('[data-scene="revenue-command"]')).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "That page wandered off." }),
  ).toHaveCount(0);
});

test("back navigation restores dashboards without rewriting saved appearance", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("flux-ui-docs-palette", "blue");
  });
  await page.goto("/#playground?scene=revenue-command");
  await expect(page.locator('[data-scene="revenue-command"]')).toBeVisible();

  await page.getByRole("tab", { name: "Product", exact: true }).click();
  await expect(page.locator('[data-scene="product-pulse"]')).toBeVisible();
  await page.goBack();
  await expect(page.locator('[data-scene="revenue-command"]')).toBeVisible();

  await page.evaluate(() => {
    window.scrollTo({ top: 320, behavior: "instant" });
  });
  const before = await page.evaluate(() => window.scrollY);
  await page.evaluate(() => {
    window.location.hash = "playground?scene=deploy-control";
  });
  await expect(page.locator('[data-scene="deploy-control"]')).toBeVisible();
  expect(await page.evaluate(() => window.scrollY)).toBe(before);
  await expect(page.locator("html")).toHaveAttribute(
    "data-flux-palette",
    "blue",
  );
  await expect(page.getByLabel("Primary palette", { exact: true })).toHaveCount(
    0,
  );
});

test("deploy service rail fills its layout and preserves a content gutter", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#playground?scene=deploy-control");

  const dashboard = page.locator('[data-scene="deploy-control"]');
  const rail = dashboard.getByRole("complementary", {
    name: "Service navigation",
  });
  const layout = rail.locator("..");
  const heading = dashboard.getByRole("heading", {
    name: "web / production",
    exact: true,
  });
  const railBox = await rail.boundingBox();
  const layoutBox = await layout.boundingBox();
  const headingBox = await heading.boundingBox();

  if (railBox === null || layoutBox === null || headingBox === null)
    throw new Error("Deploy sidebar geometry could not be measured.");

  expect(Math.abs(railBox.height - layoutBox.height)).toBeLessThanOrEqual(1);
  expect(headingBox.x - (railBox.x + railBox.width)).toBeGreaterThanOrEqual(16);
});

test("composition details expose dashboard source only on request", async ({
  page,
}) => {
  await page.goto("/#playground?scene=deploy-control");
  await expect(
    page.getByRole("region", { name: "Composition details" }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "View components", exact: true })
    .click();

  const inspector = page.getByRole("region", { name: "Composition details" });
  await expect(inspector).toContainText("UI uses public Flux components.");
  await inspector
    .getByRole("button", { name: "View source", exact: true })
    .click();
  await expect(
    inspector.getByRole("region", { name: "Deploy composition source" }),
  ).toContainText("export default function DeployControlScene");
  await expect(
    inspector.getByRole("link", { name: "Slider ↗", exact: true }),
  ).toHaveAttribute("href", "#components/slider");
});

test("clipboard failure is honest and the dashboard permalink stays usable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error("blocked")) },
    });
  });
  await page.goto("/#playground?scene=deploy-control");
  await page.getByRole("button", { name: "Copy link", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Clipboard unavailable" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Open dashboard ↗", exact: true }),
  ).toHaveAttribute("href", "#playground?scene=deploy-control");
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`every dashboard fits a ${width}px viewport without root overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const scene of sceneIds) {
      await page.goto(`/#playground?scene=${scene}`);
      await expect(page.locator(`[data-scene="${scene}"]`)).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
        scene,
      ).toBe(true);
      const clippedControls = await page
        .locator(".product-showcase")
        .evaluate((surface) => {
          return [
            ...surface.querySelectorAll<HTMLElement>(
              "button, input, textarea, select, a",
            ),
          ]
            .filter((element) => {
              const rect = element.getBoundingClientRect();
              if (rect.width === 0 || rect.height === 0) return false;
              const stage = element
                .closest(".world-surface")
                ?.getBoundingClientRect();
              return (
                rect.left < 0 ||
                rect.right > window.innerWidth ||
                (stage !== undefined &&
                  (rect.left < stage.left || rect.right > stage.right))
              );
            })
            .map((element) => element.textContent.trim() || element.tagName);
        });
      expect(
        clippedControls,
        `${scene}: visible controls must not rely on overflow clipping`,
      ).toEqual([]);
    }
  });
}

test("dashboard compositions remain contained in a narrow gallery canvas", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const scene of sceneIds) {
    await page.goto(`/#playground?scene=${scene}`);
    const surface = page.locator(".world-surface");
    const dashboard = page.locator(`[data-scene="${scene}"]`);
    await expect(dashboard).toBeVisible();
    await surface.evaluate((element) => {
      element.style.inlineSize = "20rem";
      element.style.maxInlineSize = "100%";
    });
    await expect
      .poll(() =>
        surface.evaluate(
          (element) => element.scrollWidth <= element.clientWidth + 1,
        ),
      )
      .toBe(true);
  }
});
