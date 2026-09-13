import assert from "node:assert/strict";
import test from "node:test";
import {
  codeLanguages,
  tokenizeCode,
} from "../../packages/react/src/components/CodeBlock/tokenizeCode.ts";
import { codeSegments } from "../../packages/react/src/components/CodeBlock/codeSegments.ts";
import {
  chartModel,
  nearestChartIndex,
  reduceChartPoints,
} from "../../packages/react/src/components/Chart/chartModel.ts";
import {
  knobFraction,
  knobValue,
  snapKnob,
  validateKnob,
} from "../../packages/react/src/components/Knob/knobMath.ts";
import {
  cellValue,
  identifyRows,
  nextDataSort,
  sortDataRows,
  tableWindow,
} from "../../packages/react/src/components/DataTable/tableModel.ts";

test("all built-in languages preserve literal source and return ordered token ranges", () => {
  const code =
    'const answer = 42;\n<script>alert("<&>");</script>\n# comment 😀\nSELECT id FROM table;\n';
  for (const language of codeLanguages) {
    const tokens = tokenizeCode(code, language);
    const segments = codeSegments(code, tokens);
    assert.equal(segments.map((segment) => segment.content).join(""), code);
    assert.ok(
      tokens.every(
        (token, i) =>
          token.end > token.start && token.start >= (tokens[i - 1]?.end ?? 0),
      ),
    );
  }
  assert.deepEqual(tokenizeCode(code, "unknown"), []);
});
test("malformed provider ranges and kinds fall back to the complete original source", () => {
  for (const tokens of [
    null,
    {},
    [null],
    [{ start: -1, end: 1, kind: "keyword" }],
    [{ start: 0, end: 99, kind: "string" }],
    [{ start: 0, end: 1, kind: "html" }],
    [
      { start: 1, end: 3, kind: "keyword" },
      { start: 2, end: 4, kind: "string" },
    ],
  ]) {
    assert.deepEqual(codeSegments("source", tokens), [
      { start: 0, content: "source" },
    ]);
  }
});
test("large or malformed snippets stay bounded without dropping text", () => {
  const oversized = "x".repeat(500001);
  assert.deepEqual(tokenizeCode(oversized, "typescript"), []);
  for (const code of [
    '"' + "\\x".repeat(150000),
    "[".repeat(200000),
    "const x=1;\n".repeat(25000),
  ]) {
    const tokens = tokenizeCode(code, "typescript");
    assert.ok(tokens.length <= 20000);
    assert.equal(
      codeSegments(code, tokens)
        .map((segment) => segment.content)
        .join(""),
      code,
    );
  }
});
test("chart reduction preserves endpoints, gaps and extrema inside the rendering budget", () => {
  const data = Array.from({ length: 10000 }, (_, x) => ({
    x,
    y: x === 500 ? 999 : x === 510 ? -999 : x === 5000 ? null : Math.sin(x),
  }));
  const segments = reduceChartPoints(data, 100);
  const reduced = segments.flat();
  assert.equal(segments.length, 2);
  assert.ok(reduced.length <= 100);
  assert.equal(reduced[0].x, 0);
  assert.equal(reduced.at(-1).x, 9999);
  assert.ok(reduced.some((point) => point.y === 999));
  assert.ok(reduced.some((point) => point.y === -999));
  assert.ok(segments[0].every((point) => point.x < 5000));
  assert.ok(segments[1].every((point) => point.x > 5000));
});
test("chart domains, nulls and bars remain honest and finite", () => {
  const series = [
    {
      id: "a",
      label: "A",
      data: [
        { x: 0, y: -5 },
        { x: 1, y: 0 },
        { x: 2, y: 10 },
      ],
    },
  ];
  for (const type of ["line", "area", "bar"]) {
    const model = chartModel(series, 10, type);
    assert.ok(!JSON.stringify(model.paths).match(/NaN|Infinity/));
    assert.ok(model.minY <= -5 && model.maxY >= 10);
  }
  assert.throws(
    () =>
      chartModel(
        [
          {
            ...series[0],
            data: [
              { x: 1, y: 0 },
              { x: 0, y: 1 },
            ],
          },
        ],
        10,
        "line",
      ),
    /increasing/,
  );
  assert.throws(
    () =>
      chartModel(
        [
          {
            ...series[0],
            data: Array.from({ length: 8 }, (_, x) => ({ x, y: x })),
          },
        ],
        4,
        "bar",
      ),
    /never discard/,
  );
  assert.equal(nearestChartIndex(series[0].data, 1.8), 2);
  assert.equal(nearestChartIndex(series[0].data, -1), 0);
});
test("linear and logarithmic knob mappings round trip and reject invalid domains", () => {
  for (const scale of ["linear", "log"])
    for (const fraction of [0, 0.01, 0.25, 0.5, 0.99, 1]) {
      const value = knobValue(fraction, 20, 20000, scale);
      assert.ok(
        Math.abs(knobFraction(value, 20, 20000, scale) - fraction) < 1e-10,
      );
    }
  assert.equal(snapKnob(23.49, 0, 100, 0.1), 23.5);
  assert.equal(snapKnob(101, 0, 100, 1), 100);
  assert.throws(() => validateKnob(0, 100, 1, "log"), /positive log/);
  assert.throws(() => validateKnob(0, 100, 0, "linear"), /positive step/);
});
test("table row identities and stable sorting never mutate caller data", () => {
  const source = Object.freeze([
    { id: "b", value: 2 },
    { id: "c", value: 1 },
    { id: "a", value: 1 },
  ]);
  const rows = identifyRows(source, (row) => row.id);
  const columns = [{ id: "value", header: "Value", value: (row) => row.value }];
  const sorted = sortDataRows(
    rows,
    columns,
    { columnId: "value", direction: "ascending" },
    false,
  );
  assert.deepEqual(
    sorted.map((entry) => entry.id),
    ["c", "a", "b"],
  );
  assert.deepEqual(
    source.map((row) => row.id),
    ["b", "c", "a"],
  );
  assert.equal(
    sortDataRows(
      rows,
      columns,
      { columnId: "value", direction: "descending" },
      true,
    ),
    rows,
  );
  assert.throws(
    () => identifyRows([{ id: "a" }, { id: "a" }], (row) => row.id),
    /unique/,
  );
  assert.deepEqual(nextDataSort(null, "value"), {
    columnId: "value",
    direction: "ascending",
  });
  assert.equal(
    nextDataSort({ columnId: "value", direction: "descending" }, "value"),
    null,
  );
});
test("table windows bound DOM work, including 100k inputs and distant scroll offsets", () => {
  for (const count of [0, 1, 1000, 100000])
    for (const scroll of [0, 40000, 10000000]) {
      const window = tableWindow(count, scroll, 400, 40, 4);
      assert.ok(
        window.start >= 0 && window.end <= count && window.end >= window.start,
      );
      assert.ok(window.end - window.start <= 19);
    }
  assert.throws(() => tableWindow(1000000, 0, 400, 40, 4), /server window/);
  assert.throws(() => tableWindow(1000, 0, 400, 0, 4), /Invalid/);
});

