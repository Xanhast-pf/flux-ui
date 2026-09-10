export interface FluxDisplayGlyph {
  /** Advance width in the prototype's 5 × 7 design grid. */
  advance: number;
  /** SVG path data drawn with a monoline square-terminal stroke. */
  path: string;
}

export const fluxDisplayMetrics = {
  unitsPerEm: 1000,
  capHeight: 700,
  ascender: 760,
  descender: -200,
  stem: 82,
  overshoot: 14,
  designGridHeight: 7,
  strokeWidth: 0.58,
  letterGap: 1.15,
} as const;

export const fluxDisplayGlyphs: Readonly<Record<string, FluxDisplayGlyph>> = {
  " ": { advance: 3, path: "" },
  A: { advance: 5, path: "M0 7 2.5 0 5 7 M1 4H4" },
  B: {
    advance: 5,
    path: "M0 0V7 M0 0H3.2L4.5 1V2.5L3.2 3.5H0 M3.2 3.5 4.5 4.5V6L3.2 7H0",
  },
  C: { advance: 5, path: "M5 1 4 0H1L0 1V6L1 7H4L5 6" },
  D: { advance: 5, path: "M0 0V7H3L5 5.5V1.5L3 0H0" },
  E: { advance: 5, path: "M5 0H0V7H5 M0 3.5H4" },
  F: { advance: 5, path: "M0 7V0H5 M0 3.5H4" },
  G: { advance: 5, path: "M5 1 4 0H1L0 1V6L1 7H5V4H3" },
  H: { advance: 5, path: "M0 0V7 M5 0V7 M0 3.5H5" },
  I: { advance: 3, path: "M0 0H3 M1.5 0V7 M0 7H3" },
  J: { advance: 5, path: "M5 0V6L4 7H1L0 6V5" },
  K: { advance: 5, path: "M0 0V7 M5 0 0 4 M2.2 2.2 5 7" },
  L: { advance: 5, path: "M0 0V7H5" },
  M: { advance: 6, path: "M0 7V0L3 3 6 0V7" },
  N: { advance: 5, path: "M0 7V0L5 7V0" },
  O: { advance: 5, path: "M1 0H4L5 1V6L4 7H1L0 6V1L1 0" },
  P: { advance: 5, path: "M0 7V0H3.5L5 1.2V2.8L3.5 4H0" },
  Q: { advance: 5, path: "M1 0H4L5 1V6L4 7H1L0 6V1L1 0 M3.2 5.2 5.2 7.2" },
  R: { advance: 5, path: "M0 7V0H3.5L5 1.2V2.8L3.5 4H0 M3 4 5.2 7" },
  S: { advance: 5, path: "M5 1 4 0H1L0 1V3L1 3.5H4L5 4V6L4 7H1L0 6" },
  T: { advance: 5, path: "M0 0H5 M2.5 0V7" },
  U: { advance: 5, path: "M0 0V6L1 7H4L5 6V0" },
  V: { advance: 5, path: "M0 0 2.5 7 5 0" },
  W: { advance: 6, path: "M0 0 1.3 7 3 4 4.7 7 6 0" },
  X: { advance: 5, path: "M0 0 5 7 M5 0 0 7" },
  Y: { advance: 5, path: "M0 0 2.5 3.5 5 0 M2.5 3.5V7" },
  Z: { advance: 5, path: "M0 0H5L0 7H5" },
  "0": { advance: 5, path: "M1 0H4L5 1V6L4 7H1L0 6V1L1 0 M1 6 4 1" },
  "1": { advance: 4, path: "M1 1 2.5 0V7 M1 7H4" },
  "2": { advance: 5, path: "M0 1 1 0H4L5 1V3L0 7H5" },
  "3": { advance: 5, path: "M0 0H4L5 1V2.5L4 3.5H2 M4 3.5 5 4.5V6L4 7H0" },
  "4": { advance: 5, path: "M4 7V0L0 5H5" },
  "5": { advance: 5, path: "M5 0H0V3.5H4L5 4.5V6L4 7H0" },
  "6": { advance: 5, path: "M5 1 4 0H1L0 1V6L1 7H4L5 6V4.5L4 3.5H0" },
  "7": { advance: 5, path: "M0 0H5L1.5 7" },
  "8": {
    advance: 5,
    path: "M1 0H4L5 1V2.5L4 3.5H1L0 2.5V1L1 0 M1 3.5H4L5 4.5V6L4 7H1L0 6V4.5L1 3.5",
  },
  "9": { advance: 5, path: "M5 7V1L4 0H1L0 1V3L1 4H5" },
  "-": { advance: 4, path: "M0 3.5H4" },
  "/": { advance: 4, path: "M0 7 4 0" },
  ".": { advance: 2, path: "M1 7h.01" },
  ":": { advance: 2, path: "M1 2h.01 M1 6h.01" },
  "+": { advance: 5, path: "M2.5 1V6 M0 3.5H5" },
} as const;

export function normalizeFluxDisplayText(value: string): string {
  return [...value.toUpperCase()]
    .map((character) => (character in fluxDisplayGlyphs ? character : " "))
    .join("");
}
