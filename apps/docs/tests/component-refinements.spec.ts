import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
const examples: Record<string, string> = {
  javascript: "console.log",
  typescript: "type Greeting",
  jsx: "<h1>",
  tsx: "GreetingProps",
  json: '"ready": true',
  css: ".card",
  scss: "$space",
  html: "<section",
  xml: "<?xml",
  yaml: "components:",
  bash: "#!/usr/bin/env bash",
  sql: "SELECT name",
  python: "def greet",
  rust: "fn main",
  go: "package main",
  java: "public class",
  c: "#include <stdio.h>",
  cpp: "#include <iostream>",
  markdown: "# Flux UI",
};
test("each advertised CodeBlock language shows and copies its own literal sample", async ({
  page,
}) => {
  await page.addInitScript(() => {
    let copied = "";
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        readText: () => Promise.resolve(copied),
        writeText: (text: string) => {
          copied = text;
          return Promise.resolve();
        },
      },
    });
  });
  await page.goto("/#components/code-block");
  const preview = page.locator(".preview-content");
  const selector = preview.getByRole("combobox", { name: "Source language" });
  await expect(selector.locator("option")).toHaveCount(
    Object.keys(examples).length,
  );
  for (const [language, expected] of Object.entries(examples)) {
    await selector.selectOption(language);
    const source = preview.locator(`code[data-language="${language}"]`);
    await expect(source).toContainText(expected);
    const literal = await source.textContent();
    await preview.getByRole("button", { name: "Copy code" }).click();
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe(literal);
  }
  await expect(preview.locator("pre section, pre script")).toHaveCount(0);
});
test("Toggle preview does not stretch to match the changing status sentence", async ({
  page,
}) => {
  await page.goto("/#components/toggle");
  const button = page
    .locator(".preview-content")
    .getByRole("button", { name: "Save example" });
  const before = await button.boundingBox();
  if (before === null) throw new Error("Toggle is not measurable.");
  await button.click();
  await expect(button).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(async () => (await button.boundingBox())?.width)
    .toBe(before.width);
  await button.click();
  await expect(button).toHaveAttribute("aria-pressed", "false");
  await expect
    .poll(async () => (await button.boundingBox())?.width)
    .toBe(before.width);
});
test("Slider and Knob previews demonstrate reset, sizing and native keyboard controls", async ({
  page,
}) => {
  await page.goto("/#components/slider");
  const preview = page.locator(".preview-content");
  await preview
    .getByRole("combobox", { name: "Slider orientation" })
    .selectOption("vertical");
  const slider = preview.getByRole("slider", { name: "Preview volume" });
  await expect(slider).toHaveAttribute("aria-orientation", "vertical");
  await slider.focus();
  await page.keyboard.press("ArrowUp");
  await expect(slider).toHaveValue("45");
  await slider.dblclick();
  await expect(slider).toHaveValue("40");
  await slider.focus();
  await page.keyboard.press("End");
  await expect(slider).toHaveValue("100");
  await preview.getByRole("button", { name: "Reset volume" }).click();
  await expect(slider).toHaveValue("40");
  await page.goto("/#components/knob");
  const knob = preview.getByRole("slider", { name: "Filter cutoff" });
  await preview.getByRole("combobox", { name: "Knob size" }).selectOption("lg");
  await expect(knob).toHaveAttribute("data-size", "lg");
  await preview
    .getByRole("spinbutton", { name: "Exact cutoff (Hz)" })
    .fill("2000");
  await knob.dblclick();
  await expect(knob).toHaveAttribute("aria-valuenow", "1000");
  expect(
    (await new AxeBuilder({ page }).include(".preview-content").analyze())
      .violations,
  ).toEqual([]);
});
test("Sidebar has a genuinely wide desktop preview and a separate compact overlay", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#components/sidebar");
  const preview = page.locator(".preview-content");
  await expect(preview.getByRole("status")).toHaveText(
    "Desktop sidebar: pushes adjacent content.",
  );
  await expect(
    preview.getByRole("complementary", { name: "Example navigation" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Compact preview", exact: true })
    .click();
  await expect(preview.getByRole("status")).toHaveText(
    "Mobile navigation: viewport overlay.",
  );
  await preview
    .getByRole("button", { name: "Toggle example navigation" })
    .click();
  const popup = page.getByRole("dialog", { name: "Example mobile navigation" });
  await expect(popup).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(popup).toBeHidden();
  await expect(
    preview.getByRole("button", { name: "Toggle example navigation" }),
  ).toBeFocused();
});
for (const width of [320, 390]) {
  test(`mobile navigation overlays the current viewport at ${width}px without a scroll jump`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 700 });
    await page.goto("/#components/card");
    await expect(page.locator(".preview-content")).toBeVisible();
    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    );
    const scroll = await page.evaluate(() => window.scrollY);
    expect(scroll).toBeGreaterThan(100);
    const trigger = page.getByRole("button", {
      name: "Toggle navigation",
      exact: true,
    });
    await trigger.click();
    const drawer = page.getByRole("dialog", {
      name: "Documentation",
      exact: true,
    });
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute("open", "");
    expect(await drawer.evaluate((node) => node.matches(":modal"))).toBe(true);
    expect(
      Math.abs((await page.evaluate(() => window.scrollY)) - scroll),
    ).toBeLessThanOrEqual(1);
    const bounds = await drawer.boundingBox();
    if (bounds === null)
      throw new Error("Navigation drawer is not measurable.");
    expect(bounds.y).toBeGreaterThanOrEqual(-1);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(701);
    await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
    expect(
      await drawer.evaluate((node) =>
        node.contains(node.ownerDocument.activeElement),
      ),
    ).toBe(true);
    // Native showModal() blocks background focus and pointer hit testing.
    await trigger.evaluate((node) => node.focus());
    await expect(trigger).not.toBeFocused();
    expect(
      await trigger.evaluate((node) => {
        const bounds = node.getBoundingClientRect();
        return node.contains(
          node.ownerDocument.elementFromPoint(
            bounds.x + bounds.width / 2,
            bounds.y + bounds.height / 2,
          ),
        );
      }),
    ).toBe(false);
    for (let index = 0; index < 6; index += 1) {
      await page.keyboard.press("Shift+Tab");
      // Chromium may visit browser controls between dialog tab stops.
      // Whenever the document owns focus, it must remain in the modal.
      expect(
        await drawer.evaluate((node) => {
          const document = node.ownerDocument;
          return !document.hasFocus() || node.contains(document.activeElement);
        }),
      ).toBe(true);
    }
    // These hash hrefs are SPA routes, not in-document skip links. Firefox
    // exposes them to axe's best-practice heuristic as missing fragment targets;
    // route activation itself is covered by the navigation journey tests.
    const axe = await new AxeBuilder({ page })
      .disableRules(["skip-link"])
      .analyze();
    expect(axe.violations).toEqual([]);
    const close = drawer.getByRole("button", { name: "Close navigation" });
    await close.focus();
    await expect(close).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await expect(trigger).toBeFocused();
    expect(
      Math.abs((await page.evaluate(() => window.scrollY)) - scroll),
    ).toBeLessThanOrEqual(1);
    await trigger.click();
    const boxLink = drawer.getByRole("link", { name: "Box", exact: true });
    await boxLink.focus();
    await expect(boxLink).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#components\/box$/u);
    await expect(drawer).toBeHidden();
    await expect(page.locator("main")).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    await expect(drawer).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/#components\/card$/u);
    await expect(drawer).toBeHidden();
    await expect(page.locator("main")).toBeFocused();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
    ).toBe(true);
  });
}
test("crossing the mobile breakpoint releases the modal and preserves desktop preference", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#components/card");
  const trigger = page.getByRole("button", {
    name: "Toggle navigation",
    exact: true,
  });
  await trigger.click();
  const sidebar = page.getByRole("complementary", {
    name: "Documentation sidebar",
  });
  await expect(sidebar).toBeVisible();
  await page.setViewportSize({ width: 390, height: 900 });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await expect(
    page.getByRole("dialog", { name: "Documentation", exact: true }),
  ).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator("dialog[open]")).toHaveCount(0);
  await expect(sidebar).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(trigger).toBeFocused();
  await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
  await page.getByRole("heading", { name: "Card", exact: true }).click();
});

test("the Tabs preview supports keyboard selection and accessible panels", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1000, height: 800 });
  await page.goto("/#components/tabs");
  const preview = page.locator(".preview-content");
  const list = preview.getByRole("tablist", {
    name: "Example project sections",
  });
  await list.getByRole("tab").first().focus();
  const lastName = await list
    .getByRole("tab", { disabled: false })
    .last()
    .textContent();
  await page.keyboard.press("End");
  const last = list.getByRole("tab", { name: lastName ?? "", exact: true });
  await expect(last).toBeFocused();
  await expect(last).toHaveAttribute("aria-selected", "true");
  await expect(
    preview.getByRole("tabpanel", { name: lastName ?? "", exact: true }),
  ).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).include(".preview-content").analyze())
      .violations,
  ).toEqual([]);
});
