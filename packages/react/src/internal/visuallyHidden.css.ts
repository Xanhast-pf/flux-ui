import { style } from "@vanilla-extract/css";
// One-pixel clipping is an optical accessibility technique, not layout spacing.
export const hidden = style({
  position: "absolute",
  inlineSize: "1px",
  blockSize: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: 0,
});
