import { style } from "@vanilla-extract/css";
import { floatingSurface } from "../../internal/floating.css.js";

export const tooltip = style([
  floatingSurface,
  {
    padding: "var(--flux-space-2) var(--flux-space-3)",
    maxInlineSize: "min(20rem, calc(100vw - 1rem))",
    fontSize: "var(--flux-font-caption)",
    lineHeight: 1.5,
    overflowWrap: "anywhere",
    selectors: {
      "&[data-arrow='true']": { overflow: "visible" },
    },
  },
]);

export const arrow = style({
  position: "absolute",
  inlineSize: "0.5rem",
  blockSize: "0.5rem",
  boxSizing: "border-box",
  background: "var(--flux-color-surface-elevated)",
  borderInlineStart: "1px solid var(--flux-color-border)",
  borderBlockStart: "1px solid var(--flux-color-border)",
  pointerEvents: "none",
  transform: "rotate(45deg)",
  selectors: {
    [`${tooltip}[data-side='top'] > &`]: {
      insetBlockEnd: "-0.3rem",
      insetInlineStart: "calc(50% - 0.25rem)",
      transform: "rotate(225deg)",
    },
    [`${tooltip}[data-side='bottom'] > &`]: {
      insetBlockStart: "-0.3rem",
      insetInlineStart: "calc(50% - 0.25rem)",
      transform: "rotate(45deg)",
    },
    [`${tooltip}[data-side='left'] > &`]: {
      insetInlineEnd: "-0.3rem",
      insetBlockStart: "calc(50% - 0.25rem)",
      transform: "rotate(135deg)",
    },
    [`${tooltip}[data-side='right'] > &`]: {
      insetInlineStart: "-0.3rem",
      insetBlockStart: "calc(50% - 0.25rem)",
      transform: "rotate(315deg)",
    },
  },
  "@media": {
    "(forced-colors: active)": {
      background: "Canvas",
      borderColor: "CanvasText",
    },
  },
});
