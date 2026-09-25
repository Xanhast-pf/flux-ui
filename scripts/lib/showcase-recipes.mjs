import {
  mkdir,
  readFile,
  readdir,
  realpath,
  stat,
  writeFile,
} from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import ts from "typescript";
import projectPackage from "../../package.json" with { type: "json" };
const allowedBare =
  /^(?:react(?:\/(?:jsx-runtime|jsx-dev-runtime))?|react-dom(?:\/(?:client|server))?|@flux-ui\/(?:react|icons)|@flux-ui\/tokens\/(?:theme|reset|presets)\.css)$/u;
function confined(root, path) {
  const part = relative(root, path);
  if (
    isAbsolute(part) ||
    part === ".." ||
    part.startsWith(`..${sep}`) ||
    resolve(root, part) !== path
  )
    throw new Error(`Recipe import escapes its source directory: ${path}`);
  return part.split(sep).join("/");
}
async function dependencyPath(root, from, specifier) {
  if (!specifier.startsWith(".")) {
    if (!allowedBare.test(specifier))
      throw new Error(
        `Recipe needs an undeclared external dependency: ${specifier}`,
      );
    return null;
  }
  if (/[?#]/u.test(specifier))
    throw new Error(
      `Recipe asset queries need an explicit export contract: ${specifier}`,
    );
  const path = resolve(dirname(from), specifier);
  confined(root, path);
  const base = path.replace(/\.js$/u, "");
  const candidates = /\.js$/u.test(path)
    ? [`${base}.ts`, `${base}.tsx`, path]
    : [
        path,
        `${path}.ts`,
        `${path}.tsx`,
        resolve(path, "index.ts"),
        resolve(path, "index.tsx"),
      ];
  for (const candidate of candidates) {
    try {
      if (!(await stat(candidate)).isFile()) continue;
      const actual = await realpath(candidate);
      confined(root, actual);
      if (!/\.(?:tsx?|jsx?|css)$/u.test(actual))
        throw new Error(`Unsupported recipe asset: ${specifier}`);
      return actual;
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "ENOENT")
        continue;
      throw error;
    }
  }
  throw new Error(`Missing recipe dependency ${specifier} from ${from}`);
}
export async function collectRecipeSources(sourceRoot, entry) {
  const root = await realpath(sourceRoot);
  const files = new Map();
  async function visit(path) {
    const actual = await realpath(path);
    const key = `src/${confined(root, actual)}`;
    if (files.has(key)) return;
    const source = await readFile(actual, "utf8");
    files.set(key, source);
    if (actual.endsWith(".css")) {
      if (/@import\b|url\s*\(/iu.test(source))
        throw new Error(
          `CSS assets require an explicit recipe export contract: ${key}`,
        );
      return;
    }
    const parsed = ts.createSourceFile(
      actual,
      source,
      ts.ScriptTarget.Latest,
      true,
      actual.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );
    if (parsed.parseDiagnostics.length > 0)
      throw new Error(`Recipe source has syntax errors: ${key}`);
    const imports = new Set();
    function scan(node) {
      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier !== undefined &&
        ts.isStringLiteral(node.moduleSpecifier)
      )
        imports.add(node.moduleSpecifier.text);
      if (
        ts.isImportTypeNode(node) &&
        ts.isLiteralTypeNode(node.argument) &&
        ts.isStringLiteral(node.argument.literal)
      )
        imports.add(node.argument.literal.text);
      if (
        ts.isCallExpression(node) &&
        node.expression.kind === ts.SyntaxKind.ImportKeyword
      ) {
        const target = node.arguments[0];
        if (target === undefined || !ts.isStringLiteral(target))
          throw new Error(
            `Computed imports cannot be exported as a complete recipe: ${key}`,
          );
        imports.add(target.text);
      }
      ts.forEachChild(node, scan);
    }
    scan(parsed);
    for (const specifier of imports) {
      const dependency = await dependencyPath(root, actual, specifier);
      if (dependency !== null) await visit(dependency);
    }
  }
  await visit(resolve(root, entry));
  return Object.fromEntries(
    [...files.entries()].sort(([a], [b]) => a.localeCompare(b)),
  );
}
function catalogValue(catalog, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const value = new RegExp(
    `^  (?:"${escaped}"|${escaped}):\\s*([^\\s#]+)`,
    "mu",
  ).exec(catalog)?.[1];
  if (value === undefined || !/^[\^~]?[0-9][0-9A-Za-z.+-]*$/u.test(value))
    throw new Error(`Unsupported recipe catalog specifier for ${name}.`);
  return value;
}
export function recipeProject(
  scene,
  catalog,
  license,
  toolchain = projectPackage,
) {
  if (!/^[a-z]+(?:-[a-z]+)*$/u.test(scene))
    throw new Error("Unsafe recipe scene name.");
  const flux = Object.fromEntries(
    ["react", "tokens", "icons"].map((name) => [
      `@flux-ui/${name}`,
      `file:./vendor/flux-ui-${name}.tgz`,
    ]),
  );
  const pkg = {
    name: `flux-recipe-${scene}`,
    private: true,
    version: "0.0.0",
    type: "module",
    packageManager: toolchain.packageManager,
    engines: { node: toolchain.engines.node },
    scripts: {
      dev: "vite",
      build: "tsc --noEmit && vite build",
      preview: "vite preview",
    },
    dependencies: {
      ...flux,
      react: catalogValue(catalog, "react"),
      "react-dom": catalogValue(catalog, "react-dom"),
    },
    devDependencies: Object.fromEntries(
      ["vite", "typescript", "@types/react", "@types/react-dom"].map((name) => [
        name,
        catalogValue(catalog, name),
      ]),
    ),
    pnpm: { overrides: flux },
  };
  return {
    "package.json": `${JSON.stringify(pkg, null, 2)}\n`,
    "tsconfig.json": `${JSON.stringify({ compilerOptions: { target: "ES2022", lib: ["ES2023", "DOM", "DOM.Iterable"], module: "ESNext", moduleResolution: "Bundler", jsx: "react-jsx", strict: true, exactOptionalPropertyTypes: true, noUncheckedIndexedAccess: true, skipLibCheck: true, noEmit: true, types: ["vite/client"] }, include: ["src"] }, null, 2)}\n`,
    "index.html":
      '<!doctype html>\n<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>Flux application recipe</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n',
    "src/main.tsx": `import "@flux-ui/tokens/theme.css";\nimport "@flux-ui/tokens/reset.css";\nimport { Container, Stack } from "@flux-ui/react";\nimport { createRoot } from "react-dom/client";\nimport Scene from "./showcase/scenes/${scene}.preview.js";\nfunction App() {\n  return <Container as="main" size="full" query><Stack gap="lg" padding="md"><Scene /></Stack></Container>;\n}\nconst root = document.getElementById("root");\nif (root === null) throw new Error("Missing application root.");\ncreateRoot(root).render(<App />);\n`,
    "README.md": `# ${scene} — complete Flux UI source recipe\n\nThis is a local, fictional UI application. It contains the preview, every relative source dependency, approved artwork CSS, a React entrypoint and a Vite/TypeScript project. It does not contain backend services, audio processing, credentials, or published Flux package archives.\n\n## Use the exact candidate packages\n\nFlux may still be unreleased. Do not assume an npm version exists. Copy the approved candidate archives into \`vendor/flux-ui-react.tgz\`, \`vendor/flux-ui-tokens.tgz\` and \`vendor/flux-ui-icons.tgz\` (renaming files does not change their bytes). The package manifest deliberately points to these files and overrides transitive Flux resolution to the same archives.\n\nWith Node ${toolchain.engines.node.replace(/^>=/u, "")} and pnpm ${toolchain.packageManager.replace(/^pnpm@/u, "")}, run \`pnpm install\`, then \`pnpm dev\` or \`pnpm build\`. Tool versions mirror the source repository catalog. There is no generated dependency lockfile in this source export. Install resolution and the final consumer build must still be verified.\n\nOrdinary interface elements are public Flux components. The small local stylesheets, when present, are scene artwork rather than private component skins. Checkpoints and edits reset when the application is reloaded.\n\nThis recipe is a source export, not a release attestation or a claim that the package has passed browser compatibility tests.\n\n## License\n\nSee LICENSE for the original Flux UI MIT notice.\n`,
    LICENSE: license,
  };
}
export async function generateShowcaseRecipes(root, checkOnly) {
  const source = resolve(root, "apps/docs/src");
  const directory = resolve(source, "generated/recipes");
  const entries = (await readdir(resolve(source, "showcase/scenes")))
    .filter((name) => name.endsWith(".scene.ts"))
    .sort();
  const catalog = await readFile(resolve(root, "pnpm-workspace.yaml"), "utf8");
  const license = await readFile(resolve(root, "LICENSE"), "utf8");
  if (!checkOnly) await mkdir(directory, { recursive: true });
  let valid = true;
  let generated = [];
  try {
    generated = await readdir(directory);
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "ENOENT"))
      throw error;
  }
  const expectedNames = new Set(
    entries.map((name) => name.replace(/\.scene\.ts$/u, ".json")),
  );
  for (const name of generated) {
    if (!expectedNames.has(name)) {
      console.error(
        `Orphan generated recipe must be reviewed and removed: ${name}`,
      );
      valid = false;
    }
  }
  for (const name of entries) {
    const scene = name.replace(/\.scene\.ts$/u, "");
    const entry = `showcase/scenes/${scene}.preview.tsx`;
    const files = {
      ...recipeProject(scene, catalog, license),
      ...(await collectRecipeSources(source, entry)),
    };
    const recipe = { schemaVersion: 1, scene, entry: `src/${entry}`, files };
    const path = resolve(directory, `${scene}.json`);
    const expected = `${JSON.stringify(recipe, null, 2)}\n`;
    let current = "";
    try {
      current = await readFile(path, "utf8");
    } catch (error) {
      if (!(
        error instanceof Error &&
        "code" in error &&
        error.code === "ENOENT"
      ))
        throw error;
    }
    if (current === expected) continue;
    if (checkOnly) {
      console.error(`Generated recipe is stale: ${scene}`);
      valid = false;
    } else {
      await writeFile(path, expected);
      console.log(`Generated apps/docs/src/generated/recipes/${scene}.json`);
    }
  }
  if (!valid && !checkOnly)
    throw new Error(
      "Recipe generation found orphan files; no files were deleted.",
    );
  return valid;
}
