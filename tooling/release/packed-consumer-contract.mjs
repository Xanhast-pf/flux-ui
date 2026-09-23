import projectPackage from "../../package.json" with { type: "json" };
import { archiveName, assertVersion, REPOSITORY } from "./contract.mjs";
export const consumerPackages = [
  "@flux-ui/icons",
  "@flux-ui/react",
  "@flux-ui/tokens",
];
/** This is a consumer test input check, never a substitute for publisher verification. */
export function assertConsumerManifest(manifest, env = process.env) {
  if (
    manifest?.schemaVersion !== 1 ||
    !Array.isArray(manifest.packages) ||
    manifest.packages.length === 0
  )
    throw new Error("Invalid packed-consumer manifest.");
  if (env.GITHUB_ACTIONS === "true") {
    if (
      manifest.source?.kind !== "github-actions" ||
      manifest.source.repository !== REPOSITORY ||
      typeof env.GITHUB_SHA !== "string" ||
      typeof env.GITHUB_RUN_ID !== "string" ||
      typeof env.GITHUB_RUN_ATTEMPT !== "string" ||
      manifest.source.commit !== env.GITHUB_SHA ||
      manifest.source.runId !== env.GITHUB_RUN_ID ||
      manifest.source.runAttempt !== env.GITHUB_RUN_ATTEMPT
    ) {
      throw new Error(
        "Consumer archives must belong to this exact workflow run.",
      );
    }
  } else if (manifest.source?.kind !== "local") {
    throw new Error(
      "Local consumer checks accept local candidate manifests only; do not impersonate CI environment values.",
    );
  }
  const names = new Set();
  for (const pkg of manifest.packages) {
    if (names.has(pkg.name) || pkg.file !== archiveName(pkg.name, pkg.version))
      throw new Error("Duplicate or unsafe candidate package.");
    names.add(pkg.name);
    assertVersion(pkg.version, manifest.tag);
    if (
      typeof pkg.sha256 !== "string" ||
      !/^[a-f0-9]{64}$/u.test(pkg.sha256) ||
      typeof pkg.integrity !== "string" ||
      !/^sha512-[A-Za-z0-9+/]{86}==$/u.test(pkg.integrity)
    )
      throw new Error("Missing or invalid candidate digests.");
  }
  for (const name of consumerPackages)
    if (!names.has(name)) throw new Error(`Missing consumer package: ${name}`);
}
export function consumerPackageJson(manifest, toolVersions) {
  const flux = Object.fromEntries(
    manifest.packages.map((pkg) => [pkg.name, `file:./vendor/${pkg.file}`]),
  );
  const required = [
    "react",
    "react-dom",
    "@types/react",
    "@types/react-dom",
    "@types/node",
    "typescript",
    "vite",
    "@playwright/test",
  ];
  for (const name of required)
    if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u.test(toolVersions[name] ?? ""))
      throw new Error(`An installed exact tool version is required: ${name}`);
  return {
    name: "flux-packed-consumer",
    private: true,
    version: "0.0.0",
    type: "module",
    packageManager: projectPackage.packageManager,
    engines: { node: projectPackage.engines.node },
    dependencies: {
      ...flux,
      react: toolVersions.react,
      "react-dom": toolVersions["react-dom"],
    },
    devDependencies: Object.fromEntries(
      required
        .filter((name) => name !== "react" && name !== "react-dom")
        .map((name) => [name, toolVersions[name]]),
    ),
    pnpm: { overrides: flux },
  };
}
