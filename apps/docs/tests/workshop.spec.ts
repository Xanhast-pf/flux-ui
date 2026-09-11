import { expect, test, type Page } from "@playwright/test";
import { components } from "../src/generated/components.js";

for (const component of components) {
  test(`${component.name} has a live preview, code and API route`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => {
      errors.push(error.message);
    });
    await page.goto(`/#components/${component.slug}`);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: component.name,
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.locator(".preview-content")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "API at a glance", exact: true }),
    ).toBeVisible();
    await page.getByRole("tab", { name: "Code", exact: true }).click();
    await expect(
      page.getByRole("region", {
        name: `${component.name} example`,
        exact: true,
      }),
    ).toContainText("@flux-ui/react");
    expect(errors).toEqual([]);
  });
}

test("catalog search filters summaries without mounting every demo", async ({
  page,
}) => {
  await page.goto("/#components");
  await page
    .getByRole("searchbox", { name: "Filter components", exact: true })
    .fill("RadioGroup");
  await expect(
    page.getByRole("main").getByRole("heading", { level: 2 }),
  ).toHaveCount(1);
  await page
    .getByRole("main")
    .getByRole("link", { name: /RadioGroup/ })
    .click();
  await expect(page).toHaveURL(/#components\/radio-group$/);
  await page.goBack();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Components",
      exact: true,
    }),
  ).toBeVisible();
});

test("search keyboard shortcut navigates real links and Escape restores focus", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: /Search docs/ });
  await trigger.focus();
  await page.keyboard.press("Control+k");
  const dialog = page.getByRole("dialog", {
    name: "Find your next building block.",
  });
  const search = dialog.getByRole("searchbox", {
    name: "Search documentation",
  });
  await expect(search).toBeFocused();
  await search.fill("Slider");
  await dialog.getByRole("link", { name: /^Slider/ }).click();
  await expect(page).toHaveURL(/#components\/slider$/);
  await expect(dialog).not.toBeVisible();
  await expect(page.locator("main")).toBeFocused();
  await trigger.click();
  await expect(dialog).toBeVisible();
  await expect(search).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("preferences persist and previews reset without resetting the theme", async ({
  page,
}) => {
  await page.goto("/#playground");
  await page.getByRole("tab", { name: "Theme lab", exact: true }).click();
  await page.getByRole("radio", { name: "teal", exact: true }).check();
  await page
    .getByRole("banner")
    .getByRole("switch", { name: "Dark theme", exact: true })
    .check();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute(
    "data-docs-accent",
    "teal",
  );
  await expect(page.locator("html")).toHaveAttribute("data-flux-theme", "dark");
  await page.goto("/#components/switch");
  const control = page.getByRole("switch", {
    name: "Activity notifications",
    exact: true,
  });
  await control.focus();
  await page.keyboard.press("Space");
  await expect(control).not.toBeChecked();
  await page
    .getByRole("button", { name: "Reset example", exact: true })
    .click();
  await expect(control).toBeChecked();
  await expect(page.locator("html")).toHaveAttribute(
    "data-docs-accent",
    "teal",
  );
});

test("release room has a real local checklist, form and confirmation flow", async ({
  page,
}) => {
  await page.goto("/#playground");
  await expect(
    page.getByRole("button", { name: "Review demo release", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("checkbox", { name: "Try the keyboard path", exact: true })
    .check();
  await page
    .getByRole("checkbox", { name: "Inspect the bundle budget", exact: true })
    .check();
  await page
    .getByRole("textbox", { name: "New task", exact: true })
    .fill("Celebrate the small wins");
  await page.getByRole("button", { name: "Add task", exact: true }).click();
  await page
    .getByRole("checkbox", { name: "Celebrate the small wins", exact: true })
    .check();
  await expect(
    page.getByRole("progressbar", { name: "Demo release checklist" }),
  ).toHaveAttribute("value", "4");
  await page
    .getByRole("combobox", { name: "Demo environment" })
    .selectOption("staging");
  await page
    .getByRole("button", { name: "Review demo release", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Confirm demo release", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Demo release recorded for staging",
  );
  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  await expect(
    page.getByRole("progressbar", { name: "Demo release checklist" }),
  ).toHaveAttribute("value", "1");
});

test("button lab changes the actual control and generated example", async ({
  page,
}) => {
  await page.goto("/#playground");
  await page.getByRole("tab", { name: "Button lab", exact: true }).click();
  await page
    .getByRole("combobox", { name: "Variant", exact: true })
    .selectOption("outline");
  await page
    .getByRole("textbox", { name: "Button label", exact: true })
    .fill("Ship it");
  await page.getByRole("switch", { name: "Disabled", exact: true }).check();
  await expect(
    page.getByRole("button", { name: "Ship it", exact: true }),
  ).toBeDisabled();
  await expect(page.getByRole("region", { name: "Your button" })).toContainText(
    'variant="outline"',
  );
  await expect(page.getByRole("region", { name: "Your button" })).toContainText(
    "disabled",
  );
});

test("copy success and clipboard failure are reported honestly", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: (text: string) => {
          window.localStorage.setItem("clipboard-test", text);
          return Promise.resolve();
        },
      },
    });
  });
  await page.goto("/#components/slider");
  await page.getByRole("tab", { name: "Code", exact: true }).click();
  await page.getByRole("button", { name: "Copy code", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Copied to clipboard.");
  expect(
    await page.evaluate(() => window.localStorage.getItem("clipboard-test")),
  ).toContain("Slider");
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: () => Promise.reject(new Error("Clipboard blocked")),
      },
    });
  });
  await page.getByRole("button", { name: "Copy code", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Clipboard unavailable");
});

