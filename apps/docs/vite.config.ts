import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  define: {
    "import.meta.env.VITE_BUILD_COMMIT": JSON.stringify(
      process.env.GITHUB_SHA ?? "",
    ),
  },
  plugins: [react(), vanillaExtractPlugin()],
  resolve: {
    alias: [
      {
        find: "@flux-ui/icons/catalog",
        replacement: resolve(
          import.meta.dirname,
          "../../packages/icons/src/catalog.ts",
        ),
      },
      {
        find: "@flux-ui/icons",
        replacement: resolve(
          import.meta.dirname,
          "../../packages/icons/src/index.ts",
        ),
      },
      {
        find: "@flux-ui/identity",
        replacement: resolve(
          import.meta.dirname,
          "../../packages/identity/src/index.ts",
        ),
      },
      {
        find: "@flux-ui/react",
        replacement: resolve(
          import.meta.dirname,
          "../../packages/react/src/index.ts",
        ),
      },
      {
        find: "@flux-ui/tokens/presets.css",
        replacement: resolve(
          import.meta.dirname,
          "../../packages/tokens/src/presets.css",
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
        find: "@flux-ui/tokens/reset.css",
        replacement: resolve(
          import.meta.dirname,
          "../../packages/tokens/src/reset.css",
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
