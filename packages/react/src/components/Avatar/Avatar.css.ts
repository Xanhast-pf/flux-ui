import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";
export const avatar = style({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  inlineSize: "2.5rem",
  blockSize: "2.5rem",
  flexShrink: 0,
  overflow: "hidden",
  borderRadius: "50%",
  background: `var(${cssVars.color.accentSoft})`,
  color: `var(${cssVars.color.text})`,
  fontWeight: 600,
  fontSize: "1rem",
  verticalAlign: "middle",
  selectors: {
    "&[data-size='sm']": {
      inlineSize: "2rem",
      blockSize: "2rem",
      fontSize: "0.75rem",
    },
    "&[data-size='lg']": {
      inlineSize: "3.5rem",
      blockSize: "3.5rem",
      fontSize: "1.25rem",
    },
  },
  "@media": {
    "(forced-colors: active)": { outline: "0.0625rem solid CanvasText" },
  },
});
export const picture = style({
  position: "absolute",
  inset: 0,
  inlineSize: "100%",
  blockSize: "100%",
  objectFit: "cover",
});
