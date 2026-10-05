import { expect, test } from "@playwright/test";

test("visible toast controls stay keyboard reachable and restore focus", async ({
  page,
}) => {
  await page.goto("/#components/toast");

  const trigger = page.getByRole("button", {
    name: "Save local draft",
    exact: true,
  });
  await trigger.click();

  const status = page.getByRole("status");
  await expect(status).toContainText("Local draft saved");
  await expect(status.getByRole("button")).toHaveCount(0);

  const action = page.getByRole("button", { name: "Undo", exact: true });
  const dismiss = page.getByRole("button", {
    name: "Dismiss notification",
    exact: true,
  });

  await trigger.focus();
  await page.keyboard.press("Tab");
  await expect(action).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dismiss).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(status).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
