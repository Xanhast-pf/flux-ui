import { expect, test } from "@playwright/test";
import { readdir, readFile } from "node:fs/promises";
const directory = new URL("../src/perf/scenarios/", import.meta.url);
const files = (await readdir(directory)).filter((file) =>
  file.endsWith(".json"),
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
