import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";

export const root = style({
  position: "relative",
  display: "inline-flex",
  maxInlineSize: "100%",
  verticalAlign: "middle",
  selectors: {
    "&[hidden]:not([hidden='until-found' i])": {
      display: "none !important",
    },
  },
});

export const marker = style({
  position: "absolute",
  zIndex: 1,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
  minInlineSize: "1.25rem",
  blockSize: "1.25rem",
  paddingInline: "0.25rem",
  border: `0.125rem solid var(${cssVars.color.surface})`,
  borderRadius: "999px",
  background: `var(${cssVars.color.danger})`,
  color: `var(${cssVars.color.dangerForeground})`,
  fontSize: "0.6875rem",
  fontWeight: 700,
  lineHeight: 1,
  pointerEvents: "none",
  whiteSpace: "nowrap",
  selectors: {
    "&[data-dot]": {
      minInlineSize: "0.75rem",
      blockSize: "0.75rem",
      paddingInline: 0,
    },
    "&[data-tone='neutral']": {
      background: `var(${cssVars.color.textMuted})`,
      color: `var(${cssVars.color.surface})`,
    },
    "&[data-tone='accent']": {
      background: `var(${cssVars.color.accent})`,
      color: `var(${cssVars.color.accentForeground})`,
    },
    "&[data-tone='success']": {
      background: `var(${cssVars.color.success})`,
      color: `var(${cssVars.color.successForeground})`,
    },
    "&[data-tone='warning']": {
      background: `var(${cssVars.color.warning})`,
      color: `var(${cssVars.color.warningForeground})`,
    },
    "&[data-tone='info']": {
      background: `var(${cssVars.color.info})`,
      color: `var(${cssVars.color.infoForeground})`,
    },
    [`${root}[data-placement='top-end'] &`]: {
      insetBlockStart: 0,
      insetInlineEnd: 0,
      transform: "translate(50%, -50%)",
    },
    [`${root}[data-placement='top-start'] &`]: {
      insetBlockStart: 0,
      insetInlineStart: 0,
      transform: "translate(-50%, -50%)",
    },
    [`${root}[data-placement='bottom-end'] &`]: {
      insetBlockEnd: 0,
      insetInlineEnd: 0,
      transform: "translate(50%, 50%)",
    },
    [`${root}[data-placement='bottom-start'] &`]: {
      insetBlockEnd: 0,
      insetInlineStart: 0,
      transform: "translate(-50%, 50%)",
    },
  },
  "@media": {
    "(forced-colors: active)": {
      borderColor: "Canvas",
      background: "CanvasText",
      color: "Canvas",
    },
  },
});
