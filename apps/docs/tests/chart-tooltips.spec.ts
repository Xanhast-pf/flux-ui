import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Chart composes Card, Legend and hover Tooltip without owning them", async ({
  page,
}) => {
  await page.goto("/#components/chart");

  const preview = page.locator(".preview-content");
  const cursor = preview.getByRole("slider", {
    name: "Cash flow · illustrative data data cursor",
  });
  const tooltip = preview.locator("[data-chart-tooltip='true']");
  const inflow = preview.getByRole("button", { name: "Illustrative inflow" });

  await expect(
    preview.getByRole("heading", { name: "Cash flow" }),
  ).toBeVisible();
  await expect(cursor).toBeVisible();
  await expect(cursor.locator("figure")).toHaveCount(0);
  await expect(tooltip).toHaveCount(0);
  await expect(inflow).toHaveAttribute("aria-pressed", "true");

  await cursor.hover({ position: { x: 120, y: 120 } });
  await expect(tooltip).toHaveCount(1);
  await expect(tooltip).toHaveAttribute("aria-hidden", "true");
  await expect(tooltip).toContainText("Illustrative");
  expect(
    await tooltip.evaluate((node) => getComputedStyle(node).pointerEvents),
  ).toBe("none");

  await preview.getByRole("heading", { name: "Cash flow" }).hover();
  await expect(tooltip).toHaveCount(0);

  await preview
    .getByRole("combobox", { name: "Chart type" })
    .selectOption("bar");
  const chartBounds = await cursor.boundingBox();
  expect(chartBounds).not.toBeNull();
  if (chartBounds === null) return;
  const firstBucketX = chartBounds.x + (chartBounds.width * 80) / 640;
  const middleY = chartBounds.y + chartBounds.height / 2;

  await cursor.dispatchEvent("pointermove", {
    clientX: firstBucketX,
    clientY: middleY,
  });
  await expect(tooltip).toContainText("Illustrative inflow");
  await expect(tooltip).toContainText("Illustrative outflow");

  const outflowShape = cursor.locator("[data-chart-series='1'] path").last();
  await outflowShape.dispatchEvent("pointermove", {
    clientX: firstBucketX,
    clientY: middleY,
  });
  await expect(tooltip).toContainText("Illustrative outflow");
  await expect(tooltip).not.toContainText("Illustrative inflow");
  await expect(cursor.locator("[data-chart-series='0']")).toHaveAttribute(
    "data-muted",
    "true",
  );
  await expect(cursor.locator("circle")).toHaveCount(1);

  await cursor.dispatchEvent("pointermove", {
    clientX: chartBounds.x + chartBounds.width - 1,
    clientY: chartBounds.y + 4,
  });
  await expect(tooltip).toHaveAttribute("data-align", "end");
  await expect(tooltip).toHaveAttribute("data-side", "bottom");
  const tooltipBounds = await tooltip.boundingBox();
  expect(tooltipBounds).not.toBeNull();
  if (tooltipBounds !== null) {
    expect(tooltipBounds.width).toBeGreaterThan(80);
    expect(tooltipBounds.x).toBeGreaterThanOrEqual(chartBounds.x - 1);
    expect(tooltipBounds.x + tooltipBounds.width).toBeLessThanOrEqual(
      chartBounds.x + chartBounds.width + 1,
    );
  }

  await inflow.click();
  await expect(inflow).toHaveAttribute("aria-pressed", "false");
  await expect(cursor).toHaveAttribute(
    "aria-valuetext",
    /Illustrative outflow/u,
  );

  await inflow.click();
  await cursor.focus();
  await page.keyboard.press("ArrowDown");
  await expect(cursor).toHaveAttribute(
    "aria-valuetext",
    /Illustrative outflow/u,
  );

  expect(
    (await new AxeBuilder({ page }).include(".preview-content").analyze())
      .violations,
  ).toEqual([]);
});

test("PieChart composes toggleable Legend visibility with click Tooltip", async ({
  page,
}) => {
  await page.goto("/#components/pie-chart");

  const preview = page.locator(".preview-content");
  const cursor = preview.getByRole("slider", {
    name: "Revenue by product data cursor",
  });
  const tooltip = preview.locator("[data-chart-tooltip='true']");
  const legend = preview.getByRole("list", { name: "Chart legend" });

  await expect(legend.getByRole("listitem")).toHaveCount(3);
  const core = legend.getByRole("button", { name: "Core" });
  await expect(core).toHaveAttribute("aria-pressed", "true");
  await expect(cursor).toHaveAttribute("aria-valuetext", "Core: $52k, 52%");
  await expect(tooltip).toHaveCount(0);

  await core.click();
  await expect(core).toHaveAttribute("aria-pressed", "false");
  await expect(cursor).toHaveAttribute("aria-valuetext", "Pro: $31k, 64.6%");

  const box = await cursor.boundingBox();
  expect(box).not.toBeNull();
  if (box === null) return;
  await cursor.click({
    position: { x: box.width / 2, y: box.height / 2 },
  });

  await expect(tooltip).toHaveCount(1);
  await expect(tooltip).toHaveAttribute("aria-hidden", "true");
  await expect(tooltip).toContainText(/Pro|Services/u);
  await expect(tooltip).toContainText(/\$\d+k/u);

  await cursor.focus();
  await page.keyboard.press("Escape");
  await expect(tooltip).toHaveCount(0);

  expect(
    (await new AxeBuilder({ page }).include(".preview-content").analyze())
      .violations,
  ).toEqual([]);
});

