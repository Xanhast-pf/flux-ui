import { expect, test } from "@playwright/test";
import { readdir, readFile } from "node:fs/promises";
import { components } from "../src/generated/components.js";
const directory = new URL("../src/perf/scenarios/", import.meta.url);
const files = (await readdir(directory)).filter((file) =>
  file.endsWith(".json"),
);
const dedicatedIds = new Set(files.map((file) => file.slice(0, -5)));
const previewFallbacks = components.filter(
  (component) => !dedicatedIds.has(component.slug),
);
for (const file of files) {
  // File names are the discovered scenario IDs; browser assertions validate the matching manifest.
  const id = file.slice(0, -5);
  test(`performance fixture ${id} publishes finite bounded work`, async ({
    page,
  }) => {
    const source = await readFile(new URL(file, directory), "utf8");
    expect(source).toContain(`"id": "${id}"`);
    await page.goto(`/?perf=1&scenario=${id}&variant=flux&count=100`);
    await page.waitForFunction(() => window.__FLUX_PERF_RESULT__ !== undefined);
    const result = await page.evaluate(() => window.__FLUX_PERF_RESULT__);
    expect(result?.scenario).toBe(id);
    expect(result?.fixtureRevision).toBeGreaterThan(0);
    expect(result?.domNodes).toBeGreaterThan(0);
    for (const key of [
      "mountMs",
      "mountToFrameMs",
      "updateMs",
      "updateToFrameMs",
      "unmountMs",
    ] as const)
      expect(Number.isFinite(result?.[key])).toBe(true);
  });
}

test("representative preview workloads cover every remaining public component", async ({
  page,
}) => {
  test.setTimeout(180_000);

  for (const component of previewFallbacks) {
    await page.goto(`/?perf=1&scenario=${component.slug}&variant=flux&count=1`);
    await page.waitForFunction(() => window.__FLUX_PERF_RESULT__ !== undefined);
    const result = await page.evaluate(() => window.__FLUX_PERF_RESULT__);

    expect(result?.scenario).toBe(component.slug);
    expect(result?.count).toBe(1);
    expect(result?.variant).toBe("flux");
    expect(result?.fixtureRevision).toBe(1);
    expect(result?.domNodes, component.slug).toBeGreaterThan(0);
    for (const key of [
      "mountMs",
      "mountToFrameMs",
      "updateMs",
      "updateToFrameMs",
      "unmountMs",
    ] as const)
      expect(Number.isFinite(result?.[key])).toBe(true);
  }
});

test("roadmap data-heavy workloads stay finite at their source bounds", async ({
  page,
}) => {
  test.setTimeout(60_000);
  const scenarios = [
    ["data-grid", 2_000],
    ["pie-chart", 256],
    ["scatter-chart", 20_000],
  ] as const;

  for (const [scenario, count] of scenarios) {
    await page.goto(
      `/?perf=1&scenario=${scenario}&variant=flux&count=${count}`,
    );
    await page.waitForFunction(() => window.__FLUX_PERF_RESULT__ !== undefined);
    const result = await page.evaluate(() => window.__FLUX_PERF_RESULT__);
    expect(result?.scenario).toBe(scenario);
    expect(result?.count).toBe(count);
    expect(result?.domNodes).toBeGreaterThan(0);
    for (const key of [
      "mountMs",
      "mountToFrameMs",
      "updateMs",
      "updateToFrameMs",
      "unmountMs",
    ] as const)
      expect(Number.isFinite(result?.[key])).toBe(true);
  }
});

