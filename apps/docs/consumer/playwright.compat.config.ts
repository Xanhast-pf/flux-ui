import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";
import consumer from "./playwright.config.js";

// Required focused compatibility coverage. Keep its output separate from the
// broad Chromium suite and built-consumer report.
export default defineConfig({
  ...consumer,
  outputDir: "../../../.cache/consumer-compat-results",
  reporter:
    process.env.FLUX_TRUST_JOB === "browser"
      ? [
          ["list"],
          [
            "json",
            {
              outputFile: fileURLToPath(
                new URL(
                  "../../../.cache/trust/browser/compatibility-tests.json",
                  import.meta.url,
                ),
              ),
            },
          ],
        ]
      : process.env.FLUX_TERMINAL_ACTIVE
        ? [
            ["list"],
            [
              fileURLToPath(
                new URL(
                  "../../../tooling/terminal/playwright-reporter.mjs",
                  import.meta.url,
                ),
              ),
            ],
          ]
        : "list",
  projects: [
    { name: "chromium", use: devices["Desktop Chrome"] },
    { name: "firefox", use: devices["Desktop Firefox"] },
    { name: "webkit", use: devices["Desktop Safari"] },
  ],
});
