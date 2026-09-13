import { style } from "@vanilla-extract/css";
export const descriptionList = style({
  selectors: {},
  margin: 0,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: "var(--flux-space-2) var(--flux-space-4)",
  fontSize: "var(--flux-font-caption)",
  "@media": {
    "(min-width: 40rem)": {
      gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr)",
    },
  },
});
export const term = style({ margin: 0, color: "var(--flux-color-text-muted)" });
export const details = style({
  margin: 0,
  minInlineSize: 0,
  overflowWrap: "anywhere",
  fontVariantNumeric: "tabular-nums",
});
