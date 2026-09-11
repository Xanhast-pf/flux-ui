import { expect, test } from "@playwright/test";

test("renders the workshop, native form examples, and overlay demos", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "One system.",
  );
  await page.goto("/#components/input");
  await expect(
    page.getByRole("textbox", { name: "Email address", exact: true }),
  ).toBeVisible();
  await page.goto("/#components/field");
  await expect(
    page.getByRole("textbox", { name: "Work email", exact: true }),
  ).toHaveAttribute("required", "");
  await page.goto("/#components/textarea");
  await expect(
    page.getByRole("textbox", { name: "Project notes", exact: true }),
  ).toHaveAttribute("rows", "4");
  await page.goto("/#components/tabs");
  const overview = page.getByRole("tab", { name: "Overview", exact: true });
  await overview.focus();
  await page.keyboard.press("ArrowRight");
  const activity = page.getByRole("tab", { name: "Activity", exact: true });
  await expect(activity).toBeFocused();
  await expect(activity).toHaveAttribute("aria-selected", "true");
  await page.goto("/#components/dialog");
  const trigger = page.getByRole("button", {
    name: "Open dialog",
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Project settings" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.goto("/#components/drawer");
  await page.getByRole("button", { name: "Open drawer", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "Project navigation" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close drawer", exact: true }).click();
});

test("uses the Flux Drawer for mobile documentation navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByRole("button", { name: "Browse sections" }).click();
  const navigationDrawer = page.getByRole("dialog", {
    name: "Flux UI documentation",
  });
  await expect(navigationDrawer).toBeVisible();

  await navigationDrawer.getByRole("link", { name: "Components" }).click();
  await expect(navigationDrawer).not.toBeVisible();
  await expect(page).toHaveURL(/#components$/);
});

test("Checkbox preserves keyboard, mixed-state, form, and reset behavior", async ({
  page,
}) => {
  await page.goto("/#components/checkbox");
  const form = page.getByRole("form", {
    name: "Checkbox preferences",
    exact: true,
  });
  const updates = form.getByRole("checkbox", {
    name: "Release updates",
    exact: true,
  });
  const all = form.getByRole("checkbox", {
    name: "All channels",
    exact: true,
  });
  const email = form.getByRole("checkbox", {
    name: "Email notifications",
    exact: true,
  });
  const push = form.getByRole("checkbox", {
    name: "Push notifications",
    exact: true,
  });
  const terms = form.getByRole("checkbox", {
    name: "Accept the project terms",
    exact: true,
  });

  await expect(updates).toBeChecked();
  await form.getByText("Release updates", { exact: true }).click();
  await expect(updates).not.toBeChecked();
  await expect(updates).toBeFocused();
  await page.keyboard.press("Space");
  await expect(updates).toBeChecked();

  await expect(all).toHaveJSProperty("indeterminate", true);
  await all.focus();
  await page.keyboard.press("Space");
  await expect(all).toHaveJSProperty("indeterminate", false);
  await expect(all).toBeChecked();
  await expect(email).toBeChecked();
  await expect(push).toBeChecked();

  await email.uncheck();
  await expect(all).toHaveJSProperty("indeterminate", true);
  await expect(all).toHaveJSProperty("checked", false);
  await all.click();
  await expect(email).toBeChecked();
  await expect(push).toBeChecked();

  await expect(terms).toHaveAttribute("required", "");
  await expect(terms).toHaveAttribute("aria-invalid", "true");
  await terms.check();
  await expect(terms).not.toHaveAttribute("aria-invalid", "true");
  await expect(
    form.getByText("Accept the terms to complete this example."),
  ).toHaveCount(0);
  await expect(
    form.getByRole("checkbox", {
      name: "Managed by your organization",
      exact: true,
    }),
  ).toBeDisabled();

  const submitted = await form.evaluate((element) => {
    if (!(element instanceof HTMLFormElement)) {
      throw new Error("Expected a form.");
    }
    return [...new FormData(element).entries()];
  });
  expect(submitted).toEqual([
    ["updates", "yes"],
    ["channel", "email"],
    ["channel", "push"],
    ["terms", "accepted"],
  ]);

  await updates.uncheck();
  await form
    .getByRole("button", { name: "Reset preferences", exact: true })
    .click();
  await expect(updates).toBeChecked();
  await expect(email).toBeChecked();
  await expect(push).not.toBeChecked();
  await expect(all).toHaveJSProperty("indeterminate", true);
  await expect(terms).not.toBeChecked();
  await expect(terms).toHaveAttribute("aria-invalid", "true");
});

test("Native selection controls keep browser rendering and keyboard behavior in forced colors", async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page.goto("/#components/checkbox");
  const updates = page.getByRole("checkbox", {
    name: "Release updates",
    exact: true,
  });
  await expect(updates).toHaveCSS("appearance", "auto");
  await updates.focus();
  await expect(updates).toBeFocused();
  await page.keyboard.press("Space");
  await expect(updates).not.toBeChecked();
  await expect(
    page.getByRole("checkbox", { name: "All channels", exact: true }),
  ).toHaveJSProperty("indeterminate", true);

  await page.goto("/#components/radio-group");
  const stable = page.getByRole("radio", { name: "Stable", exact: true });
  const beta = page.getByRole("radio", { name: "Beta", exact: true });
  await expect(stable).toHaveCSS("appearance", "auto");
  await stable.focus();
  await page.keyboard.press("ArrowRight");
  await expect(beta).toBeFocused();
  await expect(beta).toBeChecked();
});

test("RadioGroup preserves native keyboard, form, controlled, and reset behavior", async ({
  page,
}) => {
  await page.goto("/#components/radio-group");
  const form = page.getByRole("form", {
    name: "Radio preferences",
    exact: true,
  });
  const releaseGroup = form.getByRole("group", {
    name: "Release channel",
    exact: true,
  });
  const stable = releaseGroup.getByRole("radio", {
    name: "Stable",
    exact: true,
  });
  const beta = releaseGroup.getByRole("radio", {
    name: "Beta",
    exact: true,
  });
  const canary = releaseGroup.getByRole("radio", {
    name: "Canary (unavailable)",
    exact: true,
  });

  await expect(stable).toBeChecked();
  await expect(stable).toHaveAttribute("required", "");
  await expect(canary).toBeDisabled();

  await stable.focus();
  await page.keyboard.press("ArrowRight");
  await expect(beta).toBeFocused();
  await expect(beta).toBeChecked();
  await expect(stable).not.toBeChecked();

  const production = form.getByRole("radio", {
    name: "Production",
    exact: true,
  });
  await production.check();
  await expect(production).toBeChecked();

  const submitted = await form.evaluate((element) => {
    if (!(element instanceof HTMLFormElement)) {
      throw new Error("Expected a form.");
    }
    return [...new FormData(element).entries()];
  });
  expect(submitted).toEqual([
    ["release-channel", "beta"],
    ["environment", "production"],
  ]);

  await form
    .getByRole("button", { name: "Reset radio groups", exact: true })
    .click();
  await expect(stable).toBeChecked();
  await expect(
    form.getByRole("radio", { name: "Staging", exact: true }),
  ).toBeChecked();
});

test("uses the Flux identity mark in the docs shell", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".brand svg")).toBeVisible();
  await page.goto("/#identity");
  await expect(
    page.getByRole("heading", { level: 1, name: "Drawn for the system." }),
  ).toBeVisible();
});
