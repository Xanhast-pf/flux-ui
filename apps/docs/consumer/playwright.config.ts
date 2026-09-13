import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: ".",
  testMatch: "consumer.spec.ts",
  outputDir: "../../../.cache/consumer-results",
  reporter:
    process.env.FLUX_TRUST_JOB === "browser"
      ? [
          ["list"],
          [
            "json",
            {
              outputFile: fileURLToPath(
                new URL(
                  "../../../.cache/trust/browser/consumer-tests.json",
                  import.meta.url,
                ),
              ),
            },
          ],
        ]
      : "list",
  use: { baseURL: "http://127.0.0.1:4179", trace: "retain-on-failure" },
  webServer: {
    command:
      "pnpm exec vite build --config consumer/vite.config.ts && pnpm exec vite preview --config consumer/vite.config.ts --host 127.0.0.1 --port 4179 --strictPort",
    cwd: fileURLToPath(new URL("../", import.meta.url)),
    port: 4179,
    reuseExistingServer: false,
  },
  projects: [{ name: "chromium", use: devices["Desktop Chrome"] }],
});
