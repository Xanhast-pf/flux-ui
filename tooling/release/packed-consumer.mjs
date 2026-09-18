import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  writeFile,
} from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertPackage,
  hashes,
  inspectArchive,
  run,
  verifyPackage,
} from "./contract.mjs";
import {
  assertConsumerManifest,
  consumerPackageJson,
} from "./packed-consumer-contract.mjs";
import { generateShowcaseRecipes } from "../../scripts/lib/showcase-recipes.mjs";
// Explicit opt-in check. No versions, baselines, workflow policy or publishing are changed.
const root = fileURLToPath(new URL("../../", import.meta.url));
const evidencePath = resolve(
  root,
  ".cache/release/packed-consumer-result.json",
);
const report = {
  schemaVersion: 1,
  status: "failed",
  node: process.version,
  startedAt: new Date().toISOString(),
  commands: [],
  recipes: [],
};
function execute(command, args, cwd) {
  const entry = { command, args, cwd, status: "running" };
  report.commands.push(entry);
  try {
    run(command, args, {
      cwd,
      stdio: "inherit",
      env: { ...process.env, npm_config_ignore_scripts: "true" },
    });
    entry.status = "passed";
  } catch (error) {
    entry.status = "failed";
    throw error;
  }
}
async function json(path) {
  return JSON.parse(await readFile(path, "utf8"));
}
async function writeJson(path, value) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}
try {
  if (Number.parseInt(process.versions.node.split(".")[0], 10) < 24)
    throw new Error("Packed-consumer checks require Node 24 or newer.");
  if (resolve(process.cwd()) !== resolve(root))
    throw new Error("Run pnpm flux release consumer from the repository root.");
  const pnpm = run("pnpm", ["--version"]).trim();
  if (pnpm !== "10.34.5")
    throw new Error("Use the pinned pnpm 10.34.5 toolchain.");
  report.pnpm = pnpm;
  const manifestPath = resolve(root, ".cache/release/manifest.json");
  const bytes = await readFile(manifestPath);
  const manifest = JSON.parse(bytes.toString("utf8"));
  assertConsumerManifest(manifest);
  report.manifestSha256 = hashes(bytes).sha256;
  report.source = manifest.source;
  report.packages = manifest.packages;
  // Validate every immutable archive before copying or executing the consumer.
  for (const pkg of manifest.packages) {
    const path = resolve(root, ".cache/release", pkg.file);
    const actual = hashes(await readFile(path));
    if (actual.sha256 !== pkg.sha256 || actual.integrity !== pkg.integrity)
      throw new Error(`Candidate digest mismatch: ${pkg.name}`);
    assertPackage(inspectArchive(path), pkg);
    if (process.env.GITHUB_ACTIONS === "true") await verifyPackage(pkg.file);
  }
  const require = createRequire(resolve(root, "apps/docs/package.json"));
  const names = [
    "react",
    "react-dom",
    "@types/react",
    "@types/react-dom",
    "@types/node",
    "typescript",
    "vite",
    "@playwright/test",
  ];
  const versions = Object.fromEntries(
    await Promise.all(
      names.map(async (name) => [
        name,
        (await json(require.resolve(`${name}/package.json`))).version,
      ]),
    ),
  );
  report.toolVersions = versions;
  const directory = await mkdtemp(resolve(tmpdir(), "flux-packed-consumer-"));
  report.workspace = directory;
  const fromRepo = relative(root, directory);
  if (
    !isAbsolute(fromRepo) &&
    fromRepo !== ".." &&
    !fromRepo.startsWith(`..${sep}`)
  )
    throw new Error(
      "Consumer workspace must be outside the source repository.",
    );
  const vendor = resolve(directory, "vendor");
  await mkdir(vendor);
  for (const pkg of manifest.packages) {
    const target = resolve(vendor, pkg.file);
    await copyFile(resolve(root, ".cache/release", pkg.file), target);
    if (hashes(await readFile(target)).sha256 !== pkg.sha256)
      throw new Error("Copied archive digest mismatch.");
  }
  const pkg = consumerPackageJson(manifest, versions);
  await writeJson(resolve(directory, "package.json"), pkg);
  const fixtures = resolve(root, "apps/docs/consumer");
  for (const name of await readdir(fixtures)) {
    if (
      name === "index.html" ||
      name.endsWith(".tsx") ||
      name.endsWith(".spec.ts")
    )
      await copyFile(resolve(fixtures, name), resolve(directory, name));
  }
  const base = await json(resolve(root, "tsconfig.base.json"));
  const compilerOptions = {
    ...base.compilerOptions,
    noEmit: true,
    types: ["vite/client", "node"],
  };
  delete compilerOptions.paths;
  delete compilerOptions.baseUrl;
  await writeJson(resolve(directory, "tsconfig.json"), {
    compilerOptions,
    include: ["*.ts", "*.tsx"],
  });
  await writeFile(
    resolve(directory, "vite.config.ts"),
    'import { defineConfig } from "vite";\nexport default defineConfig({ base: "./" });\n',
  );
  await writeFile(
    resolve(directory, "playwright.config.ts"),
    `import { defineConfig, devices } from "@playwright/test";
export default defineConfig({ testDir: ".", testMatch: "*.spec.ts", outputDir: "test-results", reporter: [["list"], ["json", { outputFile: "browser-results.json" }]], use: { baseURL: "http://127.0.0.1:4179", trace: "retain-on-failure" }, webServer: { command: "pnpm exec vite preview --host 127.0.0.1 --port 4179 --strictPort", port: 4179, reuseExistingServer: false }, projects: [{ name: "chromium", use: devices["Desktop Chrome"] }, { name: "firefox", use: devices["Desktop Firefox"] }, { name: "webkit", use: devices["Desktop Safari"] }] });
`,
  );
  execute("pnpm", ["install", "--ignore-scripts"], directory);
  report.consumerLockfileSha256 = hashes(
    await readFile(resolve(directory, "pnpm-lock.yaml")),
  ).sha256;
  execute("pnpm", ["exec", "tsc", "--noEmit"], directory);
  execute("pnpm", ["exec", "vite", "build"], directory);
  execute(
    "pnpm",
    ["exec", "playwright", "test", "--config", "playwright.config.ts"],
    directory,
  );
  // Each exported app is built independently against the same packed artifacts.
  if (!(await generateShowcaseRecipes(root, true)))
    throw new Error("Regenerate stale recipes before validating them.");
  for (const name of (
    await readdir(resolve(root, "apps/docs/src/generated/recipes"))
  ).sort()) {
    const recipe = await json(
      resolve(root, "apps/docs/src/generated/recipes", name),
    );
    const destination = resolve(directory, "recipes", recipe.scene);
    await mkdir(destination, { recursive: true });
    for (const [path, contents] of Object.entries(recipe.files)) {
      const target = resolve(destination, path);
      const part = relative(destination, target);
      if (isAbsolute(part) || part === ".." || part.startsWith(`..${sep}`))
        throw new Error("Unsafe exported recipe path.");
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, contents);
    }
    const recipePackage = await json(resolve(destination, "package.json"));
    const flux = Object.fromEntries(
      manifest.packages.map((entry) => [
        entry.name,
        `file:../../vendor/${entry.file}`,
      ]),
    );
    recipePackage.dependencies = {
      ...recipePackage.dependencies,
      ...flux,
      react: versions.react,
      "react-dom": versions["react-dom"],
    };
    for (const key of Object.keys(recipePackage.devDependencies))
      recipePackage.devDependencies[key] = versions[key];
    recipePackage.pnpm = { overrides: flux };
    await writeJson(resolve(destination, "package.json"), recipePackage);
    execute("pnpm", ["install", "--ignore-scripts"], destination);
    execute("pnpm", ["run", "build"], destination);
    report.recipes.push({
      scene: recipe.scene,
      status: "built",
      lockfileSha256: hashes(
        await readFile(resolve(destination, "pnpm-lock.yaml")),
      ).sha256,
    });
  }
  report.status = "passed";
} catch (error) {
  report.error = error instanceof Error ? error.message : String(error);
  console.error(report.error);
  process.exitCode = 1;
} finally {
  report.finishedAt = new Date().toISOString();
  await mkdir(dirname(evidencePath), { recursive: true });
  await writeJson(evidencePath, report);
  console.log(
    `Packed consumer evidence: ${relative(root, evidencePath)}. Temporary consumer retained for inspection; nothing published.`,
  );
}
