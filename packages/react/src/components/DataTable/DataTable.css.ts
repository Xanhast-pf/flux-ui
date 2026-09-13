import { style } from "@vanilla-extract/css";
export const dataTable = style({
  minInlineSize: 0,
  color: "var(--flux-color-text)",
});
export const scrollport = style({
  overflow: "auto",
  overflowAnchor: "none",
  border: "0.0625rem solid var(--flux-color-border)",
  borderRadius: "var(--flux-radius-md)",
  selectors: {
    "&:focus-visible": {
      outline: "0.125rem solid var(--flux-color-focus)",
      outlineOffset: "0.125rem",
    },
  },
});
export const table = style({
  borderCollapse: "separate",
  borderSpacing: 0,
  tableLayout: "fixed",
  inlineSize: "100%",
  minInlineSize: "24rem",
  fontVariantNumeric: "tabular-nums",
});
export const caption = style({
  textAlign: "start",
  padding: "var(--flux-space-3)",
  color: "var(--flux-color-text-muted)",
  fontSize: "var(--flux-font-caption)",
});
export const header = style({
  position: "sticky",
  insetBlockStart: 0,
  zIndex: 1,
  background: "var(--flux-color-surface-subtle)",
});
export const headerCell = style({
  textAlign: "start",
  padding: "var(--flux-space-2)",
  fontWeight: "var(--flux-font-medium)",
  borderBlockEnd: "0.0625rem solid var(--flux-color-border)",
});
export const sortButton = style({
  font: "inherit",
  textAlign: "inherit",
  color: "inherit",
  background: "transparent",
  border: 0,
  cursor: "pointer",
  padding: "var(--flux-space-1)",
  selectors: {
    "&:focus-visible": { outline: "0.125rem solid var(--flux-color-focus)" },
  },
});
export const bodyCell = style({
  padding: 0,
  boxShadow: "inset 0 -1px var(--flux-color-border)",
  overflow: "hidden",
});
export const cellContent = style({
  boxSizing: "border-box",
  paddingInline: "var(--flux-space-2)",
  display: "flex",
  alignItems: "center",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});
export const spacer = style({ padding: 0, border: 0, lineHeight: 0 });
