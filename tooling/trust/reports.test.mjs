import assert from "node:assert/strict";
import { test } from "node:test";
import { validateReport } from "./reports.mjs";
const source = { commit: "a".repeat(40) };
test("size evidence requires complete finite measurements", () => {
  const metric = { raw: 10, gzip: 5, brotli: 4 };
  const report = {
    schemaVersion: 1,
    componentCount: 1,
    checkedComponentCount: 1,
    components: { button: metric },
    aggregate: { rootEntry: metric, runtime: metric, published: metric },
  };
  assert.equal(validateReport("size.json", report, source), report);
  assert.throws(() =>
    validateReport(
      "size.json",
      { ...report, checkedComponentCount: 0 },
      source,
    ),
  );
  assert.throws(() =>
    validateReport(
      "size.json",
      { ...report, components: { button: { ...metric, raw: NaN } } },
      source,
    ),
  );
});
test("browser evidence cannot be empty, failed or flaky", () => {
  const valid = { stats: { expected: 5, unexpected: 0, flaky: 0 }, errors: [] };
  assert.equal(validateReport("browser-tests.json", valid, source), valid);
  for (const key of ["unexpected", "flaky"])
    assert.throws(() =>
      validateReport(
        "browser-tests.json",
        { ...valid, stats: { ...valid.stats, [key]: 1 } },
        source,
      ),
    );
  assert.throws(() =>
    validateReport(
      "browser-tests.json",
      { ...valid, errors: ["failure"] },
      source,
    ),
  );
  assert.throws(() => validateReport("browser-tests.json", {}, source));
});
test("runtime evidence requires every current full-run sample", () => {
  const report = {
    schemaVersion: 1,
    mode: "full",
    commit: source.commit,
    count: 1000,
    iterations: 15,
    summaries: { button: {}, grid: {} },
    rawSamples: ["button", "grid"].map((scenario) => ({
      scenario,
      samples: Object.fromEntries(
        ["raw", "native", "flux"].map((variant) => [
          variant,
          Array.from({ length: 15 }, () => ({
            scenario,
            variant,
            count: 1000,
            mountMs: 1,
            updateMs: 1,
            unmountMs: 1,
            mountToFrameMs: 1,
            updateToFrameMs: 1,
            domNodes: 10,
          })),
        ]),
      ),
    })),
  };
  assert.equal(validateReport("runtime.json", report, source), report);
  assert.throws(() =>
    validateReport(
      "runtime.json",
      { ...report, commit: "b".repeat(40) },
      source,
    ),
  );
  assert.throws(() =>
    validateReport("runtime.json", { ...report, mode: "smoke" }, source),
  );
  report.rawSamples[0].samples.flux.pop();
  assert.throws(() => validateReport("runtime.json", report, source));
});
