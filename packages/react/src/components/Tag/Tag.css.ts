import { style } from "@vanilla-extract/css";
export const tag = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--flux-space-1)",
  maxInlineSize: "100%",
  paddingInline: "var(--flux-space-2)",
  paddingBlock: "var(--flux-space-1)",
  border: "1px solid var(--flux-color-border)",
  borderRadius: "var(--flux-radius-sm)",
  background: "var(--flux-color-surface-subtle)",
  color: "var(--flux-color-text)",
  fontSize: "var(--flux-font-caption)",
  overflowWrap: "anywhere",
  selectors: {
    "&[hidden]": { display: "none" },
    "&[data-tone='accent']": { background: "var(--flux-color-accent-soft)" },
  },
});
export const remove = style({
  display: "inline-grid",
  placeItems: "center",
  flexShrink: 0,
  minInlineSize: "1.5rem",
  minBlockSize: "1.5rem",
  border: 0,
  borderRadius: "var(--flux-radius-sm)",
  font: "inherit",
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
  selectors: {
    "&:focus-visible": {
      outline: "2px solid var(--flux-color-focus)",
      outlineOffset: 1,
    },
  },
});
