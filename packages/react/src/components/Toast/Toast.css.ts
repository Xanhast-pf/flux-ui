import { style } from "@vanilla-extract/css";
export const viewport = style({
  display: "grid",
  gap: "var(--flux-space-3)",
  listStyle: "none",
  padding: 0,
  margin: 0,
  position: "fixed",
  insetInlineEnd: "var(--flux-space-4)",
  insetBlockEnd: "var(--flux-space-4)",
  inlineSize: "min(24rem, calc(100vw - 2rem))",
  maxBlockSize: "calc(100dvh - 2rem)",
  overflow: "auto",
  zIndex: 100,
  selectors: {
    "&[data-placement='inline']": {
      position: "static",
      inlineSize: "100%",
      maxBlockSize: "none",
    },
    "&[hidden]": { display: "none" },
  },
});
export const item = style({
  display: "grid",
  gap: "var(--flux-space-3)",
  padding: "var(--flux-space-4)",
  border: "1px solid var(--flux-color-border)",
  borderInlineStart: "3px solid var(--flux-color-border-strong)",
  borderRadius: "var(--flux-radius-md)",
  background: "var(--flux-color-surface-elevated)",
  color: "var(--flux-color-text)",
  boxShadow: "0 0.5rem 1.5rem rgb(0 0 0 / 0.12)",
  selectors: {
    "&[data-tone='success']": {
      borderInlineStartColor: "var(--flux-color-success)",
    },
    "&[data-tone='danger']": {
      borderInlineStartColor: "var(--flux-color-danger)",
    },
  },
});
export const title = style({ display: "block", fontWeight: 600 });
export const description = style({
  marginBlock: "var(--flux-space-1) 0",
  fontSize: "var(--flux-font-caption)",
  color: "var(--flux-color-text-muted)",
});
export const actions = style({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "flex-end",
  gap: "var(--flux-space-2)",
});
