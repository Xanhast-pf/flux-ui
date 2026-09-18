import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

export const lifecycleStatuses = ["alpha", "beta", "stable"];

const requiredComponentFiles = [
  ".tsx",
  ".types.ts",
  ".css.ts",
  ".test.tsx",
  ".stories.tsx",
  ".bench.tsx",
  "index.ts",
  "component.meta.json",
];

const placeholderDocs = [
  "Document semantics and keyboard behavior before promoting this component.",
  "Customize this API summary alongside the component.",
];

function propertyName(node) {
  if (ts.isIdentifier(node) || ts.isStringLiteral(node)) return node.text;
  return null;
}

function unwrapExpression(expression) {
  let current = expression;
  while (
    ts.isSatisfiesExpression(current) ||
    ts.isAsExpression(current) ||
    ts.isParenthesizedExpression(current)
  ) {
    current = current.expression;
  }
  return current;
}

function meaningfulExample(examplePath) {
  if (!existsSync(examplePath)) return false;
  const source = readFileSync(examplePath, "utf8");
  if (placeholderDocs.some((placeholder) => source.includes(placeholder)))
    return false;

  const file = ts.createSourceFile(
    examplePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const assignment = file.statements.find((statement) =>
    ts.isExportAssignment(statement),
  );
  if (assignment === undefined) return false;
  const expression = unwrapExpression(assignment.expression);
  if (!ts.isObjectLiteralExpression(expression)) return false;

  function hasNonEmptyArray(name) {
    const property = expression.properties.find(
      (entry) =>
        ts.isPropertyAssignment(entry) && propertyName(entry.name) === name,
    );
    return (
      property !== undefined &&
      ts.isPropertyAssignment(property) &&
      ts.isArrayLiteralExpression(property.initializer) &&
      property.initializer.elements.length > 0
    );
  }

  return hasNonEmptyArray("notes") && hasNonEmptyArray("props");
}

function hasBundledBaseline(sizeBaseline, slug) {
  const bundled = sizeBaseline.components?.[slug]?.bundled;
  return (
    bundled !== undefined &&
    ["raw", "gzip", "brotli"].every(
      (key) => Number.isFinite(bundled[key]) && bundled[key] >= 0,
    )
  );
}

function hasPublicDeprecation(componentDir) {
  return readdirSync(componentDir, { withFileTypes: true }).some((entry) => {
    if (!entry.isFile() || !/\.(?:ts|tsx)$/u.test(entry.name)) return false;
    if (/\.(?:test|stories|bench)\.(?:ts|tsx)$/u.test(entry.name)) return false;
    return readFileSync(path.join(componentDir, entry.name), "utf8").includes(
      "@deprecated",
    );
  });
}

function catalogDrivenCoverage(root, relativePath) {
  const source = readFileSync(path.resolve(root, relativePath), "utf8");
  return (
    source.includes("for (const component of components)") &&
    source.includes("component.slug")
  );
}

export function evaluateLifecycle(meta, blockers) {
  const errors = [];
  const status = meta.status;
  if (!lifecycleStatuses.includes(status)) {
    errors.push(
      meta.name +
        ": component.meta.json status must be one of " +
        lifecycleStatuses.join(", ") +
        ".",
    );
  }

  const eligibleForBetaReview = blockers.length === 0;
  if ((status === "beta" || status === "stable") && !eligibleForBetaReview) {
    errors.push(
      meta.name +
        ": status " +
        JSON.stringify(status) +
        " requires complete automated promotion evidence: " +
        blockers.join("; ") +
        ".",
    );
  }

  if (status === "stable") {
    if (
      typeof meta.stableSince !== "string" ||
      !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u.test(meta.stableSince)
    ) {
      errors.push(
        meta.name +
          ": stable components require component.meta.json stableSince as a semver release.",
      );
    }
  } else if (Object.hasOwn(meta, "stableSince")) {
    errors.push(
      meta.name +
        ": stableSince is only valid when component.meta.json status is stable.",
    );
  }

  return {
    errors,
    eligibleForBetaReview,
    eligibleForStableReview: status === "beta" && eligibleForBetaReview,
  };
}

export function createComponentReadiness(root, publicContracts) {
  const componentRoot = path.resolve(root, "packages/react/src/components");
  const exampleRoot = path.resolve(root, "apps/docs/src/examples");
  const sizeBaseline = JSON.parse(
    readFileSync(path.resolve(root, "tooling/size/baseline.json"), "utf8"),
  );
  const browserCatalogCoverage = catalogDrivenCoverage(
    root,
    "apps/docs/tests/workshop.spec.ts",
  );
  const accessibilityCatalogCoverage = catalogDrivenCoverage(
    root,
    "apps/docs/tests/a11y.spec.ts",
  );
  const contractBySlug = new Map(
    publicContracts.map((contract) => [contract.slug, contract]),
  );
  const components = [];
  const errors = [];

  const metadataPaths = readdirSync(componentRoot)
    .map((name) => path.join(componentRoot, name, "component.meta.json"))
    .filter((metaPath) => existsSync(metaPath))
    .sort((left, right) => left.localeCompare(right));

  for (const metaPath of metadataPaths) {
    const componentDir = path.dirname(metaPath);
    const directoryName = path.basename(componentDir);
    const meta = JSON.parse(readFileSync(metaPath, "utf8"));
    const blockers = [];

    for (const suffix of requiredComponentFiles) {
      const fileName =
        suffix.startsWith(".") && suffix !== ".meta.json"
          ? directoryName + suffix
          : suffix;
      if (!existsSync(path.join(componentDir, fileName)))
        blockers.push("missing " + fileName);
    }

    if (!contractBySlug.has(meta.slug))
      blockers.push("missing public contract");

    const examplePath = path.join(exampleRoot, meta.slug + ".example.tsx");
    const previewPath = path.join(exampleRoot, meta.slug + ".preview.tsx");
    if (!existsSync(previewPath)) blockers.push("missing live docs preview");
    if (!meaningfulExample(examplePath))
      blockers.push("docs notes/API highlights are incomplete");

    if (!hasBundledBaseline(sizeBaseline, meta.slug))
      blockers.push("missing accepted bundled size baseline");
    if (hasPublicDeprecation(componentDir))
      blockers.push("deprecated public API remains");
    if (!browserCatalogCoverage)
      blockers.push("catalog browser route coverage is not active");
    if (!accessibilityCatalogCoverage)
      blockers.push("catalog accessibility coverage is not active");

    const lifecycle = evaluateLifecycle(meta, blockers);
    errors.push(...lifecycle.errors);
    components.push({
      name: meta.name,
      slug: meta.slug,
      status: meta.status,
      ...(meta.stableSince === undefined
        ? {}
        : { stableSince: meta.stableSince }),
      eligibleForBetaReview: lifecycle.eligibleForBetaReview,
      eligibleForStableReview: lifecycle.eligibleForStableReview,
      blockers,
    });
  }

  const status = Object.fromEntries(
    lifecycleStatuses.map((value) => [
      value,
      components.filter((component) => component.status === value).length,
    ]),
  );

  return {
    summary: {
      total: components.length,
      status,
      eligibleForBetaReview: components.filter(
        (component) => component.eligibleForBetaReview,
      ).length,
      eligibleForStableReview: components.filter(
        (component) => component.eligibleForStableReview,
      ).length,
      blocked: components.filter((component) => component.blockers.length > 0)
        .length,
      browserCatalogCoverage,
      accessibilityCatalogCoverage,
    },
    components,
    errors,
  };
}