test("ChartLegend example composes controlled visibility with ChartTooltip", async ({
  page,
}) => {
  await page.goto("/#components/chart-legend");

  const preview = page.locator(".preview-content");
  const cursor = preview.getByRole("slider", { name: "Finance data cursor" });
  const revenue = preview.getByRole("button", { name: "Revenue" });
  const tooltip = preview.locator("[data-chart-tooltip='true']");

  await expect(revenue).toHaveAttribute("aria-pressed", "true");
  await expect(preview).toContainText("Visible: Revenue, Cost");

  await revenue.click();
  await expect(revenue).toHaveAttribute("aria-pressed", "false");
  await expect(preview).toContainText("Visible: Cost");
  await expect(cursor).toHaveAttribute(
    "aria-valuetext",
    "Cost: Quarter 1, $7k",
  );

  await cursor.hover({ position: { x: 120, y: 120 } });
  await expect(tooltip).toHaveCount(1);
  await expect(tooltip).toContainText("Cost");

  expect(
    (await new AxeBuilder({ page }).include(".preview-content").analyze())
      .violations,
  ).toEqual([]);
});

test("ChartTooltip example composes Legend, formatter data and trigger modes", async ({
  page,
}) => {
  await page.goto("/#components/chart-tooltip");

  const preview = page.locator(".preview-content");
  const trigger = preview.getByRole("combobox", { name: "Tooltip trigger" });
  const cursor = preview.getByRole("slider", { name: "Finance data cursor" });
  const tooltip = preview.locator("[data-chart-tooltip='true']");
  const legend = preview.getByRole("list", { name: "Chart legend" });

  await expect(legend.getByRole("listitem")).toHaveCount(2);
  await expect(legend.getByRole("button")).toHaveCount(0);

  await cursor.hover({ position: { x: 120, y: 120 } });
  await expect(tooltip).toHaveCount(1);
  await expect(tooltip).toContainText(/Quarter \d/u);
  await expect(tooltip).toContainText(/\$\d+k/u);

  await trigger.selectOption("click");
  await expect(tooltip).toHaveCount(0);

  const box = await cursor.boundingBox();
  expect(box).not.toBeNull();
  if (box === null) return;
  await cursor.click({
    position: { x: box.width / 3, y: box.height / 2 },
  });
  await expect(tooltip).toHaveCount(1);

  await preview.getByText(/legend, chart formatter/u).hover();
  await expect(tooltip).toHaveCount(1);

  await cursor.focus();
  await page.keyboard.press("Escape");
  await expect(tooltip).toHaveCount(0);

  expect(
    (await new AxeBuilder({ page }).include(".preview-content").analyze())
      .violations,
  ).toEqual([]);
});

test("ScatterChart shares Legend and hover Tooltip while keyboard series navigation stays intrinsic", async ({
  page,
}) => {
  await page.goto("/#components/scatter-chart");

  const preview = page.locator(".preview-content");
  const cursor = preview.getByRole("slider", {
    name: "Latency vs payload data cursor",
  });
  const tooltip = preview.locator("[data-chart-tooltip='true']");
  const legend = preview.getByRole("list", { name: "Chart legend" });

  await expect(legend.getByRole("listitem")).toHaveCount(2);
  await expect(tooltip).toHaveCount(0);

  await cursor.hover({ position: { x: 160, y: 120 } });
  await expect(tooltip).toHaveCount(1);
  await expect(tooltip).toContainText(/API|Worker/u);

  const scatterBounds = await cursor.boundingBox();
  expect(scatterBounds).not.toBeNull();
  if (scatterBounds === null) return;
  const leftX = scatterBounds.x + (scatterBounds.width * 80) / 640;
  await cursor.dispatchEvent("pointermove", {
    clientX: leftX,
    clientY: scatterBounds.y + (scatterBounds.height * 120) / 280,
  });
  await expect(tooltip).toContainText("API");
  await expect(tooltip).toContainText("Worker");

  const workerPoints = cursor.locator("[data-chart-series='1'] path");
  await workerPoints.dispatchEvent("pointermove", {
    clientX: leftX,
    clientY: scatterBounds.y + (scatterBounds.height * 248) / 280,
  });
  await expect(tooltip).toContainText("Worker");
  await expect(tooltip).not.toContainText("API");
  await expect(cursor.locator("[data-chart-series='0']")).toHaveAttribute(
    "data-muted",
    "true",
  );

  await preview.getByRole("heading", { name: "Latency vs payload" }).hover();
  await expect(tooltip).toHaveCount(0);

  await cursor.focus();
  await page.keyboard.press("ArrowUp");
  await expect(cursor).toHaveAttribute("aria-valuetext", /API/u);
  await page.keyboard.press("ArrowDown");
  await expect(cursor).toHaveAttribute("aria-valuetext", /Worker/u);

  expect(
    (await new AxeBuilder({ page }).include(".preview-content").analyze())
      .violations,
  ).toEqual([]);
});
