import assert from "node:assert/strict";
import test from "node:test";
import { attachRef } from "../../packages/react/src/internal/attachRef.ts";
import { nextRovingIndex } from "../../packages/react/src/internal/rovingFocus.ts";
import {
  compareCells,
  identifyRows,
  sortDataRows,
  tableWindow,
} from "../../packages/react/src/components/DataTable/tableModel.ts";
import {
  knobFraction,
  knobValue,
  snapKnob,
  stepKnob,
  validateKnob,
} from "../../packages/react/src/components/Knob/knobMath.ts";
import { tokenizeCode } from "../../packages/react/src/components/CodeBlock/tokenizeCode.ts";
import { codeSegments } from "../../packages/react/src/components/CodeBlock/codeSegments.ts";

test("composed refs preserve cleanup callbacks without calling a legacy null detach", () => {
  const node = {};
  const calls = [];
  let cleaned = 0;
  const detach = attachRef((value) => {
    calls.push(value);
    return () => {
      cleaned += 1;
    };
  }, node);
  assert.equal(typeof detach, "function");
  detach();
  assert.deepEqual(calls, [node]);
  assert.equal(cleaned, 1);
});
test("composed refs support object, legacy and absent refs", () => {
  const node = {};
  const ref = { current: null };
  const detach = attachRef(ref, node);
  assert.equal(ref.current, node);
  detach();
  assert.equal(ref.current, null);
  const values = [];
  const cleanup = attachRef((value) => {
    values.push(value);
  }, node);
  cleanup();
  assert.deepEqual(values, [node, null]);
  assert.equal(attachRef(undefined, node), undefined);
  assert.equal(attachRef(null, node), undefined);
});
test("every roving key stays inside valid collection bounds in either direction", () => {
  for (const count of [1, 2, 3, 100])
    for (const current of [0, count - 1])
      for (const direction of ["ltr", "rtl"])
        for (const orientation of ["horizontal", "vertical"])
          for (const loopFocus of [true, false])
            for (const key of [
              "Home",
              "End",
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
            ]) {
              const next = nextRovingIndex(key, current, count, {
                direction,
                orientation,
                loopFocus,
              });
              assert.ok(next === null || (next >= 0 && next < count));
            }
});
test("stale table scroll offsets cannot produce an empty window for nonempty data", () => {
  for (const count of [1, 5, 20, 1000]) {
    const window = tableWindow(count, 10_000_000, 400, 40, 4);
    assert.equal(window.end, count);
    assert.equal(window.end - window.start, Math.min(count, 19));
  }
  assert.deepEqual(tableWindow(0, 10_000_000, 400, 40, 4), {
    start: 0,
    end: 0,
  });
});
test("all supported table windows contain data and remain bounded after filtering", () => {
  for (const count of [1, 10, 1000, 100000])
    for (const height of [80, 400, 4000])
      for (const rowHeight of [24, 40, 256]) {
        if (count * rowHeight > 16_000_000) continue;
        for (const overscan of [0, 4, 50])
          for (const scroll of [-100, 0, 40000, 1e9]) {
            const { start, end } = tableWindow(
              count,
              scroll,
              height,
              rowHeight,
              overscan,
            );
            assert.ok(0 <= start && start < end && end <= count);
            assert.ok(
              end - start <= Math.ceil(height / rowHeight) + overscan * 2 + 1,
            );
          }
      }
});
test("cached table collation retains locale/numeric behavior and one accessor read per row", () => {
  for (const [left, right] of [
    ["item 2", "item 10"],
    ["é", "z"],
    ["a", "A"],
    [2, "10"],
  ]) {
    assert.equal(
      Math.sign(compareCells(left, right)),
      Math.sign(
        String(left).localeCompare(String(right), "en", { numeric: true }),
      ),
    );
  }
  let reads = 0;
  const source = Object.freeze([
    { id: "b", value: "item 10" },
    { id: "a", value: "item 2" },
  ]);
  const rows = identifyRows(source, (row) => row.id);
  const result = sortDataRows(
    rows,
    [
      {
        id: "value",
        header: "Value",
        value: (row) => {
          reads += 1;
          return row.value;
        },
      },
    ],
    { columnId: "value", direction: "ascending" },
    false,
  );
  assert.equal(reads, source.length);
  assert.deepEqual(
    result.map((row) => row.id),
    ["a", "b"],
  );
  assert.deepEqual(
    source.map((row) => row.id),
    ["b", "a"],
  );
});
test("knob endpoints remain reachable when the step does not divide the range", () => {
  for (const [min, max, step] of [
    [0, 10, 3],
    [-10, 10, 7],
    [0.1, 1, 0.2],
  ]) {
    assert.equal(snapKnob(min, min, max, step), min);
    assert.equal(snapKnob(max, min, max, step), max);
    assert.equal(snapKnob(max + step, min, max, step), max);
  }
});
test("knob decimal cleanup cannot erase representable steps at large offsets", () => {
  assert.equal(snapKnob(1e16 + 4, 1e16, 1e16 + 100, 2), 1e16 + 4);
  assert.equal(snapKnob(23.49, 0, 100, 0.1), 23.5);
  assert.equal(snapKnob(0.1 + 0.2, 0, 1, 0.1), 0.3);
});
test("logarithmic endpoints are exact and collapsed logarithmic domains are rejected", () => {
  for (const scale of ["linear", "log"]) {
    assert.equal(knobValue(0, 20, 20000, scale), 20);
    assert.equal(knobValue(1, 20, 20000, scale), 20000);
    assert.equal(knobFraction(20, 20, 20000, scale), 0);
    assert.equal(knobFraction(20000, 20, 20000, scale), 1);
  }
  assert.throws(() => validateKnob(1e20, 1e20 + 16384, 1, "log"), /Knob/);
});
test("lexical property detection preserves CSS hyphens without swallowing JavaScript operators", () => {
  const css = "background-color: red;";
  const property = tokenizeCode(css, "css").find(
    (token) => token.kind === "property",
  );
  assert.equal(css.slice(property.start, property.end), "background-color");
  const js = "a-b-c;";
  assert.ok(
    tokenizeCode(js, "javascript").some(
      (token) =>
        token.kind === "punctuation" &&
        js.slice(token.start, token.end).includes("-"),
    ),
  );
});
test("adversarial hyphens and unmatched Markdown brackets preserve bounded output", () => {
  for (const [code, language] of [
    ["a-".repeat(200000), "typescript"],
    ["[a".repeat(200000), "markdown"],
    ["background-color-".repeat(20000), "css"],
  ]) {
    const tokens = tokenizeCode(code, language);
    assert.ok(tokens.length <= 20000);
    assert.equal(
      codeSegments(code, tokens)
        .map((part) => part.content)
        .join(""),
      code,
    );
  }
});

test("unterminated escaped literals with a final backslash scan as one token", () => {
  for (const quote of ['"', "'", "`"]) {
    const code = quote + ("\\" + quote).repeat(150000) + "\\";
    const tokens = tokenizeCode(code, "typescript");
    assert.deepEqual(tokens, [{ start: 0, end: code.length, kind: "string" }]);
    assert.equal(codeSegments(code, tokens)[0].content, code);
  }
});

test("knob keyboard steps do not skip the last grid point or stall on decimal noise", () => {
  assert.equal(stepKnob(10, 0, 10, 3, -1), 9);
  assert.equal(stepKnob(9, 0, 10, 3, 1), 10);
  assert.equal(stepKnob(0.3, 0, 1, 0.1, 1), 0.4);
  assert.equal(stepKnob(0.3, 0, 1, 0.1, -1), 0.2);
  assert.equal(stepKnob(0, 0, 1, 0.1, -1), 0);
  assert.equal(stepKnob(1, 0, 1, 0.1, 10), 1);
});
