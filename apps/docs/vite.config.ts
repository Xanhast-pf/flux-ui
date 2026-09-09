import { resolve } from "node:path";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  resolve: {
    alias: [
      {
        find: "@flux-ui/react",
        replacement: resolve(
          import.meta.dirname,
          "../../packages/react/src/index.ts",
        ),
      },
      {
        find: "@flux-ui/tokens/theme.css",
        replacement: resolve(
          import.meta.dirname,
          "../../packages/tokens/src/theme.css",
        ),
      },
      {
        find: "@flux-ui/tokens",
        replacement: resolve(
          import.meta.dirname,
          "../../packages/tokens/src/index.ts",
        ),
      },
    ],
  },
});