test("native disclosures and range controls work without custom key handlers", async ({
  page,
}) => {
  await test.step("Collapsible uses native summary keyboard activation", async () => {
    await page.goto("/#components/collapsible");
    const disclosure = page.locator(".preview-content details");
    const trigger = disclosure.locator("summary");
    await expect(disclosure).not.toHaveAttribute("open", "");
    await trigger.press("Enter");
    await expect(disclosure).toHaveAttribute("open", "");
    await expect(
      disclosure.getByText("No provider, measured heights", { exact: false }),
    ).toBeVisible();
  });

  await test.step("Slider uses the native range keyboard step", async () => {
    await page.goto("/#components/slider");
    const slider = page.getByRole("slider", {
      name: "Preview volume",
      exact: true,
    });
    await expect(slider).toHaveValue("40");
    await slider.press("ArrowRight");
    await expect(slider).toHaveValue("45");
  });

  await test.step("Switch remains native under forced colors", async () => {
    await page.emulateMedia({
      forcedColors: "active",
      reducedMotion: "reduce",
    });
    await page.goto("/#components/switch");
    const control = page.getByRole("switch", {
      name: "Activity notifications",
      exact: true,
    });
    await expect(control).toBeVisible();
    await expect(control).toBeChecked();
    await control.press("Space");
    await expect(control).not.toBeChecked();
  });
});

async function expectNoHorizontalOverflow(
  page: Page,
  route: string,
): Promise<void> {
  const report = await page.evaluate(() => {
    const viewportWidth = window.innerWidth;

    function isContainedHorizontalOverflow(element: HTMLElement): boolean {
      let ancestor = element.parentElement;
      while (ancestor !== null && ancestor !== document.body) {
        const style = getComputedStyle(ancestor);
        if (["auto", "scroll", "hidden", "clip"].includes(style.overflowX)) {
          const rect = ancestor.getBoundingClientRect();
          if (rect.left >= -1 && rect.right <= viewportWidth + 1) return true;
        }
        ancestor = ancestor.parentElement;
      }
      return false;
    }

    const offenders = [
      document.body,
      ...Array.from(document.body.querySelectorAll<HTMLElement>("*")),
    ]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          element,
          left: Math.round(rect.left * 10) / 10,
          right: Math.round(rect.right * 10) / 10,
          width: Math.round(rect.width * 10) / 10,
        };
      })
      .filter(
        ({ element, left, right }) =>
          (left < -1 || right > viewportWidth + 1) &&
          !isContainedHorizontalOverflow(element),
      )
      .slice(0, 8)
      .map(({ element, left, right, width }) => ({
        element: element.tagName.toLowerCase(),
        className: element.className,
        left,
        right,
        width,
      }));

    const previousX = window.scrollX;
    const previousY = window.scrollY;
    window.scrollTo({ left: 1_000_000, top: previousY, behavior: "instant" });
    const rootScrollX = window.scrollX;
    window.scrollTo({ left: previousX, top: previousY, behavior: "instant" });

    return {
      documentWidth: document.documentElement.scrollWidth,
      offenders,
      rootScrollX,
      viewportWidth,
    };
  });

  expect(
    report.offenders,
    `#${route} has uncontained horizontal overflow at ${report.viewportWidth}px`,
  ).toEqual([]);
  expect(
    report.rootScrollX,
    `#${route} can scroll ${report.rootScrollX}px horizontally at ${report.viewportWidth}px ` +
      `(reported document width ${report.documentWidth}px): ${JSON.stringify(report.offenders)}`,
  ).toBeLessThanOrEqual(1);
}

