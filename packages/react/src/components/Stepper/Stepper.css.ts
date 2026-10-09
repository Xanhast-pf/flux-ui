import { cssVars } from "@varua/tokens";
import { style } from "@vanilla-extract/css";

export const root = style({
  display: "flex",
  margin: 0,
  padding: 0,
  overflowX: "auto",
  listStyle: "none",
  counterReset: "flux-stepper",
  selectors: {
    "&[hidden]:not([hidden='until-found' i])": {
      display: "none !important",
    },
    "&[data-orientation='vertical']": {
      flexDirection: "column",
      overflowX: "visible",
    },
  },
});

export const item = style({
  position: "relative",
  display: "grid",
  gridTemplateColumns: "2rem minmax(0, 1fr)",
  alignItems: "start",
  gap: "var(" + cssVars.space[2] + ")",
  flex: "1 0 8rem",
  minInlineSize: 0,
  paddingInlineEnd: "var(" + cssVars.space[4] + ")",
  counterIncrement: "flux-stepper",
  color: "var(" + cssVars.color.textMuted + ")",
  selectors: {
    "&[hidden]:not([hidden='until-found' i])": {
      display: "none !important",
    },
    [root + "[data-orientation='vertical'] &"]: {
      flex: "none",
      paddingInlineEnd: 0,
      paddingBlockEnd: "var(" + cssVars.space[4] + ")",
    },
    [root + "[data-orientation='horizontal'] &:not(:last-child)::after"]: {
      content: '""',
      position: "absolute",
      zIndex: 0,
      insetBlockStart: "1rem",
      insetInlineStart: "calc(100% - var(" + cssVars.space[4] + "))",
      insetInlineEnd: "-1rem",
      blockSize: "0.0625rem",
      background: "var(" + cssVars.color.borderStrong + ")",
    },
    [root + "[data-orientation='vertical'] &:not(:last-child)::after"]: {
      content: '""',
      position: "absolute",
      zIndex: 0,
      insetBlockStart: "2rem",
      insetBlockEnd: 0,
      insetInlineStart: "1rem",
      inlineSize: "0.0625rem",
      background: "var(" + cssVars.color.borderStrong + ")",
    },
    "&[data-status='current']": {
      color: "var(" + cssVars.color.text + ")",
      fontWeight: 600,
    },
    "&[data-status='complete']": {
      color: "var(" + cssVars.color.text + ")",
    },
    "&[data-status='error']": {
      color: "var(" + cssVars.color.danger + ")",
      fontWeight: 600,
    },
    "&[data-status='complete']:not(:last-child)::after": {
      background: "var(" + cssVars.color.success + ")",
    },
  },
});

export const indicator = style({
  position: "relative",
  zIndex: 1,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  inlineSize: "2rem",
  blockSize: "2rem",
  boxSizing: "border-box",
  border: "0.0625rem solid var(" + cssVars.color.borderStrong + ")",
  borderRadius: "50%",
  background: "var(" + cssVars.color.surface + ")",
  color: "var(" + cssVars.color.textMuted + ")",
  fontSize: "0.75rem",
  fontWeight: 700,
  lineHeight: 1,
  selectors: {
    "&::before": {
      content: "counter(flux-stepper)",
    },
    [item + "[data-status='current'] &"]: {
      borderColor: "var(" + cssVars.color.accent + ")",
      background: "var(" + cssVars.color.accentSoft + ")",
      color: "var(" + cssVars.color.accent + ")",
    },
    [item + "[data-status='complete'] &"]: {
      borderColor: "var(" + cssVars.color.success + ")",
      background: "var(" + cssVars.color.successSoft + ")",
      color: "var(" + cssVars.color.success + ")",
    },
    [item + "[data-status='complete'] &::before"]: {
      content: '"✓"',
    },
    [item + "[data-status='error'] &"]: {
      borderColor: "var(" + cssVars.color.danger + ")",
      background: "var(" + cssVars.color.dangerSoft + ")",
      color: "var(" + cssVars.color.danger + ")",
    },
    [item + "[data-status='error'] &::before"]: {
      content: '"!"',
    },
  },
  "@media": {
    "(forced-colors: active)": {
      borderColor: "CanvasText",
      background: "Canvas",
      color: "CanvasText",
      selectors: {
        [item + "[data-status='current'] &"]: {
          borderColor: "Highlight",
          outline: "0.125rem solid Highlight",
          outlineOffset: "0.125rem",
          background: "Canvas",
          color: "CanvasText",
        },
      },
    },
  },
});

export const content = style({
  minInlineSize: 0,
  paddingBlockStart: "var(" + cssVars.space[1] + ")",
  overflowWrap: "anywhere",
  lineHeight: 1.5,
});

const interactive = style({
  color: "inherit",
  font: "inherit",
  fontWeight: 600,
  textUnderlineOffset: "0.25rem",
  selectors: {
    "&[hidden]:not([hidden='until-found' i])": {
      display: "none !important",
    },
    "&:focus-visible": {
      outline: "0.125rem solid var(" + cssVars.color.focus + ")",
      outlineOffset: "0.125rem",
    },
  },
});

export const link = style([
  interactive,
  {
    textDecoration: "none",
    selectors: {
      "&:hover": {
        textDecoration: "underline",
      },
    },
  },
]);

export const button = style([
  interactive,
  {
    padding: 0,
    border: 0,
    background: "transparent",
    textAlign: "start",
    cursor: "pointer",
    selectors: {
      "&:hover:not(:disabled)": {
        textDecoration: "underline",
      },
      "&:disabled": {
        opacity: 0.6,
        cursor: "not-allowed",
      },
    },
    "@media": {
      "(forced-colors: active)": {
        selectors: {
          "&:disabled": {
            color: "GrayText",
            opacity: 1,
          },
        },
      },
    },
  },
]);

export const visuallyHidden = style({
  position: "absolute",
  inlineSize: "0.0625rem",
  blockSize: "0.0625rem",
  padding: 0,
  margin: "-0.0625rem",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
});
