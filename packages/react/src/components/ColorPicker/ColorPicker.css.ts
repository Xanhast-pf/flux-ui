import { cssVars } from "@varua/tokens";
import { style } from "@vanilla-extract/css";

export const colorPicker = style({
  display: "grid",
  gridTemplateColumns: "2.5rem minmax(7rem, 1fr)",
  gap: "0.5rem",
  alignItems: "center",
  minInlineSize: 0,
  maxInlineSize: "16rem",
  selectors: {
    "&[data-disabled='true']": {
      opacity: 0.62,
    },
  },
});

export const colorInput = style({
  boxSizing: "border-box",
  inlineSize: "2.5rem",
  blockSize: "2.5rem",
  margin: 0,
  padding: "0.125rem",
  border: `0.0625rem solid var(${cssVars.color.borderStrong})`,
  borderRadius: "0.25rem",
  background: `var(${cssVars.color.surface})`,
  cursor: "pointer",
  selectors: {
    "&::-webkit-color-swatch-wrapper": {
      padding: 0,
    },
    "&::-webkit-color-swatch": {
      border: 0,
      borderRadius: "0.125rem",
    },
    "&::-moz-color-swatch": {
      border: 0,
      borderRadius: "0.125rem",
    },
    "&:focus-visible": {
      outline: `0.125rem solid var(${cssVars.color.focus})`,
      outlineOffset: "0.125rem",
    },
    "&:disabled": {
      cursor: "not-allowed",
    },
  },
  "@media": {
    "(forced-colors: active)": {
      borderColor: "CanvasText",
      background: "Canvas",
      selectors: {
        "&:focus-visible": {
          outlineColor: "Highlight",
        },
      },
    },
  },
});

export const hexInput = style({
  minInlineSize: 0,
  fontFamily: "var(--flux-font-mono)",
  textTransform: "lowercase",
});