test("virtual table offsets account for caption and header without overscan", () => {
  assert.deepEqual(tableWindow(1000, 480, 400, 40, 0, 80), {
    start: 10,
    end: 21,
  });
  assert.deepEqual(tableWindow(1000, 40, 400, 40, 0, 80), {
    start: 0,
    end: 11,
  });
  assert.throws(() => tableWindow(1000, 40, 400, 40, 0, -1), /Invalid/);
});
test("table value validation rejects unsafe or non-finite accessor results", () => {
  for (const value of [NaN, Infinity, -Infinity, undefined, {}, false])
    assert.throws(() => cellValue(value), /finite/);
  for (const value of [null, "42", 42]) assert.equal(cellValue(value), value);
  const rows = identifyRows([{ id: "a", value: NaN }], (row) => row.id);
  assert.throws(
    () =>
      sortDataRows(
        rows,
        [{ id: "value", header: "Value", value: (row) => row.value }],
        { columnId: "value", direction: "ascending" },
        false,
      ),
    /finite/,
  );
});
test("token providers cannot split a UTF-16 surrogate pair", () => {
  const code = "😀x";
  assert.deepEqual(codeSegments(code, [{ start: 0, end: 1, kind: "string" }]), [
    { start: 0, content: code },
  ]);
  assert.deepEqual(codeSegments(code, [{ start: 1, end: 2, kind: "string" }]), [
    { start: 0, content: code },
  ]);
});

test("isolated line samples remain visible without bridging missing values", () => {
  const model = chartModel(
    [
      {
        id: "gaps",
        label: "Gaps",
        data: [
          { x: 0, y: 5 },
          { x: 1, y: null },
          { x: 2, y: 8 },
        ],
      },
    ],
    16,
    "line",
  );
  assert.equal((model.paths[0].line.match(/l0,0/g) ?? []).length, 2);
});
