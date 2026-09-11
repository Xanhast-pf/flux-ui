import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";

const background = "var(--f-a-bg)";
const foreground = "var(--f-a-fg)";
const hover = "var(--f-a-hv)";
const soft = "var(--f-a-sf)";

export const action = style({
  vars: {
    [background]: `var(${cssVars.color.accent})`,
    [foreground]: `var(${cssVars.color.accentForeground})`,
    [hover]: `var(${cssVars.color.accentHover})`,
    [soft]: `var(${cssVars.color.accentSoft})`,
  },
  border: "0.0625rem solid transparent",
  borderRadius: `var(--flux-button-radius, var(${cssVars.radius.md}))`,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: `var(${cssVars.space[2]})`,
  minHeight: `var(${cssVars.control.md})`,
  paddingInline: `var(${cssVars.space[4]})`,
  font: "inherit",
  fontSize: "1rem",
  fontWeight: 650,
  lineHeight: 1,
  transitionProperty: "background-color, border-color, color, transform",
  transitionDuration: `var(${cssVars.motion.fast})`,
  transitionTimingFunction: `var(${cssVars.motion.easing})`,
  selectors: {
    "&:where([data-tone='neutral'])": {
      vars: {
        [background]: `var(${cssVars.color.text})`,
        [foreground]: `var(${cssVars.color.surface})`,
        [hover]: `var(${cssVars.color.text})`,
        [soft]: `var(${cssVars.color.surfaceSubtle})`,
      },
    },
    "&:where([data-tone='danger'])": {
      vars: {
        [background]: `var(${cssVars.color.danger})`,
        [foreground]: `var(${cssVars.color.dangerForeground})`,
        [hover]: `var(${cssVars.color.dangerHover})`,
        [soft]: `var(${cssVars.color.dangerSoft})`,
      },
    },
    "&:where([data-variant='solid'])": {
      background: `var(--flux-button-bg, ${background})`,
      color: `var(--flux-button-fg, ${foreground})`,
    },
    "&:where([data-variant='solid']):hover:not(:disabled)": {
      background: hover,
    },
    "&:where([data-variant='soft'])": { background: soft, color: background },
    "&:where([data-variant='outline'])": {
      background: "transparent",
      borderColor: `var(${cssVars.color.border})`,
      color: `var(${cssVars.color.text})`,
    },
    "&:where([data-variant='ghost'])": {
      background: "transparent",
      color: `var(${cssVars.color.text})`,
    },
    "&:where([data-variant='ghost']):hover:not(:disabled)": {
      background: `var(${cssVars.color.surfaceSubtle})`,
    },
    "&:where([data-size='sm'])": {
      minHeight: `var(${cssVars.control.sm})`,
      paddingInline: `var(${cssVars.space[3]})`,
      fontSize: "0.75rem",
    },
    "&:where([data-size='lg'])": {
      minHeight: `var(${cssVars.control.lg})`,
      paddingInline: `var(${cssVars.space[5]})`,
    },
    "&:active:not(:disabled)": { transform: "scale(0.985)" },
  },
});
