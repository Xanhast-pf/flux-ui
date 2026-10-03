import { style } from "@vanilla-extract/css";

export const chart = style({
  position: "relative",
  minInlineSize: 0,
  direction: "ltr",
  color: "var(--flux-color-text)",
  selectors: {
    "&:focus-visible": {
      outline: "0.125rem solid var(--flux-color-focus)",
      outlineOffset: "0.125rem",
    },
  },
});

export const visuallyHidden = style({
  position: "absolute",
  inlineSize: "1px",
  blockSize: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: 0,
});

export const svg = style({
  display: "block",
  inlineSize: "100%",
  overflow: "hidden",
});

export const axis = style({
  fill: "var(--flux-color-text-muted)",
  fontSize: "12px",
});

export const cursor = style({
  stroke: "var(--flux-color-text-muted)",
  strokeDasharray: "3 3",
  pointerEvents: "none",
});

export const seriesGroup = style({
  selectors: {
    "&[data-muted='true']": { opacity: 0.42 },
  },
});

export const activeMark = style({
  fill: "var(--flux-color-surface)",
  stroke: "currentColor",
  strokeWidth: 3,
  pointerEvents: "none",
  vectorEffect: "non-scaling-stroke",
  "@media": {
    "(forced-colors: active)": {
      fill: "Canvas",
      stroke: "Highlight",
    },
  },
});

export const gridLine = style({
  stroke: "var(--flux-color-border)",
  fill: "none",
});
