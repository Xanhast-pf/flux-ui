import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const iconEntries = Object.fromEntries(
  readdirSync(resolve(import.meta.dirname, "src/icons"), {
    withFileTypes: true,
  })
    .filter((entry) => entry.isFile() && entry.name.endsWith("Icon.tsx"))
    .map((entry) => [
      entry.name.replace(/\.tsx$/u, ""),
      resolve(import.meta.dirname, "src/icons", entry.name),
    ]),
);

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    lib: {
      entry: {
        index: resolve(import.meta.dirname, "src/index.ts"),
        catalog: resolve(import.meta.dirname, "src/catalog.ts"),
        ...iconEntries,
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
      },
    },
  },
});
