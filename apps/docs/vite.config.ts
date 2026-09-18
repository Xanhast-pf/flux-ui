import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import { relative, resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    // Flux enforces stricter semantic budgets after the build. Raise Vite's
    // generic warning only to avoid duplicate noise for bounded lazy axe-core.
    chunkSizeWarningLimit: 600,
  },
  define: {
    "import.meta.env.VITE_BUILD_COMMIT": JSON.stringify(
      process.env.GITHUB_SHA ?? "",
    ),
  },
  plugins: [
    react(),
    vanillaExtractPlugin(),
    {
      name: "flux-docs-chunk-metadata",
      apply: "build",
      generateBundle: {
        order: "post",
        handler(_options, bundle) {
          const chunks = Object.values(bundle)
            .filter((item) => item.type === "chunk")
            .map((chunk) => ({
              fileName: chunk.fileName,
              isEntry: chunk.isEntry,
              isDynamicEntry: chunk.isDynamicEntry,
              imports: chunk.imports,
              // Vite retains dynamic CSS placeholder names after deleting their JS.
              // Only emitted JavaScript belongs in this runtime chunk graph.
              dynamicImports: chunk.dynamicImports.filter(
                (name) => bundle[name]?.type === "chunk",
              ),
              modules: Object.keys(chunk.modules).map((id) =>
                relative(resolve(import.meta.dirname, "../.."), id).replaceAll(
                  "\\",
                  "/",
                ),
              ),
            }));
          this.emitFile({
            type: "asset",
            fileName: ".vite/docs-chunks.json",
            source: JSON.stringify(chunks),
          });
        },
      },
    },
  ],
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
