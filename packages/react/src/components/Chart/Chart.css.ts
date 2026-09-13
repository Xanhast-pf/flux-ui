import { style } from "@vanilla-extract/css";
export const chart = style({
  margin: 0,
  minInlineSize: 0,
  color: "var(--flux-color-text)",
  background: "var(--flux-color-surface)",
  padding: "var(--flux-space-4)",
  borderRadius: "var(--flux-radius-md)",
});
export const caption = style({
  fontWeight: "var(--flux-font-medium)",
  marginBlockEnd: "var(--flux-space-2)",
});
export const detail = style({
  marginBlock: "var(--flux-space-2)",
  fontSize: "var(--flux-font-caption)",
  color: "var(--flux-color-text-muted)",
});
export const legend = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--flux-space-2)",
});
export const legendButton = style({
  font: "inherit",
  fontSize: "var(--flux-font-caption)",
  padding: "var(--flux-space-2)",
  border: "0.0625rem solid var(--flux-color-border)",
  borderRadius: "var(--flux-radius-sm)",
  background: "var(--flux-color-surface)",
  color: "var(--flux-color-text)",
  cursor: "pointer",
  selectors: {
    "&[aria-pressed='true']": {
      textDecoration: "underline",
      borderColor: "var(--flux-color-accent)",
    },
    "&:focus-visible": { outline: "0.125rem solid var(--flux-color-focus)" },
  },
});
export const inspector = style({
  minInlineSize: 0,
  direction: "ltr",
  selectors: {
    "&:focus-visible": {
      outline: "0.125rem solid var(--flux-color-focus)",
      outlineOffset: "0.125rem",
    },
  },
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
export const seriesStyle = style({
  color: "var(--flux-color-accent)",
  selectors: {
    "&[data-tone='info']": { color: "var(--flux-color-info)" },
    "&[data-tone='success']": { color: "var(--flux-color-success)" },
    "&[data-tone='warning']": { color: "var(--flux-color-warning)" },
    "&[data-tone='danger']": { color: "var(--flux-color-danger)" },
  },
});

export const gridLine = style({
  stroke: "var(--flux-color-border)",
  fill: "none",
});
