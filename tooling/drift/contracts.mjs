import ts from "typescript";
import {
  requiredComponentFiles,
  lifecycleStatuses,
} from "../../scripts/lib/component-readiness.mjs";
import { consumerPackages } from "../release/packed-consumer-contract.mjs";
import { parseSource } from "./routes.mjs";
import { historical, prose } from "./docs.mjs";
import { toEntrySlug } from "../size/lib.mjs";
import { validSizeClasses } from "../size/budgets.mjs";

function declaredTests(path, source) {
  const file = parseSource(path, source);
  const names = new Map();
  for (const statement of file.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const module = statement.moduleSpecifier.text;
    if (!["vitest", "node:test", "@playwright/test"].includes(module)) continue;
    if (module === "node:test" && statement.importClause?.name)
      names.set(statement.importClause.name.text, "test");
    const bindings = statement.importClause?.namedBindings;
    if (bindings && ts.isNamedImports(bindings))
      for (const binding of bindings.elements) {
        const name = binding.propertyName?.text ?? binding.name.text;
        if (["test", "it", "describe", "suite"].includes(name))
          names.set(binding.name.text, name);
      }
  }
  let count = 0;
  const selected = new Set();
  function visit(node) {
    if (ts.isCallExpression(node)) {
      let target = node.expression;
      const modifiers = [];
      while (
        ts.isCallExpression(target) ||
        ts.isPropertyAccessExpression(target)
      ) {
        if (ts.isPropertyAccessExpression(target))
          modifiers.push(target.name.text);
        target = target.expression;
      }
      if (ts.isIdentifier(target) && names.has(target.text)) {
        const restricted = modifiers.filter((name) =>
          [
            "only",
            "skip",
            "todo",
            "fixme",
            "fail",
            "fails",
            "skipIf",
            "runIf",
          ].includes(name),
        );
        for (const modifier of restricted) selected.add(modifier);
        if (
          restricted.length === 0 &&
          ["test", "it"].includes(names.get(target.text))
        )
          count++;
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  return { count, selected: [...selected] };
}

export function checkComponents(ctx) {
  const directory = "packages/react/src/components/";
  const families = new Set(
    [...ctx.files.keys()]
      .filter((path) => path.startsWith(directory))
      .map((path) => path.slice(directory.length).split("/")[0]),
  );
  if (families.size === 0) throw new Error("No component families discovered.");
  const components = [];
  const slugs = new Set();
  for (const family of [...families].sort()) {
    const prefix = directory + family + "/";
    for (const suffix of requiredComponentFiles) {
      const file = prefix + (suffix.startsWith(".") ? family + suffix : suffix);
      if (!ctx.files.has(file))
        ctx.add(
          "COMPONENT_COMPANION",
          prefix + "component.meta.json",
          `Missing required companion: ${file}`,
        );
    }
    const path = prefix + "component.meta.json";
    if (!ctx.files.has(path)) continue;
    const meta = ctx.json(path);
    for (const field of [
      "name",
      "slug",
      "category",
      "description",
      "status",
      "sizeClass",
    ])
      if (typeof meta[field] !== "string" || !meta[field].trim())
        ctx.add("COMPONENT_METADATA", path, `Missing string field: ${field}`);
    if (meta.name !== family || meta.slug !== toEntrySlug(family))
      ctx.add(
        "COMPONENT_IDENTITY",
        path,
        `Expected component identity ${family} -> ${toEntrySlug(family)}; received ${JSON.stringify(meta.name)} -> ${JSON.stringify(meta.slug)}.`,
      );
    if (slugs.has(meta.slug))
      ctx.add("COMPONENT_SLUG", path, `Duplicate slug: ${meta.slug}`);
    slugs.add(meta.slug);
    if (!lifecycleStatuses.includes(meta.status))
      ctx.add("COMPONENT_LIFECYCLE", path, `Unknown lifecycle: ${meta.status}`);
    if (!validSizeClasses.includes(meta.sizeClass))
      ctx.add(
        "COMPONENT_SIZE_CLASS",
        path,
        `Unknown sizeClass: ${meta.sizeClass}; expected one of ${validSizeClasses.join(", ")}.`,
      );
    const testPath = prefix + family + ".test.tsx";
    if (ctx.files.has(testPath)) {
      const tests = declaredTests(testPath, ctx.read(testPath));
      if (tests.count === 0)
        ctx.add(
          "COMPONENT_TEST",
          testPath,
          "No runnable Vitest test/it calls; a file alone is not test coverage.",
        );
      if (tests.selected.length)
        ctx.add(
          "COMPONENT_TEST_SELECTION",
          testPath,
          "Remove focused/skipped/todo test selection: " +
            tests.selected.join(", "),
        );
    }
    components.push(meta);
  }
  return components;
}

function hasExportTarget(target) {
  if (typeof target === "string") return target.length > 0;
  if (Array.isArray(target)) return target.some(hasExportTarget);
  return (
    target !== null &&
    typeof target === "object" &&
    Object.values(target).some(hasExportTarget)
  );
}

function safeExport(target) {
  if (target === null) return true;
  if (typeof target === "string")
    return (
      target.startsWith("./") &&
      !target.includes("\\") &&
      !target.split("/").includes("..")
    );
  if (Array.isArray(target)) return target.every(safeExport);
  return (
    target &&
    typeof target === "object" &&
    Object.values(target).every(safeExport)
  );
}

export function checkTestFiles(ctx) {
  let checked = 0;
  for (const [path, source] of ctx.files) {
    if (
      typeof source !== "string" ||
      !/\.(?:test|spec)\.[cm]?[jt]sx?$/u.test(path)
    )
      continue;
    const canonicalComponent =
      /^packages\/react\/src\/components\/([^/]+)\/([^/]+)\.test\.tsx$/u.exec(
        path,
      );
    if (canonicalComponent && canonicalComponent[1] === canonicalComponent[2])
      continue;
    checked += 1;
    const tests = declaredTests(path, source);
    if (tests.count === 0)
      ctx.add(
        "TEST_EMPTY",
        path,
        "Test/spec file registers no runnable test/it calls.",
      );
    if (tests.selected.length)
      ctx.add(
        "TEST_SELECTION",
        path,
        "Remove focused/skipped/todo test selection: " +
          tests.selected.join(", "),
      );
  }
  return { testFiles: checked };
}

export function checkPackages(ctx, policy) {
  const manifests = [...ctx.files.keys()].filter((path) =>
    /^(?:packages|apps)\/[^/]+\/package\.json$/u.test(path),
  );
  const packages = manifests.map((path) => ({
    path,
    manifest: ctx.json(path),
  }));
  const packageNames = packages.map(({ manifest }) => manifest.name);
  const names = new Set(packageNames);
  const privateNames = new Set(
    packages
      .filter(({ manifest }) => manifest.private === true)
      .map(({ manifest }) => manifest.name),
  );
  const publicContractNames = new Set(consumerPackages);
  if (packageNames.some((name) => typeof name !== "string" || !name.trim()))
    ctx.add(
      "PACKAGE_NAME",
      "package.json",
      "Every workspace package must have a non-empty string name.",
    );
  if (names.size !== packages.length)
    ctx.add(
      "PACKAGE_NAME",
      "package.json",
      "Workspace package names must be unique.",
    );
  for (const expected of consumerPackages)
    if (
      !packages.some(
        ({ manifest }) =>
          manifest.name === expected && manifest.private !== true,
      )
    )
      ctx.add(
        "PACKAGE_PUBLIC",
        "package.json",
        `Required public consumer package missing/private: ${expected}`,
      );
  for (const { path, manifest } of packages)
    if (
      manifest.private !== true &&
      typeof manifest.name === "string" &&
      !publicContractNames.has(manifest.name)
    )
      ctx.add(
        "PACKAGE_PUBLIC",
        path,
        `Public package is missing from the packed-consumer/release contract: ${manifest.name}`,
      );
  for (const { path, manifest: pkg } of packages) {
    for (const group of [
      "dependencies",
      "devDependencies",
      "peerDependencies",
      "optionalDependencies",
    ])
      for (const [name, value] of Object.entries(pkg[group] ?? {})) {
        if (
          typeof value !== "string" ||
          (value.startsWith("workspace:") && !names.has(name)) ||
          (names.has(name) && !value.startsWith("workspace:"))
        )
          ctx.add(
            "PACKAGE_DEPENDENCY",
            path,
            `Invalid ${group} reference: ${name}; internal workspace packages must use workspace:.`,
          );
        if (
          pkg.private !== true &&
          group !== "devDependencies" &&
          privateNames.has(name)
        )
          ctx.add(
            "PACKAGE_DEPENDENCY",
            path,
            `Public package cannot expose a runtime/peer dependency on private workspace package ${name}.`,
          );
      }
    for (const hook of ["preinstall", "install", "postinstall"])
      if (Object.hasOwn(pkg.scripts ?? {}, hook))
        ctx.add(
          "PACKAGE_INSTALL_HOOK",
          path,
          `Unexpected install-time hook: ${hook}`,
        );
    if (pkg.private === true) continue;
    const expected = {
      license: "MIT",
      homepage: policy.siteUrl,
      "repository.url": `git+https://github.com/${policy.repository}.git`,
      "repository.directory": path.slice(0, -13),
      "bugs.url": `https://github.com/${policy.repository}/issues`,
      "publishConfig.access": "public",
      "publishConfig.provenance": true,
    };
    for (const [key, value] of Object.entries(expected)) {
      const actual = key
        .split(".")
        .reduce((object, part) => object?.[part], pkg);
      if (actual !== value)
        ctx.add(
          "PACKAGE_METADATA",
          path,
          `${key}: expected ${JSON.stringify(value)}, received ${JSON.stringify(actual)}`,
        );
    }
    const exports = pkg.exports;
    const rootExport = Boolean(
      exports &&
      typeof exports === "object" &&
      !Array.isArray(exports) &&
      Object.hasOwn(exports, ".") &&
      hasExportTarget(exports["."]),
    );
    const exportKeys =
      exports &&
      typeof exports === "object" &&
      !Array.isArray(exports) &&
      Object.keys(exports).every(
        (key) => key === "." || (key.startsWith("./") && !key.includes("\\")),
      );
    if (
      !pkg.files?.includes("dist") ||
      !rootExport ||
      !exportKeys ||
      !safeExport(exports)
    )
      ctx.add(
        "PACKAGE_EXPORT",
        path,
        "Public files must include dist and a root subpath export; export keys and targets must remain inside the package.",
      );
  }
  return packages;
}

function workflowUses(source) {
  const uses = [];
  let offset = 0;
  for (const line of source.split("\n")) {
    const match =
      /^\s*(?:-\s*)?uses:\s*(?:"([^"\n]+)"|'([^'\n]+)'|([^\s#]+))/u.exec(line);
    if (match)
      uses.push({
        action: match[1] ?? match[2] ?? match[3],
        offset: offset + (match.index ?? 0),
      });
    offset += line.length + 1;
  }
  return uses;
}

export function checkToolchain(ctx, packages, policy) {
  const root = ctx.json("package.json");
  const names = new Set(
    packages
      .map(({ manifest }) => manifest.name)
      .filter((name) => typeof name === "string" && name),
  );
  const pnpm = /^pnpm@(\d+\.\d+\.\d+)$/u.exec(root.packageManager ?? "")?.[1];
  const node = ctx.read(".nvmrc").trim();
  for (const hook of ["preinstall", "install", "postinstall"])
    if (Object.hasOwn(root.scripts ?? {}, hook))
      ctx.add(
        "PACKAGE_INSTALL_HOOK",
        "package.json",
        `Unexpected root install-time hook: ${hook}`,
      );
  if (!pnpm || !/^\d+$/u.test(node) || root.engines?.node !== `>=${node}`)
    throw new Error(
      "packageManager, engines.node and .nvmrc must define a consistent pinned toolchain.",
    );
  for (const group of [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
  ])
    for (const [name, value] of Object.entries(root[group] ?? {}))
      if (
        names.has(name) &&
        (typeof value !== "string" || !value.startsWith("workspace:"))
      )
        ctx.add(
          "PACKAGE_DEPENDENCY",
          "package.json",
          `Root ${group} reference to workspace package ${name} must use workspace:.`,
        );

  const catalogSource = ctx.read("pnpm-workspace.yaml");
  const catalogSection = /^catalog:\s*\n((?:[ \t].*\n|\n)*)/mu.exec(
    catalogSource,
  )?.[1];
  if (!catalogSection) throw new Error("Missing workspace default catalog.");
  const catalog = new Set(
    [...catalogSection.matchAll(/^ {2}(?:"([^"\n]+)"|([^\s:#]+)):/gmu)].map(
      (match) => match[1] ?? match[2],
    ),
  );
  const used = new Set();
  for (const { path, manifest } of [
    { path: "package.json", manifest: root },
    ...packages,
  ])
    for (const group of [
      "dependencies",
      "devDependencies",
      "peerDependencies",
      "optionalDependencies",
    ])
      for (const [name, value] of Object.entries(manifest[group] ?? {})) {
        if (value === "catalog:") {
          used.add(name);
          if (!catalog.has(name))
            ctx.add(
              "CATALOG_MISSING",
              path,
              `Missing default catalog entry: ${name}`,
            );
        }
      }
  for (const name of catalog) {
    const reservation = policy.reservedCatalogDependencies[name];
    if (!used.has(name) && !reservation)
      ctx.add(
        "CATALOG_UNUSED",
        "pnpm-workspace.yaml",
        `Unused, undocumented catalog entry: ${name}`,
      );
    if (used.has(name) && reservation)
      ctx.add(
        "CATALOG_RESERVATION",
        "tooling/project.json",
        `Catalog reservation is stale because ${name} is now consumed.`,
      );
  }
  for (const name of Object.keys(policy.reservedCatalogDependencies))
    if (!catalog.has(name))
      ctx.add(
        "CATALOG_RESERVATION",
        "tooling/project.json",
        `Catalog reservation has no matching catalog entry: ${name}`,
      );

  const workflowActions = new Map();
  for (const [path, source] of ctx.files) {
    if (typeof source !== "string") continue;
    const evergreen =
      (path.endsWith(".md") &&
        !historical(source) &&
        !path.startsWith(".changeset/")) ||
      /^apps\/docs\/src\/pages\/.*\.tsx$/u.test(path);
    if (evergreen) {
      for (const match of source.matchAll(/\bpnpm[ @](\d+\.\d+\.\d+)\b/gu))
        if (match[1] !== pnpm)
          ctx.add(
            "TOOLCHAIN_PNPM",
            path,
            `Expected pnpm ${pnpm}, found ${match[1]}`,
            match.index,
          );
      for (const match of prose(source).matchAll(
        /(?:\b(?:[Cc]ontributors? (?:need|use)|[Uu]se|[Ww]ith|[Ww]orkflow uses)\s+\*{0,2}|^-\s*)Node(?:\.js)? (\d+)\b/gmu,
      ))
        if (match[1] !== node)
          ctx.add(
            "TOOLCHAIN_NODE",
            path,
            `Expected Node ${node}, found ${match[1]}`,
            match.index,
          );
    }
    if (!/^\.github\/workflows\/[^/]+\.ya?ml$/u.test(path)) continue;
    const workflow = workflowUses(source);
    workflowActions.set(path, new Set(workflow.map(({ action }) => action)));
    for (const { action, offset } of workflow) {
      if (action.startsWith("./")) {
        const local = action.slice(2);
        const exists =
          ctx.files.has(local) ||
          ctx.files.has(local + "/action.yml") ||
          ctx.files.has(local + "/action.yaml");
        if (!exists)
          ctx.add(
            "WORKFLOW_LOCAL",
            path,
            `Missing local action/workflow reference: ${action}`,
            offset,
          );
        continue;
      }
      const approved = policy.mutableActionExceptions[path]?.includes(action);
      if (!/@[a-f\d]{40}$/iu.test(action) && !approved)
        ctx.add(
          "WORKFLOW_PIN",
          path,
          `Unapproved mutable action: ${action}`,
          offset,
        );
      const block = source.slice(offset).split(/\n\s*-\s/u, 1)[0];
      if (action.startsWith("pnpm/action-setup@")) {
        const version = /\bversion:\s*["']?([^\s"'#]+)/u.exec(block)?.[1];
        if (version !== pnpm)
          ctx.add(
            "WORKFLOW_PNPM",
            path,
            `Setup pnpm must use ${pnpm}; found ${version}`,
            offset,
          );
      }
      if (action.startsWith("actions/setup-node@")) {
        const version = /\bnode-version:\s*["']?([^\s"'#]+)/u.exec(block)?.[1];
        if (version !== node)
          ctx.add(
            "WORKFLOW_NODE",
            path,
            `Setup Node must use ${node}; found ${version}`,
            offset,
          );
      }
    }
  }

  for (const [path, actions] of Object.entries(
    policy.mutableActionExceptions,
  )) {
    const seen = workflowActions.get(path);
    for (const action of actions) {
      if (!seen?.has(action))
        ctx.add(
          "WORKFLOW_EXCEPTION",
          "tooling/project.json",
          `Unused mutable-action exception: ${path} -> ${action}`,
        );
      if (/@[a-f\d]{40}$/iu.test(action))
        ctx.add(
          "WORKFLOW_EXCEPTION",
          "tooling/project.json",
          `Pinned action does not need a mutable-action exception: ${action}`,
        );
    }
  }
}

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/gu)].map((match) => [
      match[1],
      match[2],
    ]),
  );
}

