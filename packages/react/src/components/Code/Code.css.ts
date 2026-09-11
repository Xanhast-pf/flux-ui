import { style } from "@vanilla-extract/css";
export const code = style({
  fontFamily: "var(--flux-font-mono)",
  fontSize: "inherit",
  lineHeight: "inherit",
  background: "var(--flux-color-surface-subtle)",
  color: "var(--flux-color-text)",
  borderRadius: "var(--flux-radius-sm)",
  paddingInline: "var(--flux-space-1)",
  selectors: {
    "pre > &": { display: "block", background: "transparent", padding: 0 },
  },
});
