import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";
const track = {
  blockSize: "var(--flux-slider-track-size, 0.25rem)",
  borderRadius: "999px",
  background: `var(${cssVars.color.borderStrong})`,
};
const thumb = {
  boxSizing: "border-box" as const,
  inlineSize:
    "var(--flux-slider-thumb-inline-size, var(--flux-slider-thumb-size, 1.25rem))",
  blockSize:
    "var(--flux-slider-thumb-block-size, var(--flux-slider-thumb-size, 1.25rem))",
  border: `0.125rem solid var(${cssVars.color.surface})`,
  borderRadius: "var(--flux-slider-thumb-radius, 50%)",
  background: `var(${cssVars.color.accent})`,
};
export const slider = style({
  appearance: "auto",
  accentColor: `var(${cssVars.color.accent})`,
  inlineSize: "var(--flux-slider-length, 100%)",
  minInlineSize: 0,
  blockSize: `var(${cssVars.control.md})`,
  margin: 0,
  cursor: "pointer",
  selectors: {
    "&[data-orientation='vertical']": {
      writingMode: "vertical-lr",
      direction: "rtl",
      inlineSize: "var(--flux-slider-length, 10rem)",
    },
    "&[data-appearance='custom']": {
      appearance: "none",
      background: "transparent",
    },
    "&[data-appearance='custom']::-webkit-slider-runnable-track": track,
    "&[data-appearance='custom']::-moz-range-track": track,
    "&[data-appearance='custom']::-webkit-slider-thumb": {
      ...thumb,
      appearance: "none",
      marginBlockStart:
        "calc((var(--flux-slider-track-size, 0.25rem) - var(--flux-slider-thumb-block-size, var(--flux-slider-thumb-size, 1.25rem))) / 2)",
    },
    "&[data-appearance='custom']::-moz-range-thumb": thumb,
    "&:focus-visible": {
      outline: `0.125rem solid var(${cssVars.color.focus})`,
      outlineOffset: "0.25rem",
    },
    "&:disabled": { cursor: "not-allowed", opacity: 0.62 },
  },
  "@media": {
    "(forced-colors: active)": {
      selectors: {
        "&[data-appearance='custom']::-webkit-slider-runnable-track": {
          background: "CanvasText",
        },
        "&[data-appearance='custom']::-moz-range-track": {
          background: "CanvasText",
        },
        "&[data-appearance='custom']::-webkit-slider-thumb": {
          background: "Highlight",
          borderColor: "CanvasText",
        },
        "&[data-appearance='custom']::-moz-range-thumb": {
          background: "Highlight",
          borderColor: "CanvasText",
        },
      },
    },
  },
});
