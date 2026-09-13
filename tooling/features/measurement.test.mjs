import assert from "node:assert/strict";
import test from "node:test";
import {
  assertReferenceEquivalence,
  summarizeWorkload,
} from "../../apps/docs/src/lab/statistics.ts";
const sample = {
  scenario: "grid",
  count: 100,
  variant: "flux",
  fixtureRevision: 2,
  layout: { display: "grid", gap: "24px" },
  mountMs: 2,
  updateMs: 3,
  unmountMs: 1,
  mountToFrameMs: 16,
  updateToFrameMs: 16,
  domNodes: 101,
};
test("reference comparison rejects different layouts or missing revision evidence", () => {
  assertReferenceEquivalence({ ...sample, variant: "native" }, sample);
  assert.throws(
    () =>
      assertReferenceEquivalence(
        {
          ...sample,
          variant: "native",
          layout: { ...sample.layout, gap: "16px" },
        },
        sample,
      ),
    /differs/,
  );
  assert.throws(
    () =>
      assertReferenceEquivalence(
        { ...sample, variant: "native", fixtureRevision: 1 },
        sample,
      ),
    /different workloads/,
  );
  assert.throws(
    () =>
      assertReferenceEquivalence(
        { ...sample, variant: "native", layout: {} },
        sample,
      ),
    /Missing/,
  );
});
test("workload statistics publish absolute values, not a fabricated native ratio", () => {
  const result = summarizeWorkload("grid", 100, [
    sample,
    { ...sample, mountMs: 4 },
  ]);
  assert.equal(result.metrics.mountMs.median, 3);
  assert.equal(result.metrics.mountMs.minimum, 2);
  assert.equal(result.metrics.mountMs.maximum, 4);
  assert.equal(result.domNodes, 101);
  assert.equal("ratio" in result.metrics.mountMs, false);
});
