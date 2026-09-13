import { style } from "@vanilla-extract/css";
export const meter = style({
  display: "inline-flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "var(--flux-space-1)",
  color: "var(--flux-color-text)",
  selectors: {
    "&[hidden]:not([hidden='until-found' i])": { display: "none !important" },
    "&[data-orientation='horizontal']": {
      flexDirection: "row",
      inlineSize: "100%",
    },
  },
});
export const track = style({
  position: "relative",
  display: "block",
  overflow: "hidden",
  inlineSize: "1rem",
  blockSize: "8rem",
  background: "var(--flux-color-surface-subtle)",
  border: "0.0625rem solid var(--flux-color-border-strong)",
  borderRadius: "var(--flux-radius-sm)",
  selectors: {
    [`${meter}[data-orientation='horizontal'] &`]: {
      inlineSize: "100%",
      blockSize: "1rem",
    },
  },
});
export const fill = style({
  position: "absolute",
  insetInline: 0,
  insetBlockEnd: 0,
  blockSize: "var(--f-level)",
  background: "var(--flux-color-success)",
  selectors: {
    [`${meter}[data-orientation='horizontal'] &`]: {
      blockSize: "100%",
      inlineSize: "var(--f-level)",
    },
  },
});
export const peakStyle = style({
  position: "absolute",
  insetInline: 0,
  insetBlockEnd: "var(--f-peak)",
  borderBlockEnd: "0.125rem solid var(--flux-color-text)",
  selectors: {
    [`${meter}[data-orientation='horizontal'] &`]: {
      insetBlock: 0,
      insetInlineStart: "var(--f-peak)",
      insetInlineEnd: "auto",
      borderBlockEnd: 0,
      borderInlineEnd: "0.125rem solid var(--flux-color-text)",
    },
  },
});
export const clip = style({
  fontSize: "var(--flux-font-caption)",
  fontVariantNumeric: "tabular-nums",
  minInlineSize: "2rem",
});
