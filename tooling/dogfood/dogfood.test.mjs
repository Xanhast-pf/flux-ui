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
      'const view = <div className="poster-art" aria-hidden="true"><button>Hidden mistake</button></div>;',
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
      {
        file: "apps/docs/src/perf/reference.tsx",
        reason: "Native benchmark reference",
      },
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
  const owner = {
    reason: "Site staging only",
    maxDeclarations: 1,
    rules: { ".art": ["color", "display"], ".button-art": ["color"] },
  };
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

test("default examples are not a blanket native exception", () => {
  const broad = {
    ...policy,
    sourceExceptions: [
      { prefix: "apps/docs/src/examples/", reason: "Teaching" },
    ],
  };
  assert.ok(
    auditSource(
      "const example = <button>Bad default</button>;",
      "apps/docs/src/examples/button.preview.tsx",
      broad,
    ).length,
  );
});
test("rejects aliased element factories, native aliases and unlisted controls", () => {
  for (const source of [
    'import { createElement as make } from "react"; make("button", null, "Save");',
    'import * as R from "react"; const make = R["createElement"]; make("progress");',
    'const tag = "form"; const make = React.createElement; make(tag);',
    'const Native = "input"; const view = <Native />;',
    'import { jsx as render } from "react/jsx-runtime"; render("meter", {});',
    "const view = <><progress/><form/><output/></>;",
  ])
    assert.ok(auditSource(source, file, policy).length, source);
});
test("rejects foreign libraries, CSS-in-TS and dynamic dependency escapes", () => {
  for (const source of [
    'import { Button } from "other-ui"; const view = <Button/>;',
    'const lib = import("other-ui");',
    "const lib = import(name);",
    'import "./parallel.css.ts";',
    'export { Button } from "other-ui";',
  ])
    assert.ok(auditSource(source, file, policy).length, source);
});
test("rejects inline skins through aliases, spreads and factories", () => {
  for (const source of [
    'const style = { color: "red" }; const view = <Button style={style}/>;',
    "const a = { padding: 0 }; const style = { ...a }; const view = <Box style={style}/>;",
    'const props = { style: { display: "grid" } }; const view = <Box {...props}/>;',
    'const view = <Button sx={{ color: "red" }}/>;',
    "React.createElement(Button, { style: { fontSize: 16 } });",
    "const view = <Box style={unknownStyle}/>;",
    "const view = <Box {...unknownProps}/>;",
  ])
    assert.ok(auditSource(source, file, policy).length, source);
});
test("geometry approvals stay file- and component-local", () => {
  const owner = {
    ...policy,
    inlineGeometry: [
      {
        file,
        components: ["Meter"],
        properties: ["width"],
        reason: "Measured data geometry",
      },
    ],
  };
  assert.equal(
    auditSource(
      "const view = <Meter style={{ width: measuredWidth }}/>;",
      file,
      owner,
    ).length,
    0,
  );
  assert.ok(
    auditSource(
      "const view = <Button style={{ width: measuredWidth }}/>;",
      file,
      owner,
    ).length,
  );
  assert.ok(
    auditSource(
      'const view = <Meter style={{ width: measuredWidth, color: "red" }}/>;',
      file,
      owner,
    ).length,
  );
});
test("imperative CSS and HTML cannot become a second docs styling engine", () => {
  for (const source of [
    'node.style.color = "red";',
    'node.style.setProperty("color", "red");',
    'sheet.insertRule("button {color:red}");',
    "node.innerHTML = html;",
    'node.insertAdjacentHTML("beforeend", html);',
    'node.setAttribute("style", css);',
  ])
    assert.ok(auditSource(source, file, policy).length, source);
});
test("artwork does not excuse controls, typography, foreign HTML or arbitrary token adapters", () => {
  const owner = {
    ...policy,
    artwork: [
      { file, className: "art", reason: "Original geometric illustration" },
    ],
  };
  for (const source of [
    '<div className="art" aria-hidden="true"><button>Save</button></div>;',
    '<div className="art" aria-hidden="true">A paragraph</div>;',
    "<svg><foreignObject><div>Ordinary UI</div></foreignObject></svg>;",
    '<Box data-artwork-ink=""/>;',
  ])
    assert.ok(auditSource(source, file, owner).length, source);
});
test("new CSS properties and selectors fail even below the declaration ceiling", () => {
  const owner = {
    reason: "Illustration",
    maxDeclarations: 20,
    rules: { ".shape": ["transform"] },
  };
  assert.deepEqual(
    auditCss(".shape{transform:rotate(12deg)}", "art.css", owner),
    [],
  );
  for (const source of [
    ".shape{padding:16px}",
    ".other{transform:rotate(12deg)}",
    ".scene a{color:red}",
    ".scene th{padding:0}",
    ".shape{font-size:16px}",
    "@import 'skin.css';",
  ])
    assert.ok(auditCss(source, "art.css", owner).length, source);
});