for (const width of [320, 390, 768, 1440]) {
  test(`docs fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "overview",
      "components",
      "components/table",
      "icons",
      "identity",
      "playground",
      "tokens",
      "size",
    ]) {
      await page.goto(`/#${route}`);
      await expect(page.locator("main h1")).toBeVisible();
      if (route.startsWith("components/"))
        await expect(page.locator(".preview-content")).toBeVisible();
      await expectNoHorizontalOverflow(page, route);
    }
  });
}

for (const route of [
  "health",
  "size",
  "performance",
  "rules",
  "install",
  "icons",
  "identity",
  "tokens",
  "documentation",
]) {
  test(`preserves the #${route} deep link across reloads`, async ({ page }) => {
    await page.goto(`/#${route}`);
    await expect(
      page.getByRole("main").getByRole("heading", { level: 1 }),
    ).toBeVisible();
    await page.reload();
    await expect(page).toHaveURL(new RegExp(`#${route}$`));
    await expect(
      page.getByRole("heading", { name: "That page wandered off." }),
    ).toHaveCount(0);
  });
}

test("collection lab saves, filters, pages and resets real local state", async ({
  page,
}) => {
  await page.goto("/#playground");
  await page.getByRole("tab", { name: "Collection lab", exact: true }).click();
  const results = page.getByRole("region", {
    name: "Collection results",
    exact: true,
  });
  const actions = page.getByRole("toolbar", {
    name: "Collection actions",
    exact: true,
  });
  await expect(results.getByRole("heading", { level: 3 })).toHaveCount(3);
  await page
    .getByRole("navigation", { name: "Collection pages", exact: true })
    .getByRole("button", { name: "Next", exact: true })
    .click();
  const save = results.getByRole("button", {
    name: "Save Focus Timer",
    exact: true,
  });
  await save.click();
  await expect(save).toHaveAttribute("aria-pressed", "true");
  await actions
    .getByRole("button", { name: "Saved only", exact: true })
    .click();
  await expect(results.getByRole("heading", { level: 3 })).toHaveCount(2);
  await results
    .getByRole("button", { name: "Save Focus Timer", exact: true })
    .click();
  await expect(results).toBeFocused();
  await expect(results.getByRole("heading", { level: 3 })).toHaveCount(1);
  await page
    .getByRole("group", { name: "Collection layout", exact: true })
    .getByRole("button", { name: "List", exact: true })
    .click();
  await expect(results).toHaveAttribute("data-view", "list");
  await page
    .getByRole("searchbox", { name: "Search the collection", exact: true })
    .fill("does-not-exist");
  await expect(
    results.getByRole("heading", {
      name: "No projects on this shelf.",
      exact: true,
    }),
  ).toBeVisible();
  await actions
    .getByRole("button", { name: "Reset collection", exact: true })
    .click();
  await expect(
    page.getByRole("searchbox", { name: "Search the collection", exact: true }),
  ).toHaveValue("");
  await expect(results.getByRole("heading", { level: 3 })).toHaveCount(3);
  await expect(results).toHaveAttribute("data-view", "grid");
});

test("loading preview unmounts content, announces once and has no timer", async ({
  page,
}) => {
  await page.goto("/#playground");
  await page.getByRole("tab", { name: "Collection lab", exact: true }).click();
  const action = page
    .getByRole("toolbar", { name: "Collection actions", exact: true })
    .getByRole("button", { name: "Preview loading", exact: true });
  const results = page.getByRole("region", {
    name: "Collection results",
    exact: true,
  });
  await action.click();
  await expect(results).toHaveAttribute("aria-busy", "true");
  await expect(results.getByRole("button")).toHaveCount(0);
  await expect(results.getByRole("link")).toHaveCount(0);
  await expect(page.getByRole("status")).toHaveText(
    "Loading-state preview. Turn off Preview loading to show the collection.",
  );
  await action.click();
  await expect(results).toHaveAttribute("aria-busy", "false");
  await expect(results.getByRole("heading", { level: 3 })).toHaveCount(3);
});

