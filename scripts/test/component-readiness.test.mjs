import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  createComponentReadiness,
  evaluateLifecycle,
} from "../lib/component-readiness.mjs";
import { createPublicContracts } from "../lib/public-contracts.mjs";

test("all current Core families carry complete automated beta-review evidence", () => {
  const root = process.cwd();
  const componentRoot = path.resolve(root, "packages/react/src/components");
  const expectedFamilies = readdirSync(componentRoot).filter((name) =>
    existsSync(path.join(componentRoot, name, "component.meta.json")),
  ).length;
  const { contracts, errors: contractErrors } = createPublicContracts(root);
  assert.deepEqual(contractErrors, []);
  const readiness = createComponentReadiness(root, contracts);
  assert.deepEqual(readiness.errors, []);
  assert.equal(readiness.summary.total, expectedFamilies);
  assert.deepEqual(readiness.summary.status, {
    alpha: expectedFamilies,
    beta: 0,
    stable: 0,
  });
  assert.equal(readiness.summary.eligibleForBetaReview, expectedFamilies);
  assert.equal(readiness.summary.eligibleForStableReview, 0);
  assert.equal(readiness.summary.blocked, 0);
  assert.equal(readiness.summary.browserCatalogCoverage, true);
  assert.equal(readiness.summary.accessibilityCatalogCoverage, true);
});

test("beta and stable labels cannot outrun their evidence", () => {
  assert.deepEqual(
    evaluateLifecycle({ name: "Example", status: "beta" }, ["missing size"])
      .errors,
    [
      'Example: status "beta" requires complete automated promotion evidence: missing size.',
    ],
  );
  assert.deepEqual(
    evaluateLifecycle({ name: "Example", status: "stable" }, []).errors,
    [
      "Example: stable components require component.meta.json stableSince as a semver release.",
    ],
  );
  assert.deepEqual(
    evaluateLifecycle(
      { name: "Example", status: "stable", stableSince: "1.0.0" },
      [],
    ).errors,
    [],
  );
});
