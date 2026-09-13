import { style } from "@vanilla-extract/css";
export const fieldset = style({
  selectors: {},
  display: "grid",
  gap: "var(--flux-space-4)",
  padding: 0,
  margin: 0,
  border: 0,
  minInlineSize: 0,
});
export const legend = style({
  padding: 0,
  marginBlockEnd: "var(--flux-space-3)",
  fontSize: "var(--flux-font-body-size)",
  fontWeight: "var(--flux-font-medium)",
});
