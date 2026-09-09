import { expect, test } from "@playwright/test";

test("renders the Flux landing page and interactive Button", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Beautiful by default/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Save changes" }),
  ).toBeEnabled();
});
