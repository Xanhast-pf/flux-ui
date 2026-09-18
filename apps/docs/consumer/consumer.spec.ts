import { expect, test } from "@playwright/test";

for (const theme of ["light", "dark"]) {
  test(`built styles and nested contracts in ${theme}`, async ({ page }) => {
    await page.goto("/");
    await page
      .locator("html")
      .evaluate(
        (element, value) => element.setAttribute("data-flux-theme", value),
        theme,
      );
    await expect(page.getByTestId("surface")).toHaveCSS("padding", "16px");
    await expect(page.getByTestId("emphasis")).toHaveCSS(
      "font-style",
      "italic",
    );
    await expect(page.getByTestId("emphasis")).toHaveCSS(
      "text-decoration-line",
      "underline",
    );
    await expect(page.getByRole("img", { name: "Flux mark" })).toBeVisible();
    const inner = page.getByRole("tablist", { name: "Inner tabs" });
    await expect(inner).toHaveCSS("flex-direction", "row");
    const first = inner.getByRole("tab", { name: "Inner one" });
    await expect(first).toHaveCSS("min-height", "40px");
    await expect(first).toHaveCSS("border-bottom-width", "2px");
    await expect(first).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await first.focus();
    await page.keyboard.press("ArrowRight");
    await expect(inner.getByRole("tab", { name: "Inner two" })).toBeFocused();
    await expect(
      page.getByRole("tab", { name: "Outer", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    const label = page.getByText("Enabled inner", { exact: true });
    const referenceColor = await page
      .getByText("Enabled reference", { exact: true })
      .evaluate((element) => getComputedStyle(element).color);
    await expect(label).toHaveCSS("color", referenceColor);
    await expect(
      page.getByRole("textbox", { name: "Enabled inner" }),
    ).toBeEnabled();
    await expect(
      page.getByRole("textbox", { name: "Disabled outer" }),
    ).not.toHaveAttribute("aria-describedby");
  });
}
test("hidden components cannot display or receive keyboard focus; until-found still works", async ({
  page,
}) => {
  await page.goto("/");
  for (const name of ["stack", "inline", "grid", "field", "avatar", "box"]) {
    const target = page.getByTestId(`hidden-${name}`);
    await expect(target).toHaveCSS("display", "none");
    await target.locator("button").evaluate((element) => element.focus());
    await expect(target.locator("button")).not.toBeFocused();
  }
  const findable = page.locator("#findable");
  await findable.evaluate((element) => {
    element.setAttribute("hidden", "until-found");
  });
  await expect(findable).toHaveAttribute("hidden", "until-found");
  await expect(findable).toHaveCSS("content-visibility", "hidden");
  await page.evaluate(() => {
    location.hash = "findable";
  });
  await expect(findable).not.toHaveAttribute("hidden");
  await expect(page.getByText("Findable hidden content")).toBeVisible();
});
for (const width of [320, 768, 1440]) {
  test(`public Sidebar is non-modal and in flow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Toggle sidebar" });
    await toggle.click();
    const sidebar = page.getByRole("complementary", {
      name: "Consumer navigation",
    });
    await expect(sidebar).toBeVisible();
    const panel = await sidebar.boundingBox();
    const content = await page.getByTestId("consumer-content").boundingBox();
    expect(panel).not.toBeNull();
    expect(content).not.toBeNull();
    if (panel === null || content === null)
      throw new Error("Consumer layout bounds missing.");
    if (width < 768)
      expect(content.y).toBeGreaterThanOrEqual(panel.y + panel.height - 1);
    else expect(content.x).toBeGreaterThanOrEqual(panel.x + panel.width - 1);
    await page
      .getByRole("textbox", { name: "Remembered filter" })
      .fill("preserved");
    await page.getByRole("button", { name: "Change page" }).click();
    await expect(
      page.getByRole("heading", { name: "Components", exact: true }),
    ).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("button", { name: "Page action 0" }).click();
    await expect(
      page.getByRole("button", { name: "Page action 1" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(sidebar).toBeVisible();
    // Hidden Tabs items are intentionally inert; visible page content must
    // remain interactive while the non-modal Sidebar is open.
    for (const element of await page.locator("[inert]").all()) {
      await expect(element).toBeHidden();
    }
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await page.getByRole("button", { name: "Close sidebar" }).click();
    await expect(toggle).toBeFocused();
    await expect(sidebar).not.toBeVisible();
    await toggle.click();
    await expect(
      page.getByRole("textbox", { name: "Remembered filter" }),
    ).toHaveValue("preserved");
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("Sidebar stacks in a narrow container even on a wide screen", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  const panel = page.getByRole("complementary", {
    name: "Consumer navigation",
  });
  await panel.evaluate((element) => {
    const layout = element.parentElement;
    if (layout === null) throw new Error("Missing consumer layout.");
    layout.style.width = "360px";
  });
  const panelBounds = await panel.boundingBox();
  const contentBounds = await page
    .getByTestId("consumer-content")
    .boundingBox();
  if (panelBounds === null || contentBounds === null)
    throw new Error("Missing consumer bounds.");
  expect(panelBounds.width).toBeLessThanOrEqual(361);
  expect(contentBounds.y).toBeGreaterThanOrEqual(
    panelBounds.y + panelBounds.height - 1,
  );
});

test("display-authoring public roots preserve hidden, including interactive controls", async ({
  page,
}) => {
  await page.goto("/");
  const roots = page.locator("[data-hidden-contract]");
  expect(await roots.count()).toBeGreaterThanOrEqual(12);
  for (const target of await roots.all()) {
    await expect(target).toHaveCSS("display", "none");
    await target.evaluate((element) => {
      if (element instanceof HTMLElement) element.focus();
      element.querySelector<HTMLElement>("button, input, [tabindex]")?.focus();
    });
    expect(
      await target.evaluate(
        (element) =>
          element === document.activeElement ||
          element.contains(document.activeElement),
      ),
    ).toBe(false);
    await target.evaluate((element) => element.removeAttribute("hidden"));
    await expect(target).not.toHaveCSS("display", "none");
    await target.evaluate((element) => element.setAttribute("hidden", ""));
  }
});
for (const kind of ["dialog", "drawer"]) {
  test(`built ${kind} is named through public wrappers and restores focus`, async ({
    page,
  }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: `Open wrapped ${kind}` });
    await trigger.click();
    const popup = page.getByRole("dialog", { name: `Wrapped public ${kind}` });
    await expect(popup).toBeVisible();
    await expect(popup).toHaveAccessibleDescription(
      "Its description survives Flux wrappers.",
    );
    await popup.getByRole("button", { name: `Close wrapped ${kind}` }).click();
    await expect(popup).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });
}
test("built advanced exports preserve numeric control, chart and resize semantics", async ({
  page,
}) => {
  await page.goto("/");
  const knob = page.getByRole("slider", { name: "Consumer gain" });
  await knob.focus();
  await page.keyboard.press("ArrowUp");
  await expect(knob).toHaveAttribute("aria-valuenow", "51");
  await expect(
    page.getByRole("spinbutton", { name: "Consumer exact gain" }),
  ).toHaveValue("51");
  const verticalSlider = page.getByRole("slider", {
    name: "Consumer vertical slider",
  });
  await verticalSlider.focus();
  await page.keyboard.press("ArrowUp");
  await expect(knob).toHaveAttribute("aria-valuenow", "52");
  const bounds = await verticalSlider.boundingBox();
  if (!bounds) throw new Error("Vertical Slider has no visible geometry.");
  expect(bounds.height).toBeGreaterThan(bounds.width);
  const cursor = page.getByRole("slider", {
    name: "Consumer chart data cursor",
  });
  await cursor.focus();
  await page.keyboard.press("ArrowRight");
  await expect(cursor).toHaveAttribute("aria-valuetext", /No value/);
  await page.keyboard.press("End");
  await expect(cursor).toHaveAttribute("aria-valuetext", /30/);
  const separator = page.getByRole("separator", {
    name: "Consumer pane sizes",
  });
  await separator.focus();
  await page.keyboard.press("ArrowRight");
  await expect(separator).toHaveAttribute("aria-valuenow", "55");
  const source = page.getByRole("region", { name: "Safe highlighted source" });
  await expect(source.locator("code")).toHaveText(
    'const literal = "<img src=x onerror=alert(1)>";',
  );
  await expect(source.locator("img, script")).toHaveCount(0);
  expect(await source.locator("[data-token]").count()).toBeGreaterThan(0);
});
test("built DataTable windows actual rows, preserves selection and pins focused input", async ({
  page,
}) => {
  await page.goto("/");
  const table = page.getByRole("table", { name: /Consumer dataset/ });
  await expect(table).toHaveAttribute("aria-rowcount", "10001");
  expect(await table.locator("[data-row-id]").count()).toBeLessThan(30);
  const selection = table.getByRole("checkbox", {
    name: "Select row item-0",
    exact: true,
  });
  await selection.check();
  const scrollport = page.getByRole("region", {
    name: "Consumer dataset scrollable rows",
  });
  await scrollport.evaluate((element) => {
    element.scrollTop = 40_000;
  });
  await expect(table.locator('[data-row-id="item-1000"]')).toHaveCount(1);
  await expect(selection).toBeFocused();
  expect(await table.locator("[data-row-id]").count()).toBeLessThan(31);
  await scrollport.evaluate((element) => {
    element.scrollTop = 0;
  });
  await table.getByRole("button", { name: /Value/ }).click();
  await expect(selection).toBeChecked();
});
test("built Tabs uses RTL horizontal keyboard direction", async ({ page }) => {
  await page.goto("/");
  const list = page.getByRole("tablist", { name: "RTL tabs" });
  await list.getByRole("tab", { name: "RTL one" }).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(list.getByRole("tab", { name: "RTL two" })).toBeFocused();
});

test("built Tabs excludes hidden and inert targets without stealing shortcuts", async ({
  page,
}) => {
  await page.goto("/");
  const list = page.getByRole("tablist", { name: "Inner tabs" });
  const first = list.getByRole("tab", { name: "Inner one" });
  const second = list.locator('[role="tab"][data-flux-tab-value="inner-two"]');
  await first.focus();
  await page.keyboard.press("Control+ArrowRight");
  await expect(first).toBeFocused();
  for (const attribute of ["hidden", "inert"]) {
    await second.evaluate((element, name) => {
      element.setAttribute(name, "");
    }, attribute);
    await page.keyboard.press("ArrowRight");
    await expect(first).toBeFocused();
    await second.evaluate((element, name) => {
      element.removeAttribute(name);
    }, attribute);
  }
  await page.keyboard.press("ArrowRight");
  await expect(second).toBeFocused();
});

test("built Knob ignores cancellation from another pointer", async ({
  page,
}) => {
  await page.goto("/");
  const knob = page.getByRole("slider", { name: "Consumer gain" });
  await knob.scrollIntoViewIfNeeded();
  const bounds = await knob.boundingBox();
  if (bounds === null) throw new Error("Missing knob bounds.");
  await knob.evaluate((element) => {
    element.addEventListener(
      "gotpointercapture",
      (event) => {
        if (event instanceof PointerEvent)
          element.setAttribute("data-test-pointer", String(event.pointerId));
      },
      { once: true },
    );
  });
  const x = bounds.x + bounds.width / 2;
  const y = bounds.y + bounds.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  try {
    await page.mouse.move(x, y - 16);
    await expect(knob).toHaveAttribute("aria-valuenow", "60");
    await expect(knob).toHaveAttribute("data-test-pointer", /\d+/);
    await knob.evaluate((element) => {
      const id = Number(element.getAttribute("data-test-pointer"));
      element.dispatchEvent(
        new PointerEvent("pointercancel", {
          bubbles: true,
          pointerId: id + 100,
          isPrimary: false,
        }),
      );
    });
    await expect(knob).toHaveAttribute("aria-valuenow", "60");
    await page.mouse.move(x, y - 32);
    await expect(knob).toHaveAttribute("aria-valuenow", "70");
  } finally {
    await page.mouse.up();
  }
});

test("built Box keeps edge precedence while broad padding changes", async ({
  page,
}) => {
  await page.goto("/");
  const box = page.getByTestId("edge-padding");
  await expect(box).toHaveCSS("padding-block-start", "16px");
  await expect(box).toHaveCSS("padding-inline-end", "8px");
  await page.getByRole("button", { name: "Change padding fixture" }).click();
  await expect(box).toHaveCSS("padding-block-start", "24px");
  await expect(box).toHaveCSS("padding-inline-end", "8px");
  const styled = page.getByTestId("style-padding");
  await expect(styled).toHaveCSS("padding-block-start", "48px");
  await expect(styled).toHaveCSS("padding-inline-end", "48px");
});
