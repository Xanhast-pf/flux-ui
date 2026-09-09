import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { libInjectCss } from "vite-plugin-lib-inject-css";

const componentEntries = Object.fromEntries(
  readdirSync(resolve(import.meta.dirname, "src/components"), {
    withFileTypes: true,
  })
    .filter((entry) => entry.isDirectory())
    .map((entry) => [
      entry.name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
      resolve(import.meta.dirname, "src/components", entry.name, "index.ts"),
    ]),
);

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin(), libInjectCss()],
  build: {
    cssCodeSplit: true,
    sourcemap: true,
    lib: {
      entry: {
        index: resolve(import.meta.dirname, "src/index.ts"),
        ...componentEntries,
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});
