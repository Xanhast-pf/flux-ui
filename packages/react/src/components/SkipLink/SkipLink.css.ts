import { style } from "@vanilla-extract/css";

export const skipLink = style({
  position: "fixed",
  zIndex: 100,
  insetBlockStart: "var(--flux-space-2)",
  insetInlineStart: "var(--flux-space-2)",
  transform: "translateY(calc(-100% - var(--flux-space-4)))",
  padding: "var(--flux-space-3) var(--flux-space-4)",
  borderRadius: "var(--flux-radius-sm)",
  background: "var(--flux-color-surface)",
  color: "var(--flux-color-text)",
  textUnderlineOffset: "0.2em",
  selectors: {
    "&:focus": { transform: "none" },
    "&:focus-visible": {
      outline: "0.125rem solid var(--flux-color-focus)",
      outlineOffset: "0.125rem",
    },
  },
});