export function checkSite(ctx, policy) {
  const path = "apps/docs/index.html";
  const html = ctx.read(path);
  const tags = [...html.matchAll(/<(?:link|meta)\b[^>]*>/giu)].map((match) =>
    attributes(match[0]),
  );
  for (const [field, value, attribute] of [
    ["rel", "canonical", "href"],
    ["property", "og:url", "content"],
  ]) {
    const found = tags.filter((tag) => tag[field] === value);
    if (found.length !== 1 || found[0][attribute] !== policy.siteUrl)
      ctx.add(
        "SITE_CANONICAL",
        path,
        `Exactly one ${value} must equal ${policy.siteUrl}`,
      );
  }
  const application = "docs/trust/best-practices.application.json";
  const project = ctx.json(application).project;
  if (
    project?.website !== policy.siteUrl ||
    project?.repository !== `https://github.com/${policy.repository}`
  )
    ctx.add(
      "SITE_TRUST",
      application,
      "Trust application project identity differs from the project contract.",
    );
  for (const file of [
    "README.md",
    "SECURITY.md",
    "docs/trust/BEST-PRACTICES.md",
  ])
    if (!ctx.read(file).includes(policy.siteUrl))
      ctx.add(
        "SITE_REFERENCE",
        file,
        `Missing canonical site ${policy.siteUrl}`,
      );
  for (const [file, source] of ctx.files) {
    if (typeof source !== "string") continue;
    const liveCatalogSurface =
      file === "README.md" ||
      (file.startsWith("docs/") &&
        file.endsWith(".md") &&
        !historical(source)) ||
      /^apps\/docs\/(?:src\/pages|tests)\/.*\.[jt]sx?$/u.test(file);
    if (!liveCatalogSurface) continue;
    const visible = file.endsWith(".md") ? prose(source) : source;
    for (const match of visible.matchAll(
      /\b(?:all\s+)?\d+\s+(?:tree-shakeable\s+)?icons\b|\b\d+\s+glyphs\b|\b\d+-icon\b/giu,
    ))
      ctx.add(
        "ICON_COUNT",
        file,
        "Do not hard-code the live icon catalog count; derive it or describe the catalog without a copied number.",
        match.index,
      );
  }

  for (const [file, source] of ctx.files) {
    if (
      typeof source !== "string" ||
      !/^apps\/docs\/src\//u.test(file) ||
      /\.(?:test|spec)\./u.test(file)
    )
      continue;
    if (source.includes("xanhast-pf.github.io/flux-ui"))
      ctx.add("SITE_OBSOLETE", file, "Obsolete public docs host.");
    if (/\bFlux(?: UI)? is (?:an? )?alpha\b|alpha-stage React/u.test(source))
      ctx.add(
        "DOC_LIFECYCLE",
        file,
        "Project maturity must not override per-family lifecycle metadata.",
      );
  }
}
