import { style } from "@vanilla-extract/css";
export const root = style({
  display: "flex",
  alignItems: "center",
  minInlineSize: 0,
  gap: "var(--flux-space-2)",
  paddingInline: "var(--flux-space-3)",
  background: "var(--flux-color-surface)",
  color: "var(--flux-color-text)",
  border: "1px solid var(--flux-color-border)",
  borderRadius: "var(--flux-radius-md)",
  selectors: {
    "&:focus-within": {
      outline: "2px solid var(--flux-color-focus)",
      outlineOffset: 2,
    },
    "&[hidden]": { display: "none" },
    "&:has([aria-invalid='true'])": { borderColor: "var(--flux-color-danger)" },
  },
});
export const addon = style({
  display: "inline-flex",
  alignItems: "center",
  flexShrink: 0,
  gap: "var(--flux-space-1)",
  color: "var(--flux-color-text-muted)",
  fontSize: "var(--flux-font-caption)",
});
export const input = style({
  flex: 1,
  border: 0,
  borderRadius: 0,
  paddingInline: 0,
  selectors: { "&:focus-visible": { outline: "none" } },
});
