import { expect, test } from "@playwright/test";

for (const width of [320, 1280]) {
  for (const theme of ["light", "dark"]) {
    test(`public user tour: ${theme} at ${width}px`, async ({ page }, info) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(
        (value) => localStorage.setItem("flux-ui-theme", value),
        theme,
      );
      for (const route of [
        "overview",
        "install",
        "documentation",
        "components",
        "icons",
        "playground",
      ]) {
        await page.goto(`/#${route}`);
        await expect(
          page.getByRole("main").getByRole("heading", { level: 1 }),
        ).toBeVisible();
        await expect(page).not.toHaveTitle(/not found/iu);
        await expect(page.locator("html")).toHaveAttribute(
          "data-flux-theme",
          theme,
        );
        await expect
          .poll(() =>
            page.evaluate(
              () => document.documentElement.scrollWidth - innerWidth,
            ),
          )
          .toBeLessThanOrEqual(1);
        if (route === "overview" || route === "playground")
          await info.attach(`${route}-${theme}-${width}`, {
            body: await page.screenshot({ fullPage: true }),
            contentType: "image/png",
          });
      }
      expect(errors).toEqual([]);
    });
  }
}

test("Footer preview documentation link reaches a real page", async ({
  page,
}) => {
  await page.goto("/#components/footer");
  await expect(
    page
      .getByRole("main")
      .getByRole("heading", { name: "Footer", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Documentation", exact: true }).click();
  await expect(page).toHaveURL(/#documentation$/u);
  await expect(page).toHaveTitle("Guides & FAQ · Flux UI");
  await expect(page.getByRole("main")).toBeFocused();
});

test("search recovers from no matches and preserves a usable deep link after reload", async ({
  page,
}) => {
  await page.goto("/#overview");
  const trigger = page.getByRole("button", {
    name: "Search docs",
    exact: true,
  });
  await trigger.focus();
  await page.keyboard.press("Control+k");
  const dialog = page.getByRole("dialog", {
    name: "Find your next building block.",
  });
  const input = dialog.getByRole("searchbox", { name: "Search documentation" });
  await expect(input).toBeFocused();
  await input.fill("no-such-component-xyz");
  await expect(dialog.getByText("No matches.", { exact: true })).toBeVisible();
  await input.fill("Combobox");
  await dialog.getByRole("link", { name: /^Combobox/u }).click();
  await expect(page).toHaveURL(/#components\/combobox$/u);
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("main")).toBeFocused();
  await page.reload();
  await expect(page).toHaveTitle("Combobox · Components · Flux UI");
  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("unknown routes provide keyboard-accessible recovery and legacy links still resolve", async ({
  page,
}) => {
  await page.goto("/#missing-route");
  await expect(
    page.getByRole("heading", { name: "That page wandered off." }),
  ).toBeVisible();
  const recovery = page.getByRole("link", { name: "Back to the workshop" });
  await recovery.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#overview$/u);
  await expect(page.getByRole("main")).toBeFocused();
  await page.goto("/#rules");
  await expect(page).toHaveTitle("Engineering · Flux UI");
});

test("blocked browser storage does not break initial rendering or search", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, "getItem", {
      value() {
        throw new Error("Storage unavailable");
      },
    });
    Object.defineProperty(Storage.prototype, "setItem", {
      value() {
        throw new Error("Storage unavailable");
      },
    });
  });
  await page.goto("/#components");
  await expect(
    page.getByRole("main").getByRole("heading", { level: 1 }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Search docs", exact: true }).click();
  await expect(
    page.getByRole("searchbox", { name: "Search documentation" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  expect(errors).toEqual([]);
});

test("forced-colors and reduced-motion preserve small-screen keyboard access", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  for (const slug of [
    "combobox",
    "dialog",
    "data-table",
    "split-pane",
    "tabs",
    "toolbar",
    "select",
  ]) {
    await page.goto(`/#components/${slug}`);
    await expect(
      page.getByRole("main").getByRole("heading", { level: 1 }),
    ).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
      )
      .toBeLessThanOrEqual(1);
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toBeVisible();
    expect(
      await focused.evaluate((element) => element.matches(":focus-visible")),
    ).toBe(true);
    await expect(focused).toBeInViewport();
    if (slug === "split-pane")
      await info.attach("split-pane-forced-colors-320", {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
      });
  }
});

test("SplitPane demo changes axis instead of crushing content on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/#components/split-pane");
  const separator = page.getByRole("separator", {
    name: "Resize explanation and source",
  });
  await expect(separator).toHaveAttribute("aria-orientation", "horizontal");
  await expect
    .poll(() =>
      separator.evaluate(
        (element) =>
          element.previousElementSibling?.getBoundingClientRect().width ?? 0,
      ),
    )
    .toBeGreaterThan(200);
  await expect
    .poll(() =>
      separator.evaluate(
        (element) =>
          element.nextElementSibling?.getBoundingClientRect().width ?? 0,
      ),
    )
    .toBeGreaterThan(200);

  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(separator).toHaveAttribute("aria-orientation", "vertical");
});

test("canonical public site metadata is present in the served application", async ({
  page,
}) => {
  await page.goto("/#overview");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://flux.varua.ca/",
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "https://flux.varua.ca/",
  );
});

test("object-prototype route names and malformed encoding cannot break navigation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const route of ["constructor", "toString", "__proto__", "%ZZ"]) {
    await page.goto(`/#${route}`);
    await expect(
      page.getByRole("heading", { name: "That page wandered off." }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Back to the workshop" }),
    ).toBeVisible();
  }
  expect(errors).toEqual([]);
});