test("toolbar arrows only move focus, support RTL, and honor vertical bounds", async ({
  page,
}) => {
  await page.goto("/#components/toolbar");
  const toolbar = page.getByRole("toolbar", {
    name: "Preview formatting",
    exact: true,
  });
  const bold = toolbar.getByRole("button", { name: "Bold", exact: true });
  const italic = toolbar.getByRole("button", { name: "Italic", exact: true });
  await bold.focus();
  await page.keyboard.press("ArrowRight");
  await expect(italic).toBeFocused();
  await expect(italic).toHaveAttribute("aria-pressed", "false");
  await page.keyboard.press("Space");
  await expect(italic).toHaveAttribute("aria-pressed", "true");
  await toolbar.evaluate((element) => {
    element.setAttribute("dir", "rtl");
  });
  await bold.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(italic).toBeFocused();
  await page
    .getByRole("combobox", { name: "Toolbar orientation", exact: true })
    .selectOption("vertical");
  await page
    .getByRole("switch", { name: "Loop toolbar focus", exact: true })
    .uncheck();
  await bold.focus();
  await page.keyboard.press("ArrowUp");
  await expect(bold).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(italic).toBeFocused();
  await page.keyboard.press("End");
  await expect(
    toolbar.getByRole("link", { name: "Toggle docs", exact: true }),
  ).toBeFocused();
});

test("toggle groups move focus without changing the selection", async ({
  page,
}) => {
  await page.goto("/#components/toggle-group");
  const group = page.getByRole("group", {
    name: "Text formatting",
    exact: true,
  });
  const bold = group.getByRole("button", { name: "Bold", exact: true });
  const italic = group.getByRole("button", { name: "Italic", exact: true });
  await bold.focus();
  await page.keyboard.press("ArrowRight");
  await expect(italic).toBeFocused();
  await expect(italic).toHaveAttribute("aria-pressed", "false");
  await page.keyboard.press("Enter");
  await expect(italic).toHaveAttribute("aria-pressed", "true");
  await expect(bold).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Home");
  await expect(bold).toBeFocused();
});

test("native accordion keeps one disclosure open and works with the keyboard", async ({
  page,
}) => {
  await page.goto("/#components/accordion");
  const details = page.locator(".preview-content details");
  await expect(details.nth(0)).toHaveAttribute("open", "");
  await details.nth(1).locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(details.nth(1)).toHaveAttribute("open", "");
  await expect(details.nth(0)).not.toHaveAttribute("open", "");
  await page.keyboard.press("Space");
  await expect(details.nth(1)).not.toHaveAttribute("open", "");
});

test("avatar fallback survives an error and recovers with a new source", async ({
  page,
}) => {
  await page.goto("/#components/avatar");
  const avatar = page.getByRole("img", { name: "Demo teammate", exact: true });
  await expect(avatar.locator("img")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Break avatar image", exact: true })
    .click();
  await expect(avatar.locator("img")).toHaveCount(0);
  await expect(avatar).toContainText("FL");
  await page
    .getByRole("button", { name: "Restore avatar image", exact: true })
    .click();
  await expect(avatar.locator("img")).toHaveAttribute(
    "src",
    /^data:image\/svg\+xml/,
  );
});

test("reduced motion stops the spinner without hiding its status", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  await page.goto("/#components/spinner");
  const spinner = page.getByRole("status");
  await expect(spinner).toHaveText("Loading preview");
  expect(
    await spinner.evaluate(
      (element) => getComputedStyle(element, "::before").animationName,
    ),
  ).toBe("none");
  await page.goto("/#components/toggle");
  const toggle = page.getByRole("button", {
    name: "Save example",
    exact: true,
  });
  await toggle.focus();
  await page.keyboard.press("Space");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(toggle).toHaveCSS("outline-style", "solid");
});

