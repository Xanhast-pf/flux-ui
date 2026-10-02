import { cssVars } from "@flux-ui/tokens";
import { globalStyle, style } from "@vanilla-extract/css";

export const grid = style({
  overflow: "auto",
  border: `0.0625rem solid var(${cssVars.color.border})`,
  borderRadius: `var(${cssVars.radius.md})`,
  background: `var(${cssVars.color.surface})`,
  color: `var(${cssVars.color.text})`,
  selectors: {
    "&[hidden]:not([hidden='until-found' i])": {
      display: "none !important",
    },
  },
});

export const row = style({
  display: "grid",
  minInlineSize: "max-content",
});

export const headerRow = style([
  row,
  {
    position: "sticky",
    zIndex: 1,
    insetBlockStart: 0,
    background: `var(${cssVars.color.surfaceSubtle})`,
  },
]);

export const cell = style({
  boxSizing: "border-box",
  minInlineSize: "8rem",
  minBlockSize: "2.5rem",
  paddingBlock: `var(${cssVars.space[2]})`,
  paddingInline: `var(${cssVars.space[3]})`,
  borderBlockEnd: `0.0625rem solid var(${cssVars.color.border})`,
  borderInlineEnd: `0.0625rem solid var(${cssVars.color.border})`,
  outline: "none",
  overflowWrap: "anywhere",
  selectors: {
    "&:last-child": {
      borderInlineEnd: 0,
    },
    "&:focus-visible": {
      position: "relative",
      zIndex: 2,
      outline: `0.125rem solid var(${cssVars.color.focus})`,
      outlineOffset: "-0.125rem",
    },
  },
  "@media": {
    "(forced-colors: active)": {
      selectors: {
        "&:focus-visible": {
          outlineColor: "Highlight",
        },
      },
    },
  },
});

export const headerCell = style([
  cell,
  {
    fontWeight: 600,
    color: `var(${cssVars.color.textMuted})`,
  },
]);

export const sortButton = style({
  width: "100%",
  padding: 0,
  border: 0,
  background: "transparent",
  color: "inherit",
  font: "inherit",
  fontWeight: "inherit",
  textAlign: "start",
  cursor: "pointer",
  selectors: {
    "&:focus-visible": {
      outline: `0.125rem solid var(${cssVars.color.focus})`,
      outlineOffset: "0.125rem",
    },
  },
});

export const bodyRow = style([
  row,
  {
    selectors: {
      "&:hover": {
        background: `var(${cssVars.color.surfaceSubtle})`,
      },
      '&[data-selected="true"]': {
        background: `var(${cssVars.color.accentSoft})`,
      },
    },
  },
]);

export const editorInput = style({
  boxSizing: "border-box",
  width: "100%",
  minWidth: 0,
  minBlockSize: "2rem",
  paddingBlock: `var(${cssVars.space[1]})`,
  paddingInline: `var(${cssVars.space[2]})`,
  border: `0.0625rem solid var(${cssVars.color.border})`,
  borderRadius: `var(${cssVars.radius.sm})`,
  background: `var(${cssVars.color.surface})`,
  color: `var(${cssVars.color.text})`,
  font: "inherit",
  selectors: {
    "&:focus-visible": {
      outline: `0.125rem solid var(${cssVars.color.focus})`,
      outlineOffset: "0.125rem",
    },
  },
});

export const editError = style({
  display: "block",
  marginBlockStart: `var(${cssVars.space[1]})`,
  color: `var(${cssVars.color.danger})`,
  fontSize: "0.75rem",
  lineHeight: 1.25,
});

globalStyle(`${bodyRow}:last-child > ${cell}`, {
  borderBlockEnd: 0,
});
