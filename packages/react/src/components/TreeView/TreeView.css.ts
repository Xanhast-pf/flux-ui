import { cssVars } from "@flux-ui/tokens";
import { globalStyle, style } from "@vanilla-extract/css";

export const root = style({
  margin: 0,
  padding: 0,
  listStyle: "none",
  color: `var(${cssVars.color.text})`,
});

export const item = style({
  margin: 0,
  padding: 0,
  outline: "none",
  listStyle: "none",
});

export const label = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  minBlockSize: "2rem",
  paddingBlock: "0.25rem",
  paddingInline: "0.5rem",
  borderRadius: "0.25rem",
  cursor: "default",
  selectors: {
    "&::before": {
      display: "inline-block",
      flex: "0 0 1rem",
      inlineSize: "1rem",
      color: `var(${cssVars.color.textMuted})`,
      textAlign: "center",
      content: '""',
    },
    "&:hover": {
      background: `var(${cssVars.color.surfaceSubtle})`,
    },
  },
});

export const group = style({
  margin: 0,
  padding: 0,
  paddingInlineStart: "1.5rem",
  listStyle: "none",
});

globalStyle(`${item}[data-expandable] > ${label}::before`, {
  content: '"›"',
});

globalStyle(`${item}[data-expanded] > ${label}::before`, {
  transform: "rotate(90deg)",
});

globalStyle(`${item}:focus-visible > ${label}`, {
  outline: `0.125rem solid var(${cssVars.color.focus})`,
  outlineOffset: "0.125rem",
});

globalStyle(`${item}[aria-disabled="true"] > ${label}`, {
  opacity: 0.62,
});

globalStyle(`${item}:focus-visible > ${label}`, {
  "@media": {
    "(forced-colors: active)": {
      outlineColor: "Highlight",
    },
  },
});
