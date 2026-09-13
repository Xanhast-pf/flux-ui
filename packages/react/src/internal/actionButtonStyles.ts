import { cssVars } from "@flux-ui/tokens";
import { createVar, keyframes, type StyleRule } from "@vanilla-extract/css";

// Build-time-only composition: invoke from a component .css.ts file. Each action
// owns its CSS asset, so importing an IconButton or Toolbar never loads Button's
// recipe runtime or another public component entry. No selectors run in React.
export function actionButtonStyles(): {
  button: StyleRule;
  content: StyleRule;
} {
  const background = createVar();
  const foreground = createVar();
  const hover = createVar();
  const soft = createVar();
  const spin = keyframes({ to: { transform: "rotate(360deg)" } });

  const button: StyleRule = {
    vars: {
      [background]: `var(${cssVars.color.accent})`,
      [foreground]: `var(${cssVars.color.accentForeground})`,
      [hover]: `var(${cssVars.color.accentHover})`,
      [soft]: `var(${cssVars.color.accentSoft})`,
    },
    appearance: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    border: "0.0625rem solid transparent",
    borderRadius: `var(--flux-button-radius, var(${cssVars.radius.md}))`,
    minBlockSize: `var(${cssVars.control.md})`,
    paddingInline: `var(${cssVars.space[4]})`,
    font: "inherit",
    fontSize: "1rem",
    fontWeight: 650,
    lineHeight: 1,
    cursor: "pointer",
    userSelect: "none",
    background: `var(--flux-button-bg, ${background})`,
    color: `var(--flux-button-fg, ${foreground})`,
    transition: ["background-color", "border-color", "color", "transform"]
      .map(
        (property) =>
          `${property} var(${cssVars.motion.fast}) var(${cssVars.motion.easing})`,
      )
      .join(", "),
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
      "&:where([data-variant='solid']):hover:not(:disabled):not([aria-pressed='true'])":
        { background: hover },
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
      "&:where([data-variant='ghost']):hover:not(:disabled):not([aria-pressed='true'])":
        { background: `var(${cssVars.color.surfaceSubtle})` },
      "&:where([data-size='sm'])": {
        minBlockSize: `var(${cssVars.control.sm})`,
        paddingInline: `var(${cssVars.space[3]})`,
        fontSize: "0.75rem",
      },
      "&:where([data-size='lg'])": {
        minBlockSize: `var(${cssVars.control.lg})`,
        paddingInline: `var(${cssVars.space[5]})`,
      },
      "&:focus-visible": {
        outline: `0.125rem solid var(${cssVars.color.focus})`,
        outlineOffset: "0.125rem",
      },
      "&:active:not(:disabled)": { transform: "scale(0.985)" },
      "&:disabled": { cursor: "not-allowed", opacity: 0.52 },
      "&[data-loading='true']::after": {
        content: '""',
        position: "absolute",
        inlineSize: "1rem",
        blockSize: "1rem",
        border: "0.125rem solid currentColor",
        borderRightColor: "transparent",
        borderRadius: "50%",
        animation: `${spin} 650ms linear infinite`,
      },
    },
    "@media": {
      "(prefers-reduced-motion: reduce)": {
        transition: "none",
        selectors: { "&[data-loading='true']::after": { animation: "none" } },
      },
      "(forced-colors: active)": {
        borderColor: "ButtonText",
        selectors: {
          "&:disabled": {
            color: "GrayText",
            borderColor: "GrayText",
            opacity: 1,
          },
        },
      },
    },
  };

  // Opacity keeps the accessible name and occupied space while the CSS-only
  // spinner is visible. Do not use display:none or aria-hidden on this content.
  const content: StyleRule = {
    display: "inline-flex",
    alignItems: "center",
    gap: `var(${cssVars.space[2]})`,
    selectors: { "[data-loading='true'] > &": { opacity: 0 } },
  };
  return { button: button, content: content };
}
