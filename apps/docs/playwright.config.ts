import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { defineConfig, devices } from "@playwright/test";

const terminalRun = process.env.FLUX_TERMINAL_ACTIVE === "1";

function terminalServerPort(): number {
  const seed = process.env.FLUX_PROGRESS_FILE;
  if (!seed) return 4173;
  let hash = 2_166_136_261;
  for (const character of seed) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16_777_619);
  }
  return 30_000 + ((hash >>> 0) % 20_000);
}

const serverPort = terminalRun ? terminalServerPort() : 4173;

export default defineConfig({
  testDir: "./tests",
  testIgnore: process.env.FLUX_PERF_MODE === undefined ? "**/perf.spec.ts" : [],
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
      : process.env.FLUX_TERMINAL_ACTIVE
        ? [
            ["list"],
            [
              fileURLToPath(
                new URL(
                  "../../tooling/terminal/playwright-reporter.mjs",
                  import.meta.url,
                ),
              ),
            ],
          ]
        : "list",
  use: {
    baseURL: `http://127.0.0.1:${serverPort}`,
    trace: "retain-on-failure",
  },
  webServer: {
    command: `pnpm build && pnpm exec vite preview --host 127.0.0.1 --port ${serverPort} --strictPort`,
    port: serverPort,
    // Flux terminal tasks can run beside other worktrees. Never let a stale
    // preview on the shared developer port satisfy a repository quality gate.
    reuseExistingServer: !process.env.CI && !terminalRun,
  },
  projects: [{ name: "chromium", use: devices["Desktop Chrome"] }],
});
