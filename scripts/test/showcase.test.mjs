import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { validateShowcaseFiles } from "../docs-catalog.mjs";
import {
  formatMoney,
  formatTime,
  isMood,
  moods,
  readShowcaseRoute,
  showcaseHash,
} from "../../apps/docs/src/showcase/model.ts";
const sceneDirectory = new URL(
  "../../apps/docs/src/showcase/scenes/",
  import.meta.url,
);
const sceneFiles = await readdir(sceneDirectory);
const sceneIds = sceneFiles
  .filter((name) => name.endsWith(".scene.ts"))
  .map((name) => name.replace(/\.scene\.ts$/u, ""));
const css = await readFile(
  new URL("../../apps/docs/src/showcase/showcase.css", import.meta.url),
  "utf8",
);
test("every scene is a convention-based metadata/preview pair", () => {
  assert.deepEqual(validateShowcaseFiles(sceneFiles), []);
  assert.ok(sceneIds.length >= 6);
});
test("the scene contract rejects missing, orphaned, duplicate, and invalid files", () => {
  assert.match(validateShowcaseFiles([]).join("\n"), /At least one/);
  assert.match(
    validateShowcaseFiles(["new.scene.ts"]).join("\n"),
    /Missing showcase preview/,
  );
  assert.match(
    validateShowcaseFiles(["new.preview.tsx"]).join("\n"),
    /Orphan showcase preview/,
  );
  assert.match(
    validateShowcaseFiles(["New Scene.scene.ts", "New Scene.preview.tsx"]).join(
      "\n",
    ),
    /Invalid showcase filename/,
  );
  assert.match(
    validateShowcaseFiles([
      "new.scene.ts",
      "new.preview.tsx",
      "new.scene.ts",
    ]).join("\n"),
    /Duplicate showcase filename/,
  );
});
test("contributors can add a complete scene without changing a central registry", () => {
  assert.deepEqual(
    validateShowcaseFiles([
      ...sceneFiles,
      "support-desk.scene.ts",
      "support-desk.preview.tsx",
    ]),
    [],
  );
});
test("unknown and encoded URL values are not treated as component names or CSS", () => {
  for (const value of [
    "",
    "not-found",
    "%3Cscript%3E",
    "..%2Ffinance",
    "__proto__",
  ]) {
    assert.deepEqual(
      readShowcaseRoute(`playground?scene=${value}&mood=${value}`, [
        "finance",
        "music",
      ]),
      { scene: "finance", mood: "paper" },
    );
  }
  assert.deepEqual(readShowcaseRoute("playground", []), {
    scene: "finance",
    mood: "paper",
  });
});
for (const scene of sceneIds) {
  for (const mood of moods) {
    test(`${scene}/${mood.id} round-trips through both shareable routes`, () => {
      for (const page of ["overview", "playground"]) {
        const hash = showcaseHash(page, scene, mood.id);
        assert.ok(hash.startsWith(`#${page}?`));
        assert.deepEqual(readShowcaseRoute(hash.slice(1), sceneIds), {
          scene,
          mood: mood.id,
        });
      }
    });
  }
}
test("mood choices are explicit, unique, and separate from persisted docs appearance", () => {
  assert.equal(new Set(moods.map((mood) => mood.id)).size, 4);
  assert.equal(isMood("studio"), true);
  assert.equal(isMood("Studio"), false);
  assert.equal(isMood("system"), false);
});
test("demo money and time formatting use deterministic bounded fixture values", () => {
  assert.equal(formatMoney(12900), "$129");
  assert.equal(formatMoney(3 * 12900), "$387");
  assert.equal(formatMoney(9 * 12900), "$1,161");
  assert.equal(formatMoney(12458000 - 220000), "$122,380");
  assert.equal(formatTime(0), "00:00");
  assert.equal(formatTime(8), "00:08");
  assert.equal(formatTime(65.9), "01:05");
  assert.equal(formatTime(-1), "00:00");
});
function luminance(hex) {
  const channels = hex
    .slice(1)
    .match(/../gu)
    .map((channel) => Number.parseInt(channel, 16) / 255);
  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}
function contrast(first, second) {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
// Token-pair arithmetic is a design guard, not a replacement for rendered axe scans.
for (const mood of moods) {
  test(`${mood.label} text token pairs meet 4.5:1 before rendering`, () => {
    const body = new RegExp(
      `\\.world-surface\\[data-mood="${mood.id}"\\]\\s*\\{([^}]+)\\}`,
      "u",
    ).exec(css)?.[1];
    assert.ok(body);
    const tokens = Object.fromEntries(
      [
        ...body.matchAll(/--flux-color-([a-z-]+):\s*(#[a-fA-F0-9]{6})\s*;/gu),
      ].map((match) => [match[1], match[2]]),
    );
    for (const text of ["text", "text-muted", "text-subtle"]) {
      for (const surface of [
        "canvas",
        "surface",
        "surface-subtle",
        "surface-elevated",
      ]) {
        assert.ok(
          contrast(tokens[text], tokens[surface]) >= 4.5,
          `${mood.id}: ${text} on ${surface} is ${contrast(tokens[text], tokens[surface]).toFixed(2)}:1`,
        );
      }
    }
    for (const [text, surface] of [
      ["accent-foreground", "accent"],
      ["accent-foreground", "accent-hover"],
      ["accent", "accent-soft"],
      ["success", "success-soft"],
      ["warning", "warning-soft"],
    ]) {
      assert.ok(
        contrast(tokens[text], tokens[surface]) >= 4.5,
        `${mood.id}: ${text} on ${surface} is ${contrast(tokens[text], tokens[surface]).toFixed(2)}:1`,
      );
    }
  });
}
