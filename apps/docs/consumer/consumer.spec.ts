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
    await expect(page.locator("[inert], dialog[open]")).toHaveCount(0);
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
