import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function expectPreviewAxeClean(page: Page) {
  expect(
    (await new AxeBuilder({ page }).include(".preview-content").analyze())
      .violations,
  ).toEqual([]);
}

test("native temporal pickers preserve civil-string and constraint semantics", async ({
  page,
}) => {
  for (const example of [
    {
      slug: "date-picker",
      type: "date",
      value: "2026-10-01",
      min: "2026-01-01",
      max: "2026-12-31",
    },
    {
      slug: "time-picker",
      type: "time",
      value: "14:30",
      min: "09:00",
      max: "18:00",
    },
    {
      slug: "date-time-picker",
      type: "datetime-local",
      value: "2026-10-01T14:30",
      min: "2026-10-01T09:00",
      max: "2026-10-01T18:00",
    },
  ]) {
    await page.goto(`/#components/${example.slug}`);
    const preview = page.locator(".preview-content");
    const input = preview.locator(`input[type="${example.type}"]`);
    await expect(input).toHaveCount(1);
    await expect(input).toHaveValue(example.value);
    await expect(input).toHaveAttribute("min", example.min);
    await expect(input).toHaveAttribute("max", example.max);
    expect(
      await input.evaluate(
        (element: HTMLInputElement) => element.validity.valid,
      ),
    ).toBe(true);
    await expectPreviewAxeClean(page);
  }
});

test("PieChart and ScatterChart expose keyboard-inspectable values", async ({
  page,
}) => {
  await page.goto("/#components/pie-chart");
  const pie = page
    .locator(".preview-content")
    .getByRole("slider", { name: "Revenue by product data cursor" });
  await expect(pie).toHaveAttribute("aria-valuetext", /Core: 52/u);
  await pie.focus();
  await page.keyboard.press("ArrowRight");
  await expect(pie).toHaveAttribute("aria-valuetext", /Pro: 31/u);
  await expectPreviewAxeClean(page);

  await page.goto("/#components/scatter-chart");
  const preview = page.locator(".preview-content");
  const scatter = preview.getByRole("slider", {
    name: "Latency vs payload data cursor",
  });
  await expect(scatter).toHaveAttribute("aria-valuetext", "API: 12, 82");
  await scatter.focus();
  await page.keyboard.press("ArrowRight");
  await expect(scatter).toHaveAttribute("aria-valuetext", "API: 24, 105");
  await preview.getByRole("button", { name: /Worker/u }).click();
  await expect(scatter).toHaveAttribute("aria-valuetext", "Worker: 10, 55");
  await expectPreviewAxeClean(page);
});

test("DataGrid preserves focus while editing, sorting and selecting in the browser", async ({
  page,
}) => {
  await page.goto("/#components/data-grid");
  const preview = page.locator(".preview-content");
  const grid = preview.getByRole("grid", { name: "Positions" });
  const aapl = grid.getByRole("gridcell", { name: "AAPL" });

  await expect(grid).toHaveAttribute("aria-readonly", "false");
  await expect(grid).toHaveAttribute("aria-multiselectable", "true");
  await expect(grid.getByRole("gridcell")).toHaveCount(12);
  await expect(
    grid.getByRole("row", { name: /MSFT 7 Pending/u }),
  ).toHaveAttribute("aria-selected", "true");

  await aapl.focus();
  await page.keyboard.press("ArrowRight");
  await expect(grid.getByRole("gridcell", { name: "12" })).toBeFocused();

  await page.keyboard.press("F2");
  const editor = grid.getByRole("spinbutton", {
    name: "Edit Quantity, row 1",
  });
  await expect(editor).toBeFocused();
  await editor.fill("14");
  await page.keyboard.press("Enter");

  const quantity = grid.getByRole("gridcell", { name: "14" });
  await expect(quantity).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(
    grid.getByRole("columnheader", { name: "Quantity ↑" }),
  ).toHaveAttribute("aria-sort", "ascending");
  await expect(quantity).toBeFocused();

  await page.keyboard.press("Space");
  await expect(
    grid.getByRole("row", { name: /AAPL 14 Open/u }),
  ).toHaveAttribute("aria-selected", "true");

  await page.keyboard.press("ArrowDown");
  await expect(quantity).toBeFocused();
  await page.keyboard.press("End");
  await expect(
    grid.getByRole("gridcell", { name: "Open" }).last(),
  ).toBeFocused();
  await page.keyboard.press("Control+Home");
  await expect(
    grid.locator(
      '[role="gridcell"][data-row-id="nvda"][data-column-id="symbol"]',
    ),
  ).toBeFocused();

  expect(await grid.locator('[role="gridcell"][tabindex="0"]').count()).toBe(1);
  await expectPreviewAxeClean(page);
});

test("Indicator stays decorative and ButtonGroup preserves native button focus", async ({
  page,
}) => {
  await page.goto("/#components/indicator");
  const indicatorPreview = page.locator(".preview-content");
  await expect(
    indicatorPreview.getByRole("button", {
      name: "Inbox, 4 unread messages",
    }),
  ).toBeVisible();
  const overlay = indicatorPreview.getByText("4");
  await expect(overlay).toHaveAttribute("aria-hidden", "true");
  await expectPreviewAxeClean(page);

  await page.goto("/#components/button-group");
  const preview = page.locator(".preview-content");
  const group = preview.getByRole("group", { name: "Document actions" });
  const save = group.getByRole("button", { name: "Save" });
  const exportButton = group.getByRole("button", { name: "Export" });
  await save.focus();
  await expect(save).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(exportButton).toBeFocused();
  await expectPreviewAxeClean(page);
});
