import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const width of [320, 390, 1280]) {
  test(`automatic Tabs menu, keyboard, selection and no scrolling at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/#components/tabs");
    const preview = page.locator(".preview-content");
    const list = preview.getByRole("tablist");
    const trigger = preview.getByRole("button", { name: "More tabs" });
    await expect(trigger).toBeVisible();
    await expect(list).toHaveCSS("overflow-x", "hidden");
    expect(
      await list.evaluate((node) => node.scrollWidth <= node.clientWidth + 1),
    ).toBe(true);
    expect(
      await trigger.evaluate((node) => node.closest('[role="tablist"]')),
    ).toBeNull();
    await trigger.focus();
    await trigger.press("ArrowDown");
    const menu = preview.getByRole("menu");
    await expect(menu).toBeVisible();
    expect(await menu.getByRole("menuitem").allTextContents()).toEqual(
      await list.locator("[data-flux-tab-overflowed]").allTextContents(),
    );
    const billing = menu.getByRole("menuitem", { name: "Billing" });
    if (await billing.count()) await expect(billing).toBeDisabled();
    await page.keyboard.press("End");
    await expect(menu.getByRole("menuitem", { name: "History" })).toBeFocused();
    await page.keyboard.press("Home");
    await page.keyboard.press("h");
    await expect(menu.getByRole("menuitem", { name: "History" })).toBeFocused();
    await page.keyboard.press("Enter");
    const history = list.getByRole("tab", { name: "History", exact: true });
    await expect(history).toHaveAttribute("aria-selected", "true");
    await expect(history).toBeFocused();
    await expect(history).toBeInViewport();
    await expect(
      preview.getByRole("tabpanel", { name: "History", exact: true }),
    ).toBeVisible();
    expect(
      await list.evaluate((node) => node.scrollWidth <= node.clientWidth + 1),
    ).toBe(true);
    await trigger.click();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
    expect(
      (await new AxeBuilder({ page }).include(".preview-content").analyze())
        .violations,
    ).toEqual([]);
  });
}

test("resize focus, restoring tabs, RTL and original click cancellation", async ({
  page,
}) => {
  await page.goto("/#components/tabs");
  const preview = page.locator(".preview-content");
  const list = preview.getByRole("tablist");
  const trigger = preview.getByRole("button", { name: "More tabs" });
  await list.locator("..").evaluate((node) => {
    node.setAttribute("style", "width: 1800px");
  });
  await expect(trigger).toBeHidden();
  await expect(list.getByRole("tab")).toHaveCount(10);
  // Manual focus does not select until a key is pressed.
  await list.getByRole("tab", { name: "History", exact: true }).focus();
  await list.locator("..").evaluate((node) => {
    node.setAttribute("style", "width: 250px");
  });
  await expect(trigger).toBeFocused();
  await trigger.click();
  await list
    .locator('[data-flux-tab-value="history"]')
    .evaluate((node) =>
      node.addEventListener("click", (event) => event.preventDefault()),
    );
  await preview.getByRole("menuitem", { name: "History", exact: true }).click();
  await expect(
    list.getByRole("tab", { name: "Overview", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await list.locator("..").evaluate((node) => {
    node.setAttribute("style", "width: 1800px");
  });
  await expect(trigger).toBeHidden();
  await expect(
    list.getByRole("tab", { name: "Overview", exact: true }),
  ).toBeFocused();
  await list.evaluate((node) => node.setAttribute("dir", "rtl"));
  await list
    .getByRole("tab", { name: "Overview", exact: true })
    .press("ArrowLeft");
  await expect(
    list.getByRole("tab", { name: "Activity", exact: true }),
  ).toBeFocused();
  await list.getByRole("tab", { name: "Activity", exact: true }).press("Home");
  await expect(
    list.getByRole("tab", { name: "Overview", exact: true }),
  ).toBeFocused();
  await list.locator("..").evaluate((node) => {
    node.removeAttribute("style");
  });
});

test("native-scroll fallback and reduced-motion panel entrance", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "ResizeObserver", { value: undefined });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#components/tabs");
  const preview = page.locator(".preview-content");
  const list = preview.getByRole("tablist");
  await expect(list).not.toHaveAttribute("data-flux-tabs-managed");
  await expect(list).toHaveCSS("overflow-x", "auto");
  await expect(list.getByRole("tab")).toHaveCount(10);
  expect(
    await list.evaluate((node) => node.scrollWidth > node.clientWidth),
  ).toBe(true);
  await expect(preview.getByRole("button", { name: "More tabs" })).toHaveCount(
    0,
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  expect(
    await preview
      .getByRole("tabpanel")
      .evaluate((node) => getComputedStyle(node).animationName),
  ).not.toBe("none");
  expect(
    await list
      .getByRole("tab")
      .first()
      .evaluate((node) => getComputedStyle(node).transitionDuration),
  ).not.toBe("0s");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(preview.getByRole("tabpanel")).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(preview.getByRole("tabpanel")).toHaveCSS("transform", "none");
  await expect(list.getByRole("tab").first()).toHaveCSS(
    "transition-duration",
    "0s",
  );
  await page.emulateMedia({ forcedColors: "active" });
  await expect(list).toHaveCSS("scrollbar-color", "auto");
});

test("oversized selected labels remain reachable without scrollable overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/#components/tabs");
  const preview = page.locator(".preview-content");
  const list = preview.getByRole("tablist");
  const trigger = preview.getByRole("button", { name: "More tabs" });
  await trigger.click();
  await preview
    .getByRole("menuitem", { name: "International administration settings" })
    .click();
  const selected = list.getByRole("tab", {
    name: "International administration settings",
  });
  await expect(selected).toHaveAttribute("aria-selected", "true");
  await expect(selected).toBeFocused();
  await expect(selected).toBeInViewport();
  await expect(trigger).toBeInViewport();
  expect(
    await list.evaluate((node) => node.scrollWidth <= node.clientWidth + 1),
  ).toBe(true);
  await list.evaluate((node) => {
    node.scrollLeft = 100;
  });
  expect(await list.evaluate((node) => node.scrollLeft)).toBe(0);
});
