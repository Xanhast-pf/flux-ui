import { style } from "@vanilla-extract/css";
export const floatingSurface = style({
  position: "fixed",
  inset: "auto",
  margin: 0,
  left: "var(--f-layer-left, 0px)",
  top: "var(--f-layer-top, 0px)",
  maxInlineSize: "calc(100vw - 1rem)",
  maxBlockSize:
    "min(var(--f-layer-height, calc(100dvh - 1rem)), calc(100dvh - 1rem))",
  overflow: "auto",
  boxSizing: "border-box",
  zIndex: 100,
  background: "var(--flux-color-surface-elevated)",
  color: "var(--flux-color-text)",
  border: "1px solid var(--flux-color-border)",
  borderRadius: "var(--flux-radius-lg)",
  boxShadow: "0 0.75rem 2rem rgb(0 0 0 / 0.18)",
  selectors: {
    "&[data-state='closed']": { display: "none" },
    "&:focus-visible": {
      outline: "2px solid var(--flux-color-focus)",
      outlineOffset: 2,
    },
  },
  "@media": {
    "(forced-colors: active)": {
      border: "1px solid CanvasText",
      boxShadow: "none",
    },
  },
});
