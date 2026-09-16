import { style } from "@vanilla-extract/css";
export const knob = style({
  display: "inline-flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "var(--flux-space-2)",
  padding: "var(--flux-space-2)",
  color: "var(--flux-color-text)",
  touchAction: "none",
  userSelect: "none",
  cursor: "ns-resize",
  borderRadius: "var(--flux-radius-md)",
  selectors: {
    "&[hidden]:not([hidden='until-found' i])": { display: "none !important" },
    "&[data-size='sm']": { vars: { "--f-knob-size": "3rem" } },
    "&[data-size='lg']": { vars: { "--f-knob-size": "5rem" } },
    "&:focus-visible": { outline: "0.125rem solid var(--flux-color-focus)" },
    "&[aria-disabled='true']": { opacity: 0.5, cursor: "not-allowed" },
  },
});
export const dial = style({
  position: "relative",
  inlineSize: "var(--flux-knob-size, var(--f-knob-size, 4rem))",
  blockSize: "var(--flux-knob-size, var(--f-knob-size, 4rem))",
  borderRadius: "50%",
  background:
    "conic-gradient(from 225deg, var(--flux-color-accent) var(--f-knob-angle), var(--flux-color-border-strong) 0deg 270deg, transparent 0deg)",
  selectors: {
    "&::before": {
      content: '""',
      position: "absolute",
      inset: "12.5%",
      borderRadius: "50%",
      background: "var(--flux-color-surface)",
      border: "0.0625rem solid var(--flux-color-border)",
    },
  },
  "@media": {
    "(forced-colors: active)": { border: "0.125rem solid CanvasText" },
  },
});
export const indicator = style({
  position: "absolute",
  inset: "18.75%",
  transform: "rotate(calc(var(--f-knob-angle) - 135deg))",
  selectors: {
    "&::after": {
      content: '""',
      display: "block",
      inlineSize: "10%",
      blockSize: "30%",
      marginInline: "auto",
      background: "var(--flux-color-text)",
    },
  },
});
export const readout = style({
  fontSize: "var(--flux-font-caption)",
  fontVariantNumeric: "tabular-nums",
});
