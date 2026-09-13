import { style } from "@vanilla-extract/css";

export const layout = style({
  display: "grid",
  gridTemplateColumns: "auto minmax(0, 1fr)",
  alignItems: "start",
  minInlineSize: 0,
  containerType: "inline-size",
  containerName: "flux-sidebar",
});
export const panel = style({
  boxSizing: "border-box",
  gridColumn: 1,
  minInlineSize: 0,
  inlineSize: "var(--flux-sidebar-width, 18rem)",
  position: "sticky",
  insetBlockStart: "var(--flux-sidebar-offset, 0rem)",
  maxBlockSize: "calc(100dvh - var(--flux-sidebar-offset, 0rem))",
  overflowY: "auto",
  overflowWrap: "anywhere",
  overscrollBehavior: "contain",
  scrollbarGutter: "stable",
  padding: "var(--flux-space-4)",
  borderInlineEnd: "0.0625rem solid var(--flux-color-border)",
  background: "var(--flux-color-surface)",
  color: "var(--flux-color-text)",
  "@container": {
    "flux-sidebar (width < 48rem)": {
      gridColumn: "1 / -1",
      position: "static",
      inlineSize: "auto",
      maxBlockSize: "24rem",
      borderInlineEnd: 0,
      borderBlockEnd: "0.0625rem solid var(--flux-color-border)",
    },
  },
});
export const content = style({
  gridColumn: 2,
  minInlineSize: 0,
  "@container": {
    "flux-sidebar (width < 48rem)": { gridColumn: "1 / -1" },
  },
});
