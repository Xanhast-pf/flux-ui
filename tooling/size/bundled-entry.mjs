import { createRequire } from "node:module";
import { resolve } from "node:path";
import { collectRuntimeGraph, compressMetrics } from "./lib.mjs";

// Reuse esbuild already installed with the React package's Vite toolchain.
// Resolve through Vite rather than depending on pnpm's physical store layout.
const requireReact = createRequire(
  new URL("../../packages/react/package.json", import.meta.url),
);
const { build, version } = createRequire(requireReact.resolve("vite"))(
  "esbuild",
);

export const bundledEntryMethod = {
  bundler: "esbuild",
  version,
  target: "es2022",
  format: "esm",
  splitting: false,
  minify: true,
  external: [
    "react",
    "react/jsx-runtime",
    "react/jsx-dev-runtime",
    "react-dom",
    "react-dom/client",
    "react-dom/server",
  ],
};

// One standalone consumer entry, with all its exports retained. Validation uses
// the unchanged graph contract, including missing files and unaccounted peers.
export async function measureBundledEntry(entryPath, distDir) {
  const externalImports = new Set();
  await collectRuntimeGraph(entryPath, distDir, externalImports);
  const result = await build({
    absWorkingDir: resolve(distDir),
    entryPoints: [resolve(entryPath)],
    outfile: resolve(distDir, "flux-size-entry.js"),
    bundle: true,
    splitting: false,
    minify: true,
    treeShaking: true,
    format: bundledEntryMethod.format,
    target: bundledEntryMethod.target,
    platform: "browser",
    external: bundledEntryMethod.external,
    write: false,
    sourcemap: false,
    legalComments: "none",
    logLevel: "silent",
  });
  const metrics = {
    raw: 0,
    gzip: 0,
    brotli: 0,
    fileCount: result.outputFiles.length,
  };
  const outputs = {};
  for (const file of result.outputFiles) {
    const kind = file.path.endsWith(".js")
      ? "js"
      : file.path.endsWith(".css")
        ? "css"
        : null;
    if (kind === null || outputs[kind])
      throw new Error(
        "Bundled entry must emit at most one JS and one CSS file.",
      );
    outputs[kind] = compressMetrics(file.contents);
    for (const metric of ["raw", "gzip", "brotli"])
      metrics[metric] += outputs[kind][metric];
  }
  if (!outputs.js) throw new Error("Bundled entry did not emit JavaScript.");
  return { ...metrics, outputs, externalImports: [...externalImports].sort() };
}