for (const width of [320, 390, 768, 1440]) {
  test(`collection grid, list and loading layout fit ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#playground");
    await page
      .getByRole("tab", { name: "Collection lab", exact: true })
      .click();
    for (const layout of ["Grid", "List"]) {
      await page
        .getByRole("group", { name: "Collection layout", exact: true })
        .getByRole("button", { name: layout, exact: true })
        .click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
      ).toBe(true);
    }
    await page
      .getByRole("button", { name: "Preview loading", exact: true })
      .click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
    ).toBe(true);
  });
}

test("icon action CSS keeps square sizes, loading visibility and consumer overrides", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#components/icon-button");
  const action = page.getByRole("button", { name: "Add a spark", exact: true });
  await expect(action).toBeVisible();
  // Isolate the static CSS states here; unit tests cover prop-to-DOM mapping.
  for (const size of ["sm", "md", "lg"] as const) {
    await action.evaluate((element, value) => {
      element.setAttribute("data-size", value);
    }, size);
    const rect = await action.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      return { width: bounds.width, height: bounds.height };
    });
    expect(rect.width).toBeGreaterThan(0);
    expect(rect.width).toBeCloseTo(rect.height, 4);
  }
  await action.evaluate((element) => {
    element.setAttribute("data-loading", "true");
  });
  expect(
    await action.evaluate(
      (element) => getComputedStyle(element, "::after").animationName,
    ),
  ).toBe("none");
  await expect(action.locator("span").first()).toHaveCSS("opacity", "0");
  await expect(action).toHaveCSS("transition-property", "none");
  await action.evaluate((element) => {
    element.removeAttribute("data-loading");
    element.setAttribute("data-variant", "outline");
    element.classList.add("flux-action-override");
  });
  await page.addStyleTag({
    content: ".flux-action-override { background-color: rgb(1, 2, 3); }",
  });
  await expect(action).toHaveCSS("background-color", "rgb(1, 2, 3)");
});

test("toolbar pressed styling survives hover and its native divider follows orientation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#components/toolbar");
  const toolbar = page.getByRole("toolbar", {
    name: "Preview formatting",
    exact: true,
  });
  const bold = toolbar.getByRole("button", { name: "Bold", exact: true });
  await bold.click();
  await expect(bold).toHaveAttribute("aria-pressed", "true");
  const background = await bold.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  expect(background).not.toBe("rgba(0, 0, 0, 0)");
  await bold.hover();
  await expect(bold).toHaveCSS("background-color", background);
  const divider = toolbar.locator("hr");
  await expect(divider).toHaveAttribute("role", "none");
  await expect(divider).toHaveAttribute("data-orientation", "vertical");
  await page
    .getByRole("combobox", { name: "Toolbar orientation", exact: true })
    .selectOption("vertical");
  await expect(divider).toHaveAttribute("data-orientation", "horizontal");
});

test("icons browser searches intent metadata and changes its presentation", async ({
  page,
}) => {
  await page.goto("/#icons");
  await expect(
    page.getByRole("heading", { level: 1, name: "Icons that speak Flux." }),
  ).toBeVisible();
  const filter = page.getByRole("searchbox", {
    name: "Filter Flux icons",
    exact: true,
  });
  await page.keyboard.press("/");
  await expect(filter).toBeFocused();
  await filter.fill("settings");
  await expect(
    page.getByRole("button", { name: /Sliders actions/ }),
  ).toBeVisible();
  await expect(page.getByRole("status").first()).toContainText("1 icon");
  await page.getByRole("button", { name: /Sliders actions/ }).click();
  await expect(
    page.getByRole("region", { name: "SlidersIcon import" }),
  ).toContainText("SlidersIcon");
  await page
    .getByRole("group", { name: "Icon preview size", exact: true })
    .getByRole("button", { name: "32", exact: true })
    .click();
  await page
    .getByRole("group", { name: "Icon gallery view", exact: true })
    .getByRole("button", { name: "List", exact: true })
    .click();
  await expect(page.locator(".icon-gallery")).toHaveAttribute(
    "data-view",
    "list",
  );
});

test("identity lab redraws Flux Display and reports unsupported glyphs", async ({
  page,
}) => {
  await page.goto("/#identity");
  await expect(
    page.getByRole("heading", { level: 1, name: "Drawn for the system." }),
  ).toBeVisible();
  const specimen = page.getByLabel("Specimen", { exact: true });
  await specimen.fill("Build lighter");
  await expect(page.locator(".display-specimen")).toHaveAttribute(
    "aria-label",
    "BUILD LIGHTER",
  );
  await specimen.fill("Café");
  await expect(page.getByRole("status")).toContainText("Not drawn yet: É");
  await expect(
    page.getByRole("link", { name: /Browse all 64 icons/ }),
  ).toHaveAttribute("href", "#icons");
});
