import { style, globalStyle } from "@vanilla-extract/css";

export const overflow = style({ minInlineSize: 0, maxInlineSize: "100%" });
export const collection = style({
  position: "relative",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: "0.25rem",
  minInlineSize: 0,
  minBlockSize: 0,
  selectors: {
    "&[data-active]": { gridTemplateColumns: "minmax(0, 1fr) 8rem" },
  },
});
export const control = style({
  alignSelf: "start",
  inlineSize: "8rem",
  selectors: {
    [`${collection}:not([data-active]) &`]: {
      position: "absolute",
      visibility: "hidden",
      pointerEvents: "none",
    },
  },
});
// Intrinsic sizes stay observable; inert also removes hidden items from keyboard navigation.
globalStyle(`${collection} [data-flux-overflowed]`, {
  position: "absolute",
  inlineSize: "max-content",
  visibility: "hidden",
  pointerEvents: "none",
});
