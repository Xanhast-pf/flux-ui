import assert from "node:assert/strict";
import test from "node:test";
import { auditSource } from "./source.mjs";
import { auditCss, inspectCss } from "./css.mjs";
const file = "apps/docs/src/pages/Example.tsx";
const policy = { sourceExceptions: [], artwork: [] };
test("rejects raw JSX controls but not code strings or comments", () => {
  assert.equal(
    auditSource(
      'const example = "<button />"; // <input />\nconst view = <Button>Save</Button>;',
      file,
      policy,
    ).length,
    0,
  );
  const findings = auditSource(
    "const view = <><button>Save</button><select><option>One</option></select></>;",
    file,
    policy,
  );
  assert.equal(findings.length, 2);
  assert.ok(findings.every((issue) => issue.line === 1));
});
test("rejects createElement control escape hatches", () => {
  assert.equal(
    auditSource('const view = React.createElement("input");', file, policy)
      .length,
    1,
  );
});
test("ordinary typography and wrappers must use public Flux", () => {
  assert.equal(
    auditSource(
      "const view = <div><h2>Heading</h2><p>Body</p></div>;",
      file,
      policy,
    ).length,
    3,
  );
  assert.equal(
    auditSource(
      'const view = <Stack as="section"><Heading level={2}>Heading</Heading><Text>Body</Text></Stack>;',
      file,
      policy,
    ).length,
    0,
  );
});
test("keeps native SVG and option protocols without manufacturing components", () => {
  assert.equal(
    auditSource(
      'const view = <><svg><title>Trend</title><path d="M0 0" /></svg><Select><optgroup label="Group"><option>One</option></optgroup></Select></>;',
      file,
      policy,
    ).length,
    0,
  );
});
test("allows only named file-local artwork and never waives raw controls", () => {
  const owned = {
    ...policy,
    artwork: [
      { file, className: "poster-art", reason: "Decorative scene artwork" },
    ],
  };
  const source =
    'const view = <div className="poster-art" aria-hidden="true"><span /></div>;';
  assert.equal(auditSource(source, file, owned).length, 0);
  assert.equal(
    auditSource(source, "apps/docs/src/pages/Other.tsx", owned).length,
    2,
  );
  assert.equal(
    auditSource(
      'const view = <div className="poster-art"><button>Hidden mistake</button></div>;',
      file,
      owned,
    ).length,
    1,
  );
});
test("rejects private source imports, including re-exports", () => {
  for (const source of [
    'import { Button } from "@flux-ui/react/src/components/Button";',
    'export * from "../../../../packages/react/src/index.js";',
  ]) {
    assert.equal(auditSource(source, file, policy).length, 1);
  }
  assert.equal(
    auditSource('import { Button } from "@flux-ui/react";', file, policy)
      .length,
    0,
  );
});
test("keeps performance reference exceptions explicit", () => {
  const owned = {
    ...policy,
    sourceExceptions: [
      { prefix: "apps/docs/src/perf/", reason: "Native benchmark reference" },
    ],
  };
  assert.equal(
    auditSource(
      "const view = <button>Native</button>;",
      "apps/docs/src/perf/reference.tsx",
      owned,
    ).length,
    0,
  );
  assert.equal(
    auditSource("const view = <button>Native</button>;", file, owned).length,
    1,
  );
});
test("CSS scanner handles nested conditions, comments, strings and keyframes", () => {
  const result = inspectCss(
    '/* input { color:red } */ @media (width < 40rem) { .art { content: "{;input}"; background: url("data:image/svg+xml,<svg>{}</svg>"); } } @keyframes pulse { from { opacity:0; } to { opacity:1; } }',
  );
  assert.deepEqual(result.selectors, [".art"]);
  assert.equal(result.declarations, 4);
});
test("CSS rejects ownership gaps, budget creep and public-control restyling", () => {
  const owner = { reason: "Site staging only", maxDeclarations: 1 };
  assert.equal(
    auditCss(".art { color: red; }", "art.css", undefined).length,
    1,
  );
  assert.equal(
    auditCss(".art { color: red; display: block; }", "art.css", owner).length,
    1,
  );
  for (const selector of [
    ".scene button",
    ".scene [aria-pressed='true']",
    "input:focus",
    "h1",
  ]) {
    assert.ok(
      auditCss(`${selector} { color: red; }`, "art.css", owner).length > 0,
    );
  }
  assert.equal(
    auditCss(".button-art { color: red; }", "art.css", owner).length,
    0,
  );
});
