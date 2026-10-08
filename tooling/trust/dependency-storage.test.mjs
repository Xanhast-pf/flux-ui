import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const workflow = readFileSync(
  new URL("../../.github/workflows/dependencies.yml", import.meta.url),
  "utf8",
);

test("dependency security checks remain enforced without Actions artifact uploads", () => {
  assert.match(workflow, /^ {2}pull_request:$/mu);
  assert.match(workflow, /^ {2}merge_group:$/mu);
  assert.match(workflow, /^ {4}branches: \[main\]$/mu);
  assert.match(workflow, /^ {4}name: Dependency review$/mu);
  assert.match(workflow, /^ {4}name: Lockfile audit$/mu);
  assert.match(workflow, /^ {8}run: pnpm audit --audit-level=high$/mu);
  assert.doesNotMatch(workflow, /upload-artifact|save-cache/u);
  assert.doesNotMatch(workflow, /continue-on-error:\s*true/u);
});
