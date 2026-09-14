import assert from "node:assert/strict";
import { test } from "node:test";
import { validateReport } from "./reports.mjs";
import { sizeReport } from "./fixtures/size-report.mjs";
const source = { commit: "a".repeat(40) };
test("size evidence accepts complete passing schema-2 reports", () => {
  for (const slugs of [["button"], ["button", "grid"]]) {
    const report = sizeReport(slugs);
    assert.equal(validateReport("size.json", report, source), report);
  }
});

for (const [name, mutate, message] of [
  [
    "legacy schema",
    (report) => {
      report.schemaVersion = 1;
    },
    /schema/u,
  ],
  [
    "unknown schema",
    (report) => {
      report.schemaVersion = 3;
    },
    /schema/u,
  ],
  [
    "missing schema",
    (report) => {
      delete report.schemaVersion;
    },
    /schema/u,
  ],
  [
    "no components",
    (report) => {
      report.componentCount = 0;
    },
    /every component/u,
  ],
  [
    "fractional count",
    (report) => {
      report.componentCount = 1.5;
    },
    /every component/u,
  ],
  [
    "partial count",
    (report) => {
      report.checkedComponentCount = 1;
    },
    /every component/u,
  ],
  [
    "missing component",
    (report) => {
      delete report.components.grid;
    },
    /every component/u,
  ],
  [
    "missing emitted graph",
    (report) => {
      delete report.emittedGraphs.grid;
    },
    /emittedGraphs/u,
  ],
  [
    "missing bundle",
    (report) => {
      delete report.bundledEntries.grid;
    },
    /bundledEntries/u,
  ],
  [
    "extra bundle",
    (report) => {
      report.bundledEntries.unknown = report.bundledEntries.grid;
    },
    /bundledEntries/u,
  ],
  [
    "wrong bundle slug with matching count",
    (report) => {
      report.bundledEntries.unknown = report.bundledEntries.grid;
      delete report.bundledEntries.grid;
    },
    /bundledEntries/u,
  ],
  [
    "missing gate",
    (report) => {
      delete report.componentGates.grid;
    },
    /componentGates/u,
  ],
  [
    "missing coverage",
    (report) => {
      delete report.bundledEntryCoverage;
    },
    /coverage/u,
  ],
  [
    "missing measured slug",
    (report) => {
      report.bundledEntryCoverage.measured.pop();
    },
    /coverage/u,
  ],
  [
    "duplicate measured slug",
    (report) => {
      report.bundledEntryCoverage.measured = ["button", "button"];
    },
    /coverage/u,
  ],
  [
    "unknown measured slug",
    (report) => {
      report.bundledEntryCoverage.measured = ["button", "unknown"];
    },
    /coverage/u,
  ],
  [
    "unmeasured component",
    (report) => {
      report.bundledEntryCoverage.unmeasured.push("grid");
    },
    /coverage/u,
  ],
  [
    "missing unmeasured list",
    (report) => {
      delete report.bundledEntryCoverage.unmeasured;
    },
    /coverage/u,
  ],
  [
    "failed gate",
    (report) => {
      report.componentGates.grid.result = "fail";
    },
    /passing bundled gate/u,
  ],
  [
    "absolute failure despite pass label",
    (report) => {
      report.componentGates.grid.absoluteFailures.push({ metric: "brotli" });
    },
    /passing bundled gate/u,
  ],
  [
    "regression despite pass label",
    (report) => {
      report.componentGates.grid.regressions.push({ metric: "baseline" });
    },
    /passing bundled gate/u,
  ],
  [
    "missing gate result",
    (report) => {
      delete report.componentGates.grid.result;
    },
    /passing bundled gate/u,
  ],
  [
    "missing regression array",
    (report) => {
      delete report.componentGates.grid.regressions;
    },
    /passing bundled gate/u,
  ],
  [
    "baseline review or update",
    (report) => {
      report.baselineChanges = {};
    },
    /baseline proposal/u,
  ],
  [
    "missing aggregate",
    (report) => {
      delete report.aggregate;
    },
    /aggregate/u,
  ],
  [
    "missing aggregate measurement",
    (report) => {
      delete report.aggregate.runtime;
    },
    /aggregate/u,
  ],
  [
    "empty aggregate",
    (report) => {
      report.aggregate = {};
    },
    /aggregate/u,
  ],
  [
    "divergent diagnostic alias",
    (report) => {
      report.emittedGraphs.grid.raw += 1;
    },
    /emitted graph/u,
  ],
]) {
  test(`size evidence rejects ${name}`, () => {
    const report = sizeReport(["button", "grid"]);
    mutate(report);
    assert.throws(() => validateReport("size.json", report, source), message);
  });
}

for (const section of [
  "components",
  "emittedGraphs",
  "bundledEntries",
  "aggregate",
]) {
  test(`size evidence requires finite non-negative measurements in ${section}`, () => {
    for (const metric of ["raw", "gzip", "brotli"]) {
      for (const value of [NaN, Infinity, -1, null, "10", undefined]) {
        const report = sizeReport();
        const key = section === "aggregate" ? "runtime" : "button";
        report[section][key][metric] = value;
        assert.throws(
          () => validateReport("size.json", report, source),
          /size measurement/u,
        );
      }
    }
  });
}

test("size evidence rejects malformed maps instead of accepting arrays or null", () => {
  for (const section of [
    "components",
    "emittedGraphs",
    "bundledEntries",
    "componentGates",
    "aggregate",
  ]) {
    for (const value of [null, [], "invalid"]) {
      const report = sizeReport();
      report[section] = value;
      assert.throws(() => validateReport("size.json", report, source), Error);
    }
  }
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

test("consumer browser reports must be executed, clean and non-flaky", () => {
  const report = {
    stats: { expected: 6, unexpected: 0, flaky: 0 },
    errors: [],
  };
  assert.equal(validateReport("consumer-tests.json", report, source), report);
  for (const key of ["unexpected", "flaky"])
    assert.throws(() =>
      validateReport(
        "consumer-tests.json",
        { ...report, stats: { ...report.stats, [key]: 1 } },
        source,
      ),
    );
  assert.throws(() =>
    validateReport(
      "consumer-tests.json",
      { ...report, stats: { ...report.stats, expected: 0 } },
      source,
    ),
  );
});
