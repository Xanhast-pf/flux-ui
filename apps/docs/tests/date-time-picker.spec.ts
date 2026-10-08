import { expect, test } from "@playwright/test";

test("DateTimePicker preview allows selecting different dates", async ({
  page,
}) => {
  await page.goto("/#components/date-time-picker");

  const input = page
    .locator(".preview-content")
    .locator('input[type="datetime-local"]');

  await expect(input).toHaveAttribute("min", "2026-10-01T09:00");
  await expect(input).toHaveAttribute("max", "2026-10-31T18:00");

  await input.fill("2026-10-15T16:45");
  await expect(input).toHaveValue("2026-10-15T16:45");
});
