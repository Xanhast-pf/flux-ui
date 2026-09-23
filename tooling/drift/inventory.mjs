import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const excluded = new Set([
  ".git",
  ".cache",
  "node_modules",
  "dist",
  "coverage",
  "storybook-static",
  "test-results",
  "playwright-report",
]);
const textFile = /\.(?:[cm]?[jt]sx?|json|ya?ml|md|html)$/u;

/** A bounded read-only inventory; never follows symlinks or loads build output. */
export function readInventory(root) {
  const files = new Map();
  function visit(directory, prefix = "") {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (excluded.has(entry.name)) continue;
      const path = prefix + entry.name;
      const absolute = join(directory, entry.name);
      if (entry.isSymbolicLink()) {
        if (textFile.test(path))
          throw new Error(`Source symlink must be reviewed: ${path}`);
        continue;
      }
      if (entry.isDirectory()) visit(absolute, `${path}/`);
      else if (entry.isFile()) {
        if (files.size >= 20000)
          throw new Error("Drift inventory exceeded 20,000 files.");
        const readable =
          (textFile.test(path) || path === ".nvmrc") &&
          !path.includes("/generated/") &&
          path !== "pnpm-lock.yaml";
        if (readable && statSync(absolute).size > 2 * 1024 * 1024)
          throw new Error(
            `Source file exceeds the 2 MiB drift scan limit: ${path}`,
          );
        files.set(path, readable ? readFileSync(absolute, "utf8") : null);
      }
    }
  }
  visit(root);
  return files;
}

export function context(files) {
  const findings = [];
  return {
    files,
    findings,
    read(path) {
      const source = files.get(path);
      if (typeof source !== "string")
        throw new Error(`Missing readable source: ${path}`);
      return source;
    },
    json(path) {
      return JSON.parse(this.read(path));
    },
    add(rule, path, message, offset = 0, severity = "error") {
      const source = files.get(path) ?? "";
      findings.push({
        rule,
        severity,
        path,
        line: source.slice(0, offset).split("\n").length,
        message,
      });
    },
  };
}
