import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

function publicPackageBoundary(): Plugin {
  return {
    name: "flux-built-package-boundary",
    generateBundle(_options, bundle) {
      for (const output of Object.values(bundle)) {
        if (output.type !== "chunk") continue;
        for (const id of Object.keys(output.modules)) {
          const path = id.replaceAll("\\", "/").split("?", 1)[0] ?? "";
          if (/\/packages\/[^/]+\/src\/.*\.[cm]?[jt]sx?$/u.test(path))
            this.error(`Consumer bypassed a public built export: ${path}`);
          if (/\/apps\/docs\/src\//u.test(path))
            this.error(`Consumer depends on docs implementation: ${path}`);
        }
      }
    },
  };
}
export default defineConfig({
  root: import.meta.dirname,
  plugins: [react(), publicPackageBoundary()],
  build: {
    outDir: resolve(import.meta.dirname, "../../../.cache/consumer-dist"),
    emptyOutDir: true,
  },
});
