import { expect, test } from "@playwright/test";

test("Folio connects ledger filters, note editing and its persistent navigation", async ({
  page,
}) => {
  await page.goto("/#playground?scene=finance");
  const scene = page.locator('[data-scene="finance"]');
  const navigation = scene.getByRole("complementary", {
    name: "Folio workspace navigation",
  });
  await scene.getByRole("tab", { name: "Transactions", exact: true }).click();
  await expect(navigation).toBeVisible();
  const search = scene.getByRole("searchbox", { name: "Search transactions" });
  await search.fill("packaging");
  await scene
    .getByRole("button", { name: "Objects Studio", exact: true })
    .click();
  const details = scene.getByRole("dialog", { name: "Transaction details" });
  await expect(details).toBeVisible();
  await details
    .getByRole("textbox", { name: "Transaction note" })
    .fill("Packaging approved for production");
  await details.getByRole("button", { name: "Save transaction note" }).click();
  await expect(details).not.toBeVisible();
  await expect(
    scene.getByText("Transaction note saved", { exact: true }),
  ).toBeVisible();
  await search.fill("approved for production");
  await expect(
    scene.getByRole("button", { name: "Objects Studio", exact: true }),
  ).toBeVisible();
  await scene.getByRole("button", { name: "Clear transaction search" }).click();
  await expect(search).toBeFocused();
  await expect(search).toHaveValue("");
  await scene.getByRole("tab", { name: "Team", exact: true }).click();
  await expect(navigation).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(navigation).toBeVisible();
  await scene.getByRole("button", { name: "Close Folio navigation" }).click();
  await expect(navigation).not.toBeVisible();
  await expect(
    scene.getByRole("button", { name: "Folio navigation", exact: true }),
  ).toBeFocused();
});

test("Folio records local invitations and exposes recovery states without a backend", async ({
  page,
}) => {
  await page.goto("/#playground?scene=finance");
  const scene = page.locator('[data-scene="finance"]');
  await scene.getByRole("tab", { name: "Team", exact: true }).click();
  await scene.getByRole("button", { name: "Invite teammate" }).click();
  const dialog = scene.getByRole("dialog", { name: "Invite a teammate" });
  await dialog.getByRole("button", { name: "Record invitation" }).click();
  await expect(
    dialog.getByRole("textbox", { name: "Teammate email" }),
  ).toHaveAttribute("aria-invalid", "true");
  await dialog
    .getByRole("textbox", { name: "Teammate email" })
    .fill("new@example.test");
  await dialog.getByRole("combobox", { name: "Workspace role" }).fill("Viewer");
  await page.keyboard.press("Enter");
  await dialog.getByRole("button", { name: "Record invitation" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(
    scene.getByRole("row", { name: /new@example.test.*Viewer.*Invited/u }),
  ).toBeVisible();
  await expect(
    scene.getByText("Demo invitation recorded", { exact: true }),
  ).toBeVisible();
  await scene.getByRole("tab", { name: "Transactions", exact: true }).click();
  await scene
    .getByRole("button", { name: "Ledger actions", exact: true })
    .click();
  await scene
    .getByRole("menuitem", { name: "Simulate connection error" })
    .click();
  await scene.getByRole("button", { name: "Retry demo load" }).click();
  await expect(
    scene.getByRole("button", { name: "Studio North", exact: true }),
  ).toBeVisible();
});

test("Afterhours keeps independent track settings and restores local checkpoints", async ({
  page,
}) => {
  await page.goto("/#playground?scene=music");
  const scene = page.locator('[data-scene="music"]');
  await expect(
    scene.getByRole("button", { name: "Discard unsaved changes" }),
  ).toBeDisabled();
  await scene.getByRole("button", { name: "Inspect Drum machine" }).click();
  const pan = scene.getByRole("slider", { name: "Track pan", exact: true });
  await pan.press("ArrowRight");
  await expect(pan).toHaveValue("1");
  await scene.getByRole("button", { name: "Inspect Sub bass" }).click();
  await expect(pan).toHaveValue("0");
  await scene.getByRole("button", { name: "Inspect Drum machine" }).click();
  await expect(pan).toHaveValue("1");
  await scene
    .getByRole("button", { name: "Session actions", exact: true })
    .click();
  await scene.getByRole("menuitem", { name: "Save local checkpoint" }).click();
  await expect(
    scene.getByRole("button", { name: "Discard unsaved changes" }),
  ).toBeDisabled();
  await pan.press("ArrowRight");
  await scene.getByRole("button", { name: "Discard unsaved changes" }).click();
  const confirmation = scene.getByRole("alertdialog", {
    name: "Discard unsaved interface changes?",
  });
  await expect(
    confirmation.getByRole("button", { name: "Keep changes" }),
  ).toBeFocused();
  await confirmation
    .getByRole("button", { name: "Restore checkpoint" })
    .click();
  await expect(pan).toHaveValue("1");
  await expect(
    scene.getByRole("button", { name: "Discard unsaved changes" }),
  ).toBeDisabled();
  await expect(page.locator("audio, video, iframe")).toHaveCount(0);
});

test("composition exports include helper sources and independent consumer setup", async ({
  page,
}) => {
  await page.goto("/#playground?scene=finance");
  const source = page.getByRole("button", { name: "View source", exact: true });
  await expect(source).not.toBeVisible();
  await page
    .getByRole("button", { name: "Inspect composition", exact: true })
    .click();
  await expect(source).toBeVisible();
  await source.click();
  const files = page.getByRole("combobox", { name: "Recipe file" });
  await expect(files).toBeVisible();
  await files.selectOption("src/showcase/scenes/finance.workspace.tsx");
  await expect(
    page.getByRole("region", {
      name: "src/showcase/scenes/finance.workspace.tsx source",
    }),
  ).toContainText("FinanceTransactions");
  await files.selectOption("package.json");
  await expect(
    page.getByRole("region", { name: "package.json source", exact: true }),
  ).toContainText("pnpm");
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download complete recipe" }).click();
  expect((await pending).suggestedFilename()).toBe("flux-finance-recipe.zip");
});
