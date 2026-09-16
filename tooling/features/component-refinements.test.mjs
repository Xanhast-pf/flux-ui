import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import {
  codeLanguages,
  tokenizeCode,
} from "../../packages/react/src/components/CodeBlock/tokenizeCode.ts";
import { codeSegments } from "../../packages/react/src/components/CodeBlock/codeSegments.ts";
const source = (path) =>
  readFile(new URL(`../../${path}`, import.meta.url), "utf8");
test("all advertised CodeBlock languages have distinct literal samples and lossless tokens", async () => {
  const text = await source("apps/docs/src/examples/code-block.preview.tsx");
  const file = ts.createSourceFile(
    "code-block.preview.tsx",
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const samples = new Map();
  function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      node.name.getText(file) === "samples"
    ) {
      assert.ok(node.type !== undefined && ts.isTypeReferenceNode(node.type));
      assert.equal(node.type.typeName.getText(file), "Record");
      assert.ok(
        node.initializer !== undefined &&
          ts.isObjectLiteralExpression(node.initializer),
      );
      for (const property of node.initializer.properties) {
        assert.ok(ts.isPropertyAssignment(property));
        assert.ok(
          ts.isIdentifier(property.name) || ts.isStringLiteral(property.name),
        );
        assert.ok(ts.isStringLiteral(property.initializer));
        assert.ok(!samples.has(property.name.text));
        samples.set(property.name.text, property.initializer.text);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  assert.deepEqual([...samples.keys()].sort(), [...codeLanguages].sort());
  assert.equal(new Set(samples.values()).size, codeLanguages.length);
  const signatures = {
    rust: "fn main",
    go: "package main",
    java: "public class",
    c: "#include <stdio.h>",
    cpp: "#include <iostream>",
    markdown: "# Flux UI",
  };
  for (const [language, code] of samples) {
    assert.ok(code.length > 20);
    assert.ok(!code.includes("Literal, never executed"));
    if (signatures[language]) assert.ok(code.includes(signatures[language]));
    const tokens = tokenizeCode(code, language);
    assert.equal(
      codeSegments(code, tokens)
        .map((segment) => segment.content)
        .join(""),
      code,
    );
  }
});
test("selection reuses the public checkbox and Fader remains a Slider adapter", async () => {
  const table = await source(
    "packages/react/src/components/DataTable/DataTable.tsx",
  );
  assert.match(table, /<Checkbox/u);
  assert.doesNotMatch(table, /type=["']checkbox["']/u);
  const fader = await source("packages/react/src/components/Fader/Fader.tsx");
  assert.match(fader, /<Slider/u);
  assert.match(fader, /orientation="vertical"/u);
  assert.match(fader, /@deprecated/u);
  const music = await source("apps/docs/src/showcase/scenes/music.preview.tsx");
  assert.doesNotMatch(music, /\bFader\b/u);
  assert.match(music, /orientation="vertical"/u);
});
