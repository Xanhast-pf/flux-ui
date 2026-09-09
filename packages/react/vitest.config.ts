import { resolve } from "node:path";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@flux-ui/tokens": resolve(import.meta.dirname, "../tokens/src/index.ts"),
    },
  },
  plugins: [vanillaExtractPlugin()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
