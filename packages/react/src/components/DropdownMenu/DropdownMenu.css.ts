import { style } from "@vanilla-extract/css";
export const menu = style({ padding: "var(--flux-space-1)" });
export const item = style({
  display: "flex",
  alignItems: "center",
  gap: "var(--flux-space-2)",
  inlineSize: "100%",
  minBlockSize: "var(--flux-control-md)",
  textAlign: "start",
  font: "inherit",
  padding: "var(--flux-space-2) var(--flux-space-3)",
  border: 0,
  borderRadius: "var(--flux-radius-sm)",
  cursor: "pointer",
  background: "transparent",
  color: "inherit",
  selectors: {
    "&:focus-visible": {
      outline: "2px solid var(--flux-color-focus)",
      outlineOffset: -2,
    },
    "&:hover:not(:disabled), &:focus": {
      background: "var(--flux-color-accent-soft)",
    },
    "&:disabled": { opacity: 0.5, cursor: "not-allowed" },
    "&[data-tone='danger']": { color: "var(--flux-color-danger)" },
  },
});
export const label = style({
  padding: "var(--flux-space-2) var(--flux-space-3)",
  color: "var(--flux-color-text-muted)",
  fontSize: "var(--flux-font-caption)",
});
export const separator = style({
  border: 0,
  borderBlockStart: "1px solid var(--flux-color-border)",
  marginBlock: "var(--flux-space-1)",
});
