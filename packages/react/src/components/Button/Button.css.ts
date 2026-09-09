import { cssVars } from "@flux-ui/tokens";
import { keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

const spin = keyframes({
  to: { transform: "rotate(360deg)" },
});

export const button = recipe({
  base: {
    appearance: "none",
    border: "1px solid transparent",
    borderRadius: `var(--flux-button-radius, var(${cssVars.radius.md}))`,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: `var(${cssVars.space[2]})`,
    font: "inherit",
    fontWeight: 650,
    lineHeight: 1,
    position: "relative",
    userSelect: "none",
    transition: [
      `background-color var(${cssVars.motion.fast}) var(${cssVars.motion.easing})`,
      `border-color var(${cssVars.motion.fast}) var(${cssVars.motion.easing})`,
      `color var(${cssVars.motion.fast}) var(${cssVars.motion.easing})`,
      `transform var(${cssVars.motion.fast}) var(${cssVars.motion.easing})`,
    ].join(", "),
    selectors: {
      "&:focus-visible": {
        outline: `3px solid color-mix(in srgb, var(${cssVars.color.focus}) 55%, transparent)`,
        outlineOffset: 2,
      },
      "&:active:not(:disabled)": { transform: "scale(0.985)" },
      "&:disabled": { cursor: "not-allowed", opacity: 0.52 },
    },
  },
  variants: {
    size: {
      sm: {
        minHeight: `var(${cssVars.control.sm})`,
        paddingInline: `var(${cssVars.space[3]})`,
        fontSize: "0.8125rem",
      },
      md: {
        minHeight: `var(${cssVars.control.md})`,
        paddingInline: `var(${cssVars.space[4]})`,
        fontSize: "0.9375rem",
      },
      lg: {
        minHeight: `var(${cssVars.control.lg})`,
        paddingInline: `var(${cssVars.space[5]})`,
        fontSize: "1rem",
      },
    },
    tone: {
      accent: {},
      neutral: {},
      danger: {},
    },
    variant: {
      solid: {},
      soft: {},
      outline: { background: "transparent" },
      ghost: { background: "transparent", borderColor: "transparent" },
    },
  },
  compoundVariants: [
    {
      variants: { tone: "accent", variant: "solid" },
      style: {
        background: `var(--flux-button-bg, var(${cssVars.color.accent}))`,
        color: `var(--flux-button-fg, var(${cssVars.color.accentForeground}))`,
        selectors: {
          "&:hover:not(:disabled)": {
            background: `var(${cssVars.color.accentHover})`,
          },
        },
      },
    },
    {
      variants: { tone: "danger", variant: "solid" },
      style: {
        background: `var(--flux-button-bg, var(${cssVars.color.danger}))`,
        color: `var(--flux-button-fg, var(${cssVars.color.dangerForeground}))`,
        selectors: {
          "&:hover:not(:disabled)": {
            background: `var(${cssVars.color.dangerHover})`,
          },
        },
      },
    },
    {
      variants: { tone: "neutral", variant: "solid" },
      style: {
        background: `var(--flux-button-bg, var(${cssVars.color.text}))`,
        color: `var(--flux-button-fg, var(${cssVars.color.surface}))`,
      },
    },
    {
      variants: { variant: "soft" },
      style: {
        background: "color-mix(in srgb, currentColor 10%, transparent)",
        color: `var(${cssVars.color.text})`,
      },
    },
    {
      variants: { variant: "outline" },
      style: {
        borderColor: `var(${cssVars.color.border})`,
        color: `var(${cssVars.color.text})`,
      },
    },
    {
      variants: { variant: "ghost" },
      style: {
        color: `var(${cssVars.color.text})`,
        selectors: {
          "&:hover:not(:disabled)": {
            background: "color-mix(in srgb, currentColor 8%, transparent)",
          },
        },
      },
    },
  ],
  defaultVariants: { size: "md", tone: "accent", variant: "solid" },
});

export const content = style({
  display: "inline-flex",
  alignItems: "center",
  gap: `var(${cssVars.space[2]})`,
  selectors: {
    "button[data-loading='true'] &": { opacity: 0 },
  },
});

export const spinner = style({
  width: "1em",
  height: "1em",
  border: "0.125em solid currentColor",
  borderRightColor: "transparent",
  borderRadius: "999px",
  animation: `${spin} 650ms linear infinite`,
  position: "absolute",
  "@media": {
    "(prefers-reduced-motion: reduce)": { animation: "none" },
  },
});
