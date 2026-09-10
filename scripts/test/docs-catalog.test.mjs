import assert from "node:assert/strict";
import { test } from "node:test";
import { validateExampleFiles } from "../docs-catalog.mjs";
test("accepts a complete catalog independent of order", () => {
  assert.deepEqual(
    validateExampleFiles(
      ["button", "radio-group"],
      ["radio-group.example.tsx", "button.example.tsx"],
    ),
    [],
  );
});
test("detects a missing demo without excluding a public component", () => {
  assert.deepEqual(
    validateExampleFiles(["button", "switch"], ["button.example.tsx"]),
    ["Missing docs example: switch.example.tsx"],
  );
});
test("rejects stale and duplicate public slugs", () => {
  assert.deepEqual(
    validateExampleFiles(
      ["button", "button"],
      ["button.example.tsx", "deleted.example.tsx"],
    ),
    [
      "Duplicate public component slug.",
      "Orphan docs example: deleted.example.tsx",
    ],
  );
});
test("ignores helpers but treats filename case as a real contract", () => {
  assert.deepEqual(
    validateExampleFiles(["button"], ["button.example.tsx", "helper.tsx"]),
    [],
  );
  assert.deepEqual(validateExampleFiles(["switch"], ["Switch.example.tsx"]), [
    "Missing docs example: switch.example.tsx",
    "Orphan docs example: Switch.example.tsx",
  ]);
});
