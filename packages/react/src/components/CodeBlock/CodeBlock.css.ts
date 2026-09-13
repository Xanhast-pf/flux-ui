import { style } from "@vanilla-extract/css";
export const codeBlock = style({
  minInlineSize: 0,
  overflow: "hidden",
  border: "0.0625rem solid var(--flux-color-border)",
  borderRadius: "var(--flux-radius-lg)",
  background: "var(--flux-color-surface-subtle)",
  color: "var(--flux-color-text)",
});
export const header = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "var(--flux-space-2)",
  padding: "var(--flux-space-2) var(--flux-space-4)",
  borderBlockEnd: "0.0625rem solid var(--flux-color-border)",
  fontSize: "var(--flux-font-caption)",
  fontWeight: "var(--flux-font-medium)",
});
export const pre = style({
  margin: 0,
  padding: "var(--flux-space-4)",
  fontFamily: "var(--flux-font-mono)",
  fontSize: "var(--flux-font-caption)",
  lineHeight: "var(--flux-font-leading)",
  tabSize: 2,
});
export const status = style({
  margin: 0,
  padding: "var(--flux-space-1) var(--flux-space-4)",
  fontSize: "var(--flux-font-caption)",
  color: "var(--flux-color-text-muted)",
});
export const token = style({
  selectors: {
    "&[data-token='comment']": { color: "var(--flux-color-text-muted)" },
    "&[data-token='keyword']": {
      color: "var(--flux-color-accent)",
      fontWeight: "var(--flux-font-medium)",
    },
    "&[data-token='string']": { color: "var(--flux-color-success)" },
    "&[data-token='number']": { color: "var(--flux-color-warning)" },
    "&[data-token='property']": { color: "var(--flux-color-info)" },
    "&[data-token='punctuation']": { color: "var(--flux-color-text-subtle)" },
  },
});
