import { style } from "@vanilla-extract/css";
export const colorSwatch = style({
  vars: { "--flux-swatch-size": "1.25rem" },
  display: "inline-grid",
  placeItems: "center",
  flexShrink: 0,
  inlineSize: "var(--flux-swatch-size, 1.5rem)",
  blockSize: "var(--flux-swatch-size, 1.5rem)",
  borderRadius: "50%",
  background: "var(--flux-swatch-color)",
  border: "0.0625rem solid var(--flux-color-border-strong)",
  verticalAlign: "middle",
  selectors: {
    "&[data-size='sm']": { vars: { "--flux-swatch-size": "1rem" } },
    "&[data-size='lg']": { vars: { "--flux-swatch-size": "2rem" } },
  },
  "@media": {
    "(forced-colors: active)": {
      background: "Canvas",
      borderColor: "CanvasText",
    },
  },
});
export const check = style({
  selectors: {},
  display: "inline-grid",
  placeItems: "center",
  fontSize: "var(--flux-font-caption)",
  lineHeight: 1,
  color: "var(--flux-color-text)",
  background: "var(--flux-color-surface)",
  borderRadius: "50%",
  inlineSize: "100%",
  blockSize: "100%",
});
