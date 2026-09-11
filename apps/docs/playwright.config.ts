import { resolve } from "node:path";
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  reporter:
    process.env.FLUX_TRUST_JOB === "browser"
      ? [
          ["list"],
          [
            "json",
            {
              outputFile: resolve(
                import.meta.dirname,
                "../../.cache/trust/browser/browser-tests.json",
              ),
            },
          ],
        ]
      : "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
  },
  webServer: {
    command:
      "pnpm build && pnpm exec vite preview --host 127.0.0.1 --port 4173",
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: "chromium", use: devices["Desktop Chrome"] }],
});
