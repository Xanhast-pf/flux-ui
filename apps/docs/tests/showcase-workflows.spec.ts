import { expect, test } from "@playwright/test";

test("Revenue connects reporting controls, forecasting and local status", async ({
  page,
}) => {
  await page.goto("/#playground?scene=revenue-command");
  const dashboard = page.locator('[data-scene="revenue-command"]');

  await dashboard
    .getByRole("group", { name: "Revenue period" })
    .getByRole("button", { name: "30 days", exact: true })
    .click();

  await dashboard
    .getByRole("button", { name: "Build forecast", exact: true })
    .click();
  const dialog = dashboard.getByRole("dialog", {
    name: "Forecast next quarter",
  });
  await dialog.getByLabel("Scenario", { exact: true }).selectOption("upside");
  await dialog.getByLabel("Expected growth (%)", { exact: true }).fill("24");
  await dialog
    .getByRole("button", { name: "Apply scenario", exact: true })
    .click();

  await expect(
    dashboard.getByRole("status").filter({ hasText: "upside forecast" }),
  ).toContainText("24% locally");
});

test("Product Pulse combines experiment confidence, ratings and guardrails", async ({
  page,
}) => {
  await page.goto("/#playground?scene=product-pulse");
  const dashboard = page.locator('[data-scene="product-pulse"]');

  await dashboard
    .getByRole("tab", { name: "Experiments", exact: true })
    .click();
  const confidence = dashboard.getByRole("slider", {
    name: /Decision confidence/u,
  });
  await confidence.press("ArrowRight");
  await expect(confidence).toHaveValue("83");

  await dashboard
    .getByRole("button", { name: "Mark ready for review", exact: true })
    .click();
  await expect(
    dashboard
      .getByRole("status")
      .filter({ hasText: "Experiment marked ready" }),
  ).toContainText("83% confidence");

  await dashboard
    .getByRole("button", { name: "Guardrails", exact: true })
    .click();
  const guardrails = page.getByRole("dialog", {
    name: "Experiment guardrails",
  });
  const stopOnSpike = guardrails.getByRole("switch", {
    name: "Stop on error spike",
  });
  await expect(stopOnSpike).toBeChecked();
  await stopOnSpike.uncheck();
  await expect(stopOnSpike).not.toBeChecked();
});

test("Commerce Ops filters inventory and opens order details", async ({
  page,
}) => {
  await page.goto("/#playground?scene=commerce-ops");
  const dashboard = page.locator('[data-scene="commerce-ops"]');

  const search = dashboard.getByLabel("Search inventory", { exact: true });
  await search.fill("HL-031");
  await expect(
    dashboard.getByText("Halo Desk Lamp", { exact: true }),
  ).toBeVisible();
  await expect(
    dashboard.getByText("Canvas Weekender", { exact: true }),
  ).toHaveCount(0);

  await search.fill("");
  const autoRestock = dashboard.getByRole("switch", {
    name: "Auto-restock",
  });
  await expect(autoRestock).toBeChecked();
  await autoRestock.uncheck();
  await expect(autoRestock).not.toBeChecked();

  await dashboard
    .getByRole("button", { name: "Open order details", exact: true })
    .click();
  const details = page.getByRole("dialog", { name: "Order #8421" });
  await expect(details).toContainText("Express shipping");
  await details
    .getByRole("button", { name: "Close details", exact: true })
    .click();
  await expect(details).not.toBeVisible();
});

test("Relay triage, reply and close-ticket flow is fully local", async ({
  page,
}) => {
  await page.goto("/#playground?scene=service-desk");
  const dashboard = page.locator('[data-scene="service-desk"]');

  await dashboard.getByRole("radio", { name: "Urgent", exact: true }).check();
  await dashboard
    .getByRole("button", { name: "Send demo reply", exact: true })
    .click();
  await expect(
    page.getByText("Reply sent locally", { exact: true }),
  ).toBeVisible();

  await dashboard
    .getByRole("button", { name: "Close ticket", exact: true })
    .click();
  const confirmation = page.getByRole("alertdialog", {
    name: "Close this fictional ticket?",
  });
  await confirmation
    .getByRole("button", { name: "Close ticket", exact: true })
    .click();
  await expect(dashboard.getByText("Closed", { exact: true })).toBeVisible();
  await expect(
    dashboard.getByRole("status").filter({ hasText: "Ticket closed locally" }),
  ).toContainText("Priority: urgent");
});

test("Launchpad switches services, controls a canary and exposes build logs", async ({
  page,
}) => {
  await page.goto("/#playground?scene=deploy-control");
  const dashboard = page.locator('[data-scene="deploy-control"]');

  await dashboard.getByRole("button", { name: "Worker", exact: true }).click();
  await expect(
    dashboard.getByRole("heading", { name: "worker / production" }),
  ).toBeVisible();

  await dashboard
    .getByRole("button", { name: "Canary enabled", exact: true })
    .click();
  const traffic = dashboard.getByRole("slider", {
    name: /Canary traffic/u,
  });
  await expect(traffic).toBeDisabled();

  await dashboard
    .getByRole("button", { name: "Canary disabled", exact: true })
    .click();
  await traffic.press("ArrowRight");
  await expect(traffic).toHaveValue("25");

  await dashboard.getByRole("tab", { name: "Build log", exact: true }).click();
  await expect(
    dashboard.getByRole("region", { name: "Production build log" }),
  ).toContainText("production ready");
});

test("dashboard recipe export is self-contained and has no scene stylesheet", async ({
  page,
}) => {
  await page.goto("/#playground?scene=deploy-control");
  const source = page.getByRole("button", { name: "View source", exact: true });
  await expect(source).not.toBeVisible();

  await page
    .getByRole("button", { name: "View components", exact: true })
    .click();
  await source.click();

  const files = page.getByRole("combobox", { name: "Recipe file" });
  await expect(files).toBeVisible();
  await expect(files.locator('option[value$=".css"]')).toHaveCount(0);

  await files.selectOption("package.json");
  await expect(
    page.getByRole("region", { name: "package.json source", exact: true }),
  ).toContainText("pnpm");

  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download recipe" }).click();
  expect((await pending).suggestedFilename()).toBe(
    "flux-deploy-control-recipe.zip",
  );
});
