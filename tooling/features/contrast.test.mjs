import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
const css = await readFile(
  new URL("../../packages/tokens/src/theme.css", import.meta.url),
  "utf8",
);
function variables(block) {
  return new Map(
    [...block.matchAll(/--flux-color-([\w-]+):\s*(#[\da-f]{6});/giu)].map(
      (match) => [match[1], match[2]],
    ),
  );
}
function luminance(hex) {
  const channels = [1, 3, 5]
    .map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function ratio(a, b) {
  const light = luminance(a),
    dark = luminance(b);
  return (Math.max(light, dark) + 0.05) / (Math.min(light, dark) + 0.05);
}
test("base light and dark semantic foregrounds pass on semantic surfaces", () => {
  const blocks = [...css.matchAll(/([^{}]+)\{([^{}]+)\}/gu)]
    .map((match) => ({ name: match[1].trim(), colors: variables(match[2]) }))
    .filter((entry) => entry.colors.has("surface") && entry.colors.has("text"));
  assert.equal(blocks.length, 2);
  let pairs = 0;
  for (const block of blocks)
    for (const foreground of [
      "text",
      "text-muted",
      "text-subtle",
      "accent",
      "info",
      "success",
      "warning",
      "danger",
    ])
      for (const surface of [
        "canvas",
        "surface",
        "surface-elevated",
        "surface-subtle",
      ]) {
        const fg = block.colors.get(foreground),
          bg = block.colors.get(surface);
        assert.ok(
          fg && bg,
          `Missing ${foreground}/${surface} in ${block.name}`,
        );
        assert.ok(
          ratio(fg, bg) >= 4.5,
          `${block.name}: ${foreground} on ${surface} = ${ratio(fg, bg).toFixed(4)}:1`,
        );
        pairs += 1;
      }
  assert.equal(pairs, 64);
});