test("runtime performance page selects the full component catalog in one evidence card", async ({
  page,
}) => {
  await page.goto("/#performance");

  await expect(
    page.getByRole("heading", { level: 1, name: "Runtime performance" }),
  ).toBeVisible();

  const component = page.getByLabel("Component", { exact: true });
  await expect(component.locator("option")).toHaveCount(components.length);
  await expect(page.locator("main article")).toHaveCount(1);

  await expect(
    page.getByRole("heading", { level: 2, name: "Button" }),
  ).toBeVisible();
  await expect(
    page.getByText("Committed benchmark baseline", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Button committed runtime medians"),
  ).toBeVisible();

  await component.selectOption("chart");
  await expect(
    page.getByRole("heading", { level: 2, name: "Chart" }),
  ).toBeVisible();
  await expect(
    page.getByText("Browser workload", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/has no approved baseline/u)).toBeVisible();

  for (const [slug, label] of [
    ["data-grid", "DataGrid"],
    ["pie-chart", "PieChart"],
    ["scatter-chart", "ScatterChart"],
  ] as const) {
    await component.selectOption(slug);
    await expect(
      page.getByRole("heading", { level: 2, name: label }),
    ).toBeVisible();
    await expect(
      page.getByText("Browser workload", { exact: true }),
    ).toBeVisible();
    await expect(page.getByText(/has no approved baseline/u)).toBeVisible();
  }

  await component.selectOption("accordion");
  await expect(
    page.getByRole("heading", { level: 2, name: "Accordion" }),
  ).toBeVisible();
  await expect(
    page.getByText("Representative browser workload", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(/no baseline is approved\. It measures the full preview\./u),
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: "Run Accordion representative workload →",
      exact: true,
    }),
  ).toHaveAttribute("href", "#lab?scenario=accordion");

  await component.selectOption("grid");
  await expect(
    page.getByRole("heading", { level: 2, name: "Grid" }),
  ).toBeVisible();
  await expect(
    page.getByText("Committed benchmark baseline", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Grid committed runtime medians")).toBeVisible();
});

test("performance and lab deep links preserve a bounded workload", async ({
  page,
}) => {
  await page.goto("/#performance?component=pie-chart");
  const component = page.getByLabel("Component", { exact: true });
  await expect(component).toHaveValue("pie-chart");
  await expect(
    page.getByRole("heading", { level: 2, name: "PieChart" }),
  ).toBeVisible();

  const labLink = page.getByRole("link", {
    name: "Run PieChart in the Stress Lab →",
    exact: true,
  });
  await expect(labLink).toHaveAttribute("href", "#lab?scenario=pie-chart");
  await labLink.click();

  const scenario = page.getByLabel("Scenario", { exact: true });
  const workUnits = page.getByLabel("Work units", { exact: true });
  await expect(scenario).toHaveValue("pie-chart");
  await expect(workUnits).toHaveValue("256");
  await expect(workUnits.locator('option[value="256"]')).toHaveText("256");

  await page.getByLabel("Samples", { exact: true }).selectOption("3");
  await page
    .getByRole("button", { name: "Start benchmark", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Export raw results", exact: true }),
  ).toBeVisible({ timeout: 45_000 });
  await expect(
    page.getByRole("region", { name: "Benchmark results", exact: true }),
  ).toContainText("PieChart × 256 source slices");

  const performanceLink = page.getByRole("link", {
    name: "Inspect PieChart runtime evidence →",
    exact: true,
  });
  await expect(performanceLink).toHaveAttribute(
    "href",
    "#performance?component=pie-chart",
  );
  await performanceLink.click();
  await expect(component).toHaveValue("pie-chart");
});

test("representative preview workload produces a local runtime report", async ({
  page,
}) => {
  await page.goto("/#performance?component=scroll-area");
  await expect(
    page.getByText("Representative browser workload", { exact: true }),
  ).toBeVisible();

  await page
    .getByRole("link", {
      name: "Run ScrollArea representative workload →",
      exact: true,
    })
    .click();

  await expect(page.getByLabel("Scenario", { exact: true })).toHaveValue(
    "scroll-area",
  );
  const workUnits = page.getByLabel("Work units", { exact: true });
  await expect(workUnits).toHaveValue("1");
  await expect(workUnits.locator("option")).toHaveCount(1);
  await expect(
    page.getByLabel("Scaling sweep up to this count", { exact: true }),
  ).toBeDisabled();

  await page.getByLabel("Samples", { exact: true }).selectOption("3");
  await page
    .getByRole("button", { name: "Start benchmark", exact: true })
    .click();

  const results = page.getByRole("region", {
    name: "Benchmark results",
    exact: true,
  });
  await expect(results).toContainText(
    "ScrollArea × 1 public preview composition",
    { timeout: 45_000 },
  );
  await expect(results).toContainText("Flux-only");
  await expect(results.getByRole("row", { name: /^mount\b/u })).toBeVisible();
});

test("data-table lab workload never advertises a fabricated native ratio", async ({
  page,
}) => {
  await page.goto("/#lab");
  await page.getByLabel("Scenario", { exact: true }).selectOption("data-table");
  await page.getByLabel("Work units", { exact: true }).selectOption("100");
  await page.getByLabel("Samples", { exact: true }).selectOption("3");
  await page
    .getByRole("button", { name: "Start benchmark", exact: true })
    .click();
  const results = page.getByRole("region", {
    name: "Benchmark results",
    exact: true,
  });
  await expect(results).toContainText("Flux-only", { timeout: 45000 });
  await expect(
    results.getByRole("columnheader", { name: "Flux / native" }),
  ).toHaveCount(0);
});
