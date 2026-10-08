import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const workflows = new URL("../../.github/workflows/", import.meta.url);

function workflow(name) {
  return readFileSync(new URL(name, workflows), "utf8");
}

function retentions(source) {
  return [...source.matchAll(/retention-days: (\d+)/gu)].map(([, value]) =>
    Number(value),
  );
}

test("CI evidence is short-lived and avoids browser-trace uploads", () => {
  const ci = workflow("ci.yml");
  assert.deepEqual(retentions(ci), [1, 1]);
  assert.match(ci, /Upload quality evidence\s+if: success\(\)/u);
  assert.match(ci, /Upload browser evidence\s+if: success\(\)/u);
  assert.doesNotMatch(ci, /Upload Playwright diagnostics/u);
  assert.equal((ci.match(/actions\/download-artifact@/gu) ?? []).length, 2);
  assert.match(ci, /actions\/upload-pages-artifact@/u);
});

test("release artifacts expire within seven days without removing handoffs", () => {
  const release = workflow("release.yml");
  assert.deepEqual(retentions(release), [7, 1, 7, 7]);
  assert.match(release, /Preserve executed check evidence\s+if: failure\(\)/u);
  assert.equal(
    (release.match(/actions\/download-artifact@/gu) ?? []).length,
    3,
  );
  assert.equal((release.match(/actions\/upload-artifact@/gu) ?? []).length, 4);
});

test("Scorecard publishes findings without another artifact", () => {
  const scorecard = workflow("scorecard.yml");
  assert.deepEqual(retentions(scorecard), []);
  assert.doesNotMatch(scorecard, /actions\/upload-artifact@/u);
  assert.match(scorecard, /codeql-action\/upload-sarif@/u);
  assert.match(scorecard, /publish_results: true/u);
});
