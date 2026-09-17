import { expect, test } from "@playwright/test";
test("built native ranges reset without bypassing the controlled owner", async ({
  page,
}) => {
  await page.goto("/");
  const range = page.getByRole("slider", {
    name: "Resettable consumer range",
    exact: true,
  });
  await range.dblclick();
  await expect(range).toHaveValue("25");
  const owned = page.getByRole("slider", { name: "Parent-owned range" });
  await owned.dblclick();
  await expect(owned).toHaveValue("75");
  await expect
    .poll(async () =>
      Number(await page.getByTestId("reset-requests").textContent()),
    )
    .toBeGreaterThan(0);
  const vertical = page.getByRole("slider", {
    name: "Vertical consumer range",
  });
  await expect(vertical).toHaveAttribute("aria-orientation", "vertical");
  await expect(vertical).toHaveCSS("height", "192px");
  await vertical.focus();
  await page.keyboard.press("ArrowUp");
  await expect(vertical).toHaveValue("40");
  await page.keyboard.press("End");
  await expect(vertical).toHaveValue("100");
  await vertical.dblclick();
  await expect(vertical).toHaveValue("30");
});
test("built knobs scale and a double-click produces one reset commit", async ({
  page,
}) => {
  await page.goto("/");
  const knob = page.getByRole("slider", { name: "Resettable consumer knob" });
  for (const [name, diameter] of [
    ["Resettable consumer knob", "48px"],
    ["Medium consumer knob", "64px"],
    ["Large consumer knob", "80px"],
    ["Custom consumer knob", "96px"],
  ] as const) {
    await expect(
      page
        .getByRole("slider", { name })
        .locator('[aria-hidden="true"]')
        .first(),
    ).toHaveCSS("width", diameter);
  }
  await knob.dblclick();
  await expect(knob).toHaveAttribute("aria-valuenow", "40");
  await expect(page.getByTestId("knob-commits")).toHaveText("1");
  await knob.dblclick();
  await expect(page.getByTestId("knob-commits")).toHaveText("1");
});
test("built table checkboxes and grouped numbers use the public input styling", async ({
  page,
}) => {
  await page.goto("/");
  const table = page.getByRole("table", { name: "Themed selection" });
  const row = table.getByRole("checkbox", { name: "Select row a" });
  const reference = page.getByRole("checkbox", { name: "Reference checkbox" });
  await row.check();
  for (const property of [
    "appearance",
    "accent-color",
    "width",
    "height",
    "border-radius",
  ]) {
    const value = await reference.evaluate(
      (node, key) => getComputedStyle(node).getPropertyValue(key),
      property,
    );
    await expect(row).toHaveCSS(property, value);
  }
  const number = page.getByRole("spinbutton", { name: "Consumer amount" });
  await expect(number).toHaveCSS("border-top-width", "0px");
  await expect(number).toHaveAccessibleDescription("The amount is optional.");
  await number.fill("12.5");
  await page.getByRole("button", { name: "Submit grouped amount" }).click();
  await expect(page.getByTestId("submitted-amount")).toHaveText("12.5");
  await number.fill("");
  await page.getByRole("button", { name: "Submit grouped amount" }).click();
  await expect(page.getByTestId("submitted-amount")).toBeEmpty();
});
test("built tabs preserve native scrolling, keyboard activation and controlled selection", async ({
  page,
}) => {
  await page.goto("/");
  const list = page.getByRole("tablist", { name: "Consumer tabs" });
  const first = list.getByRole("tab", { name: "Overview", exact: true });
  const last = list.getByRole("tab", { name: "Audit history", exact: true });
  await first.focus();
  await page.keyboard.press("End");
  await expect(last).toBeFocused();
  await expect(first).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("tabpanel", { name: "Audit history", exact: true }),
  ).toBeVisible();
  await expect
    .poll(() => list.evaluate((node) => node.scrollLeft))
    .toBeGreaterThan(0);
  await page.getByRole("button", { name: "Resize consumer tabs" }).click();
  await expect(last).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "Toggle RTL tabs" }).click();
  await page.getByRole("button", { name: "Toggle automatic tabs" }).click();
  await first.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(list.getByRole("tab", { name: "Transactions" })).toBeFocused();
  await expect(
    page.getByRole("tabpanel", { name: "Transactions" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Toggle final tab availability" })
    .click();
  await first.focus();
  await page.keyboard.press("End");
  await expect(list.getByRole("tab", { name: "Permissions" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "After consumer tabs" }),
  ).toBeFocused();
});

test("built Overflow keeps one semantic tab representation and restores container width", async ({
  page,
}) => {
  await page.goto("/");
  const scope = page.getByRole("region", { name: "Built Overflow" });
  const list = scope.getByRole("tablist");
  const picker = scope.getByRole("combobox", { name: "More items" });
  await expect(picker).toBeVisible();
  await expect(picker.getByRole("option", { name: "Billing" })).toBeDisabled();
  await picker.focus();
  await picker.selectOption({ label: "History" });
  await expect(list.getByRole("tab", { name: "History" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(scope.getByRole("tabpanel")).toHaveText("History built panel");
  await expect(picker).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    scope.getByRole("button", { name: "After built Overflow" }),
  ).toBeFocused();
  await scope
    .getByRole("button", { name: "Change Overflow membership" })
    .click();
  await expect(
    picker.getByRole("option", { name: "Extra section" }),
  ).toHaveCount(1);
  await scope
    .getByRole("button", { name: "Change Overflow membership" })
    .click();
  await expect(
    picker.getByRole("option", { name: "Extra section" }),
  ).toHaveCount(0);
  await scope.getByRole("button", { name: "Resize built Overflow" }).click();
  await expect(picker).toHaveCount(0);
  await expect(list.getByRole("tab")).toHaveCount(6);
  await scope.getByRole("button", { name: "Resize built Overflow" }).click();
  await expect(picker).toBeVisible();
  await expect(list.getByRole("tab", { name: "History" })).toBeVisible();
});
