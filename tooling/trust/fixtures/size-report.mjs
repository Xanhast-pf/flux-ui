// Synthetic report for trust contracts only; never published as CI evidence.
export function sizeReport(slugs = ["button"]) {
  const metric = { raw: 10, gzip: 8, brotli: 6 };
  const graphs = Object.fromEntries(
    slugs.map((slug) => [slug, { ...metric, fileCount: 1 }]),
  );
  return {
    schemaVersion: 2,
    budgetsVersion: 1,
    componentCount: slugs.length,
    checkedComponentCount: slugs.length,
    components: structuredClone(graphs),
    emittedGraphs: structuredClone(graphs),
    componentGates: Object.fromEntries(
      slugs.map((slug) => [
        slug,
        { absoluteFailures: [], regressions: [], result: "pass" },
      ]),
    ),
    bundledEntryMethod: {
      bundler: "esbuild",
      version: "test-fixture",
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
    },
    bundledEntries: Object.fromEntries(
      slugs.map((slug) => [
        slug,
        {
          ...metric,
          fileCount: 1,
          outputs: { js: { ...metric } },
          externalImports: [],
        },
      ]),
    ),
    bundledEntryCoverage: { measured: [...slugs], unmeasured: [] },
    externalPeersNotIncluded: [],
    aggregate: {
      rootEntry: { ...metric },
      runtime: { ...metric },
      published: { ...metric },
    },
  };
}
