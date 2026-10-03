import { style } from "@vanilla-extract/css";
import { chartTone } from "../../internal/chartTone.css.js";

export const frame = style({
  display: "flex",
  flexDirection: "column",
  minInlineSize: 0,
  gap: "var(--flux-space-3)",
  selectors: {
    "&[data-placement='start'], &[data-placement='end']": {
      flexDirection: "row",
    },
  },
});

export const chartSlot = style({
  minInlineSize: 0,
  flex: "1 1 auto",
});

export const list = style({
  display: "flex",
  flex: "0 0 auto",
  flexWrap: "wrap",
  gap: "var(--flux-space-2)",
  alignItems: "center",
  margin: 0,
  padding: 0,
  listStyle: "none",
  selectors: {
    "&[data-direction='vertical']": {
      flexDirection: "column",
      alignItems: "stretch",
    },
  },
});

export const item = style({
  minInlineSize: 0,
});

export const control = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--flux-space-2)",
  minInlineSize: 0,
  padding: "var(--flux-space-1) var(--flux-space-2)",
  border: 0,
  borderRadius: "var(--flux-radius-sm)",
  background: "transparent",
  color: "var(--flux-color-text)",
  font: "inherit",
  fontSize: "var(--flux-font-caption)",
  textAlign: "start",
  selectors: {
    "&[data-interactive='true']": { cursor: "pointer" },
    "&[data-hidden='true']": { textDecoration: "line-through" },
    "&[data-interactive='true']:hover": {
      background: "var(--flux-color-surface-subtle)",
    },
    "&[data-interactive='true']:focus-visible": {
      outline: "0.125rem solid var(--flux-color-focus)",
      outlineOffset: "0.125rem",
    },
  },
});

export const mark = style([
  chartTone,
  {
    flex: "0 0 auto",
    inlineSize: "0.625rem",
    blockSize: "0.625rem",
    borderRadius: "999px",
    background: "currentColor",
  },
]);
