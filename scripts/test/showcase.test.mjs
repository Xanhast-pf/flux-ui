import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { validateShowcaseFiles } from "../docs-catalog.mjs";
import { rankPalettePairings } from "../../apps/docs/src/lib/paletteHarmony.ts";
import {
  formatMoney,
  formatTime,
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

const appearanceSource = await readFile(
  new URL("../../apps/docs/src/lib/appearance.ts", import.meta.url),
  "utf8",
);
const paletteCss = await readFile(
  new URL("../../packages/tokens/src/palette.css", import.meta.url),
  "utf8",
);
const paletteCandidates = [
  ...appearanceSource.matchAll(
    /id: "([a-z]+)",\s+label: "[^"]+",\s+sampleHex: "(#[\da-f]{6})"/giu,
  ),
].map((match) => ({ id: match[1], sampleHex: match[2] }));

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
      { scene: "finance" },
    );
  }
  assert.deepEqual(readShowcaseRoute("playground", []), {
    scene: "finance",
  });
});

for (const scene of sceneIds) {
  test(`${scene} round-trips through both shareable routes`, () => {
    for (const page of ["overview", "playground"]) {
      const hash = showcaseHash(page, scene);
      assert.ok(hash.startsWith(`#${page}?`));
      assert.deepEqual(readShowcaseRoute(hash.slice(1), sceneIds), {
        scene,
      });
    }
  });
}

test("legacy mood query parameters are ignored rather than changing appearance", () => {
  assert.deepEqual(
    readShowcaseRoute("playground?scene=music&mood=terminal", sceneIds),
    { scene: "music" },
  );
  assert.equal(showcaseHash("playground", "music"), "#playground?scene=music");
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

test("palette representative colors stay synchronized with the public 500-step ramps", () => {
  assert.equal(paletteCandidates.length, 13);
  for (const candidate of paletteCandidates) {
    assert.ok(
      paletteCss.includes(
        `--flux-palette-${candidate.id}-500: ${candidate.sampleHex};`,
      ),
      candidate.id,
    );
  }
});

test("every primary ranks every other palette once with stable perceptual scores", () => {
  for (const primary of paletteCandidates) {
    const ranked = rankPalettePairings(primary.id, paletteCandidates);
    assert.equal(ranked.length, paletteCandidates.length - 1);
    assert.equal(
      new Set(ranked.map((pairing) => pairing.id)).size,
      ranked.length,
    );
    assert.equal(
      ranked.some((pairing) => pairing.id === primary.id),
      false,
    );

    for (let index = 1; index < ranked.length; index += 1)
      assert.ok(ranked[index - 1].score >= ranked[index].score);

    assert.ok(ranked[0].score > 0.5, primary.id);
    assert.ok(ranked[0].perceptualDistance > 0.1, primary.id);
  }
});

test("chromatic primaries prefer separated harmony families over neighboring hues", () => {
  for (const primary of paletteCandidates.filter(
    (candidate) => candidate.id !== "slate",
  )) {
    const [best] = rankPalettePairings(primary.id, paletteCandidates);
    assert.ok(best);
    assert.ok(
      [
        "split-complementary",
        "complementary",
        "triadic",
        "contrasting",
      ].includes(best.harmony),
      `${primary.id}: ${best.harmony}`,
    );
  }
});
