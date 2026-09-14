import { style } from "@vanilla-extract/css";
import { floatingSurface } from "../../internal/floating.css.js";
export const root = style({ minInlineSize: 0, inlineSize: "100%" });
export const popup = style([
  floatingSurface,
  {
    minInlineSize:
      "min(var(--f-layer-anchor-width, 16rem), calc(100vw - 1rem))",
    padding: "var(--flux-space-1)",
  },
]);
export const option = style({
  width: "100%",
  border: 0,
  background: "transparent",
  color: "inherit",
  font: "inherit",
  textAlign: "start",
  padding: "var(--flux-space-2) var(--flux-space-3)",
  minBlockSize: "var(--flux-control-md)",
  display: "flex",
  alignItems: "center",
  boxSizing: "border-box",
  borderRadius: "var(--flux-radius-sm)",
  cursor: "pointer",
  selectors: {
    "&[aria-selected='true']": {
      background: "var(--flux-color-accent-soft)",
      outline: "1px solid var(--flux-color-focus)",
      outlineOffset: -1,
    },
    "&[aria-disabled='true']": { opacity: 0.5, cursor: "not-allowed" },
  },
});
export const empty = style({
  padding: "var(--flux-space-3)",
  color: "var(--flux-color-text-muted)",
  fontSize: "var(--flux-font-caption)",
});
