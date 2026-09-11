import assert from "node:assert/strict";
import { test } from "node:test";
import {
  median,
  summarize,
  validateConfig,
} from "../../apps/docs/src/lab/statistics.ts";

function sample(variant, timing) {
  return {
    scenario: "button",
    variant,
    count: 100,
    mountMs: timing,
    updateMs: timing,
    unmountMs: timing,
    mountToFrameMs: timing,
    updateToFrameMs: timing,
    domNodes: 200,
  };
}
function pair(native, flux) {
  return { native: sample("native", native), flux: sample("flux", flux) };
}
test("median handles odd/even samples without mutating input", () => {
  const values = [5, 1, 3];
  assert.equal(median(values), 3);
  assert.deepEqual(values, [5, 1, 3]);
  assert.equal(median([4, 1, 2, 3]), 2.5);
  for (const invalid of [[], [NaN], [Infinity]])
    assert.throws(() => median(invalid));
});
test("lab configuration refuses unbounded or fractional work", () => {
  for (const count of [0, -1, 100.5, 5001, Infinity, NaN])
    assert.throws(() => validateConfig(count, 3));
  for (const iterations of [0, 1, 2, 50, Infinity])
    assert.throws(() => validateConfig(100, iterations));
  validateConfig(5000, 7);
});
test("ratios are calculated per pair, not from unrelated median values", () => {
  const result = summarize("button", 100, [
    pair(1, 10),
    pair(10, 20),
    pair(100, 1),
  ]).metrics.mountMs;
  assert.equal(result.ratio, 2);
  assert.equal(result.flux / result.native, 1);
  assert.equal(result.delta, 9);
  assert.equal(result.minimum, 1);
  assert.equal(result.maximum, 20);
});
test("zero native timer resolution remains unknown rather than Infinity or 1x", () => {
  assert.equal(
    summarize("button", 100, [pair(0, 1)]).metrics.mountMs.ratio,
    null,
  );
});
test("mismatched and invalid paired samples cannot become a benchmark result", () => {
  for (const mutate of [
    (p) => {
      p.flux.count = 200;
    },
    (p) => {
      p.native.variant = "flux";
    },
    (p) => {
      p.flux.updateMs = -1;
    },
    (p) => {
      p.flux.mountMs = NaN;
    },
  ]) {
    const value = pair(1, 2);
    mutate(value);
    assert.throws(() => summarize("button", 100, [value]));
  }
  assert.throws(() => summarize("button", 100, []));
});
