export type PaletteHarmony =
  | "split-complementary"
  | "complementary"
  | "triadic"
  | "analogous"
  | "neutral-contrast"
  | "contrasting";

export type PaletteCandidate = {
  id: string;
  sampleHex: string;
};

export type PalettePairing = {
  id: string;
  score: number;
  harmony: PaletteHarmony;
  hueDistance: number;
  perceptualDistance: number;
};

type Oklab = { l: number; a: number; b: number };
type Oklch = Oklab & { c: number; h: number };

function clamp(value: number, minimum = 0, maximum = 1): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function srgbChannelToLinear(value: number): number {
  const channel = value / 255;
  return channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4;
}

function hexToOklab(hex: string): Oklab {
  const match = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/iu.exec(hex);
  if (!match)
    throw new Error(`Expected a six-digit hex color, received ${hex}`);

  const r = srgbChannelToLinear(Number.parseInt(match[1] ?? "00", 16));
  const g = srgbChannelToLinear(Number.parseInt(match[2] ?? "00", 16));
  const b = srgbChannelToLinear(Number.parseInt(match[3] ?? "00", 16));

  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const lRoot = Math.cbrt(l);
  const mRoot = Math.cbrt(m);
  const sRoot = Math.cbrt(s);

  return {
    l: 0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot,
    a: 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot,
    b: 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot,
  };
}

function toOklch(color: Oklab): Oklch {
  const c = Math.hypot(color.a, color.b);
  const angle = (Math.atan2(color.b, color.a) * 180) / Math.PI;
  return { ...color, c, h: (angle + 360) % 360 };
}

function hueDistance(left: number, right: number): number {
  const distance = Math.abs(left - right) % 360;
  return Math.min(distance, 360 - distance);
}

function perceptualDistance(left: Oklab, right: Oklab): number {
  return Math.hypot(left.l - right.l, left.a - right.a, left.b - right.b);
}

function proximity(distance: number, target: number, width: number): number {
  return Math.exp(-1 * ((distance - target) / width) ** 2);
}

function classifyHarmony(distance: number, neutral: boolean): PaletteHarmony {
  if (neutral) return "neutral-contrast";
  if (distance >= 165) return "complementary";
  if (distance >= 138) return "split-complementary";
  if (distance >= 102) return "triadic";
  if (distance >= 24 && distance <= 60) return "analogous";
  return "contrasting";
}

/**
 * Ranks a secondary palette from a primary representative color.
 *
 * The heuristic works in OKLab/OKLCH so perceptual distance is more stable than
 * raw RGB/HSL distance. It favors split-complementary and complementary hue
 * relationships for useful visual separation, then triadic relationships, and
 * uses OKLab distance/chroma as tie-breakers. Neutral palettes are handled as a
 * special case because hue is undefined or visually weak at very low chroma.
 *
 * This is a recommendation heuristic, not an accessibility calculation:
 * semantic text/control contrast remains governed by the Flux theme tokens.
 */
export function rankPalettePairings(
  primaryId: string,
  candidates: readonly PaletteCandidate[],
): PalettePairing[] {
  const primary = candidates.find((candidate) => candidate.id === primaryId);
  if (!primary) throw new Error(`Unknown primary palette: ${primaryId}`);

  const primaryLab = hexToOklab(primary.sampleHex);
  const primaryLch = toOklch(primaryLab);
  const primaryIsNeutral = primaryLch.c < 0.035;

  return candidates
    .filter((candidate) => candidate.id !== primaryId)
    .map((candidate) => {
      const candidateLab = hexToOklab(candidate.sampleHex);
      const candidateLch = toOklch(candidateLab);
      const candidateIsNeutral = candidateLch.c < 0.035;
      const distance = hueDistance(primaryLch.h, candidateLch.h);
      const delta = perceptualDistance(primaryLab, candidateLab);

      const splitComplementary = proximity(distance, 150, 28);
      const complementary = proximity(distance, 180, 26) * 0.96;
      const triadic = proximity(distance, 120, 24) * 0.88;
      const analogous = proximity(distance, 42, 20) * 0.42;
      const harmony = Math.max(
        splitComplementary,
        complementary,
        triadic,
        analogous,
      );
      const separation = clamp(delta / 0.32);
      const chroma = clamp(candidateLch.c / 0.2);

      let score = primaryIsNeutral
        ? separation * 0.52 + chroma * 0.48
        : harmony * 0.68 + separation * 0.22 + chroma * 0.1;

      if (!primaryIsNeutral && candidateIsNeutral) score *= 0.58;

      return {
        id: candidate.id,
        score,
        harmony: classifyHarmony(
          distance,
          primaryIsNeutral || candidateIsNeutral,
        ),
        hueDistance: distance,
        perceptualDistance: delta,
      };
    })
    .sort(
      (left, right) =>
        right.score - left.score ||
        right.perceptualDistance - left.perceptualDistance ||
        left.id.localeCompare(right.id),
    );
}

export function harmonyLabel(harmony: PaletteHarmony): string {
  switch (harmony) {
    case "split-complementary":
      return "Split complement";
    case "complementary":
      return "Complement";
    case "triadic":
      return "Triadic";
    case "analogous":
      return "Analogous";
    case "neutral-contrast":
      return "Neutral contrast";
    case "contrasting":
      return "Contrasting";
  }
}
