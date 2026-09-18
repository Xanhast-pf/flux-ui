import { scrollbar } from "../../internal/scrollbar.css.js";
import { cssVars } from "@flux-ui/tokens";
import { globalStyle, keyframes, style } from "@vanilla-extract/css";

export const root = style({
  minInlineSize: 0,
  maxInlineSize: "100%",
});

export const list = style([
  scrollbar,
  {
    minInlineSize: 0,
    maxInlineSize: "100%",
    overflowX: "auto",
    overscrollBehaviorInline: "contain",
    display: "flex",
    flexWrap: "nowrap",
    gap: `var(${cssVars.space[1]})`,
    borderBottom: `0.0625rem solid var(${cssVars.color.border})`,
    selectors: {
      "&[data-flux-tabs-managed]": { overflowX: "hidden" },
      "&[data-w]": { flexWrap: "wrap" },
      "&[data-a='pill']": { border: 0 },
      "&[aria-orientation='vertical']": {
        flexDirection: "column",
        borderBottom: 0,
        borderInlineEnd: `0.0625rem solid var(${cssVars.color.border})`,
      },
    },
  },
]);

export const tab = style({
  flexShrink: 0,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "var(--flux-space-2)",
  minHeight: `var(${cssVars.control.md})`,
  border: "0 solid transparent",
  borderBottomWidth: "0.125rem",
  background: "transparent",
  color: `var(${cssVars.color.textMuted})`,
  cursor: "pointer",
  font: "inherit",
  fontWeight: 650,
  paddingInline: `var(${cssVars.space[3]})`,
  transitionProperty: "background-color, border-color, color",
  transitionDuration: `var(${cssVars.motion.normal})`,
  transitionTimingFunction: `var(${cssVars.motion.easing})`,
  selectors: {
    "&[data-s='sm']": {
      minHeight: "var(--flux-control-sm)",
      fontSize: "var(--flux-font-caption)",
    },
    "&[data-s='lg']": {
      minHeight: "var(--flux-control-lg)",
      fontSize: "var(--flux-font-lead)",
    },
    "&[data-a='pill']": {
      borderRadius: "var(--flux-radius-md)",
      borderWidth: 0,
    },
    "&[data-a='pill'][aria-selected='true']": {
      background: "var(--flux-color-text)",
      color: "var(--flux-color-surface)",
    },
    "&:hover:not(:disabled):not([aria-selected='true'])": {
      background: `var(${cssVars.color.surfaceSubtle})`,
      color: `var(${cssVars.color.text})`,
    },
    "&[aria-selected='true']": {
      borderColor: `var(${cssVars.color.accent})`,
      color: `var(${cssVars.color.text})`,
    },
    "&:focus-visible": {
      outline: `0.125rem solid var(${cssVars.color.focus})`,
      outlineOffset: "-0.125rem",
    },
    "&:disabled": { cursor: "not-allowed", opacity: 0.5 },
    "&[data-o='vertical']": {
      justifyContent: "flex-start",
      borderInlineEndWidth: "0.125rem",
      borderBottomWidth: 0,
      textAlign: "start",
    },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": { transition: "none" },
    "(forced-colors: active)": {
      selectors: {
        "&[aria-selected='true']": {
          outline: "0.125rem solid Highlight",
          outlineOffset: "-0.25rem",
        },
      },
    },
  },
});

const entrance = keyframes({
  from: { opacity: 0, transform: "translateY(0.125rem)" },
  to: { opacity: 1, transform: "none" },
});
export const panel = style({
  animation: `${entrance} var(--flux-motion-normal) var(--flux-motion-easing)`,
  "@media": { "(prefers-reduced-motion: reduce)": { animation: "none" } },
  selectors: {
    "&[data-p='none']": { padding: 0 },
  },
  paddingBlock: `var(${cssVars.space[4]})`,
});

globalStyle(`:is(${list},${tab})[hidden]:not([hidden='until-found' i])`, {
  display: "none !important",
});

export const strip = style({
  position: "relative",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  columnGap: "var(--flux-space-1)",
  minInlineSize: 0,
  selectors: {
    "&[data-active]": { gridTemplateColumns: "minmax(0, 1fr) max-content" },
  },
});
export const more = style({
  alignSelf: "start",
  selectors: {
    [`${strip}:not([data-active]) &`]: {
      position: "absolute",
      visibility: "hidden",
      pointerEvents: "none",
    },
  },
});
// Fixed invisible boxes retain intrinsic measurement without creating scrollable
// overflow in the tablist. Inert removes their semantic and keyboard exposure.
globalStyle(`${list} [data-flux-tab-overflowed]`, {
  position: "fixed",
  inset: 0,
  inlineSize: "max-content",
  blockSize: "max-content",
  visibility: "hidden",
  pointerEvents: "none",
});
globalStyle(
  `${list}[data-flux-tabs-managed] [role="tab"]:not([data-flux-tab-overflowed])`,
  {
    minInlineSize: 0,
    maxInlineSize: "100%",
    overflow: "hidden",
  },
);
