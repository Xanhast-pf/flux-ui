import { fileURLToPath, pathToFileURL } from "node:url";
import { context, readInventory } from "./inventory.mjs";
import { checkDocumentation } from "./docs.mjs";
import { checkRoutes } from "./routes.mjs";
import {
  checkComponents,
  checkTestFiles,
  checkPackages,
  checkSite,
  checkToolchain,
} from "./contracts.mjs";

/** Pure analysis entry point: fixture maps use the same rules as real checkouts. */
export function analyze(files) {
  const ctx = context(files);
  let policy;
  const metrics = { files: files.size };
  try {
    policy = ctx.json("tooling/project.json");
    const record = (value) =>
      value !== null && typeof value === "object" && !Array.isArray(value);
    const reserved = policy.reservedCatalogDependencies;
    const actionExceptions = policy.mutableActionExceptions;
    const validReserved =
      record(reserved) &&
      Object.values(reserved).every(
        (reason) => typeof reason === "string" && reason.trim(),
      );
    const validActionExceptions =
      record(actionExceptions) &&
      Object.entries(actionExceptions).every(
        ([path, actions]) =>
          /^\.github\/workflows\/[^/]+\.ya?ml$/u.test(path) &&
          Array.isArray(actions) &&
          actions.length > 0 &&
          actions.every(
            (action) => typeof action === "string" && action.trim(),
          ),
      );
    if (
      policy.schemaVersion !== 1 ||
      !/^https:\/\/[^/?#]+\/$/u.test(policy.siteUrl) ||
      !/^[\w.-]+\/[\w.-]+$/u.test(policy.repository) ||
      !validReserved ||
      !validActionExceptions
    )
      throw new Error("Invalid project identity contract.");
  } catch (error) {
    ctx.add("DRIFT_INPUT", "tooling/project.json", error.message);
    return finish(ctx, metrics);
  }
  const run = (label, check) => {
    try {
      return check();
    } catch (error) {
      ctx.add("DRIFT_INPUT", label, error.message);
      return null;
    }
  };
  const components = run("packages/react/src/components", () =>
    checkComponents(ctx),
  );
  Object.assign(metrics, run("test files", () => checkTestFiles(ctx)) ?? {});
  const packages = run("package.json", () => checkPackages(ctx, policy));
  if (packages)
    run("pnpm-workspace.yaml", () => checkToolchain(ctx, packages, policy));
  run("apps/docs/index.html", () => checkSite(ctx, policy));
  Object.assign(
    metrics,
    run("docs/README.md", () => checkDocumentation(ctx, policy)) ?? {},
  );
  if (components)
    Object.assign(
      metrics,
      run("apps/docs/src/lib/routing.ts", () =>
        checkRoutes(ctx, components, policy),
      ) ?? {},
    );
  metrics.components = components?.length ?? 0;
  metrics.publicPackages =
    packages?.filter(({ manifest }) => manifest.private !== true).length ?? 0;
  return finish(ctx, metrics);
}

function finish(ctx, metrics) {
  const findings = ctx.findings.sort(
    (a, b) =>
      a.path.localeCompare(b.path, "en") ||
      a.line - b.line ||
      a.rule.localeCompare(b.rule, "en"),
  );
  const errors = findings.filter(
    (finding) => finding.severity === "error",
  ).length;
  const warnings = findings.length - errors;
  return {
    schemaVersion: 1,
    status: errors ? "failed" : "passed",
    metrics,
    errors,
    warnings,
    findings,
  };
}

export function formatReport(report) {
  return [
    "Flux repository drift",
    ...report.findings.map(
      ({ severity, rule, path, line, message }) =>
        `${severity.toUpperCase()} ${rule} ${path}:${line} ${message}`,
    ),
    `${report.errors} errors; ${report.warnings} warnings; ${report.metrics.components ?? 0} component families; ${report.metrics.publicPackages ?? 0} public packages`,
  ].join("\n");
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const args = process.argv.slice(2);
  if (args.some((arg) => !["--json", "--strict"].includes(arg))) {
    console.error("Usage: node tooling/drift/check.mjs [--json] [--strict]");
    process.exitCode = 2;
  } else {
    let report;
    try {
      report = analyze(
        readInventory(fileURLToPath(new URL("../../", import.meta.url))),
      );
    } catch (error) {
      report = {
        schemaVersion: 1,
        status: "failed",
        metrics: {},
        errors: 1,
        warnings: 0,
        findings: [
          {
            rule: "DRIFT_INPUT",
            severity: "error",
            path: ".",
            line: 1,
            message: error.message,
          },
        ],
      };
    }
    console.log(
      args.includes("--json")
        ? JSON.stringify(report, null, 2)
        : formatReport(report),
    );
    process.exitCode =
      report.errors || (args.includes("--strict") && report.warnings) ? 1 : 0;
  }
}
