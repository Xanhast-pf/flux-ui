import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";
export const root = style({
  fontSize: "1rem",
  color: `var(${cssVars.color.textMuted})`,
});
export const list = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: `var(${cssVars.space[2]})`,
  padding: 0,
  margin: 0,
  listStyle: "none",
});
export const item = style({
  display: "inline-flex",
  alignItems: "center",
  gap: `var(${cssVars.space[2]})`,
  minInlineSize: 0,
  overflowWrap: "anywhere",
});
export const separator = style({
  color: `var(${cssVars.color.textMuted})`,
  selectors: { [`${item}:last-child > &`]: { display: "none" } },
});
export const link = style({
  color: "inherit",
  textUnderlineOffset: "0.25rem",
  selectors: {
    "&:hover": { color: `var(${cssVars.color.text})` },
    "&:focus-visible": {
      outline: `0.125rem solid var(${cssVars.color.focus})`,
      outlineOffset: "0.125rem",
    },
  },
});
export const current = style({
  color: `var(${cssVars.color.text})`,
  fontWeight: 600,
});
