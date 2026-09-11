import { describe, expect, it } from "vitest";
import {
  fluxDisplayGlyphs,
  fluxDisplayMetrics,
  getUnsupportedFluxDisplayCharacters,
  normalizeFluxDisplayText,
} from "./flux-display.js";

describe("Flux Display source", () => {
  it("covers the initial uppercase, digit and punctuation scope", () => {
    for (const character of "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/-.:+") {
      expect(fluxDisplayGlyphs[character]).toBeDefined();
    }
  });

  it("normalizes lowercase and replaces unsupported glyphs with spaces", () => {
    expect(normalizeFluxDisplayText("Flux UI ♥ 01")).toBe("FLUX UI   01");
  });

  it("reports unsupported characters without duplicates", () => {
    expect(getUnsupportedFluxDisplayCharacters("Café ♥♥")).toEqual(["É", "♥"]);
  });

  it("keeps enough render padding for mitered display geometry", () => {
    expect(fluxDisplayMetrics.renderPadding).toBeGreaterThanOrEqual(1);
  });
});
