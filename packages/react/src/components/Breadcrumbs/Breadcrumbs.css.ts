import { cssVars } from "@varua/tokens";
import { style } from "@vanilla-extract/css";

export const root = style({
  fontSize: "1rem",
  color: `var(${cssVars.color.textMuted})`,
});

export const list = style({
  selectors: {
    "&[hidden]:not([hidden='until-found' i])": { display: "none !important" },
  },
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: `var(${cssVars.space[2]})`,
  padding: 0,
  margin: 0,
  listStyle: "none",
});

export const item = style({
  selectors: {
    "&[hidden]:not([hidden='until-found' i])": { display: "none !important" },
  },
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

export const collapseButton = style({
  border: 0,
  borderRadius: `var(${cssVars.radius.sm})`,
  background: "transparent",
  color: "inherit",
  paddingInline: `var(${cssVars.space[1]})`,
  font: "inherit",
  cursor: "pointer",
  selectors: {
    "&:hover": {
      background: `var(${cssVars.color.surfaceSubtle})`,
      color: `var(${cssVars.color.text})`,
    },
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
