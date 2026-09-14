import { defineConfig, devices } from "@playwright/test";
import consumer from "./playwright.config.js";

// Opt-in compatibility coverage. It must not overwrite Chromium CI evidence.
export default defineConfig({
  ...consumer,
  outputDir: "../../../.cache/consumer-compat-results",
  reporter: "list",
  projects: [
    { name: "chromium", use: devices["Desktop Chrome"] },
    { name: "firefox", use: devices["Desktop Firefox"] },
    { name: "webkit", use: devices["Desktop Safari"] },
  ],
});
