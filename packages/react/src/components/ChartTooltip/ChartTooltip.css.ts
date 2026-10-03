import { style } from "@vanilla-extract/css";
import { chartTone } from "../../internal/chartTone.css.js";

export const frame = style({
  position: "relative",
  minInlineSize: 0,
});

export const popup = style({
  position: "absolute",
  zIndex: 1,
  inlineSize: "max-content",
  maxInlineSize: "min(16rem, calc(100% - 1rem))",
  padding: "var(--flux-space-2) var(--flux-space-3)",
  border: "1px solid var(--flux-color-border)",
  borderRadius: "var(--flux-radius-sm)",
  background: "var(--flux-color-surface-elevated)",
  color: "var(--flux-color-text)",
  boxShadow: "0 0.25rem 0.75rem rgb(0 0 0 / 0.14)",
  fontSize: "var(--flux-font-caption)",
  lineHeight: 1.35,
  overflowWrap: "anywhere",
  pointerEvents: "none",
  "@media": {
    "(forced-colors: active)": {
      borderColor: "CanvasText",
      background: "Canvas",
      color: "CanvasText",
      boxShadow: "none",
    },
  },
});

export const label = style({
  display: "block",
  marginBlockEnd: "var(--flux-space-1)",
  color: "var(--flux-color-text-muted)",
});

export const rows = style({
  display: "grid",
  gap: "var(--flux-space-1)",
});

export const row = style({
  display: "grid",
  gridTemplateColumns: "auto minmax(0, 1fr) auto",
  gap: "var(--flux-space-2)",
  alignItems: "center",
});

export const mark = style([
  chartTone,
  {
    inlineSize: "0.5rem",
    blockSize: "0.5rem",
    borderRadius: "999px",
    background: "currentColor",
  },
]);

export const value = style({
  fontVariantNumeric: "tabular-nums",
  fontWeight: "var(--flux-font-medium)",
});
