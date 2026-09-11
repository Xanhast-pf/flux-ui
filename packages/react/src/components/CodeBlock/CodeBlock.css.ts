import { style } from "@vanilla-extract/css";
export const codeBlock = style({ minInlineSize: 0 });
export const pre = style({
  margin: 0,
  padding: "var(--flux-space-4)",
  fontSize: "var(--flux-font-caption)",
  lineHeight: "var(--flux-font-leading)",
});
