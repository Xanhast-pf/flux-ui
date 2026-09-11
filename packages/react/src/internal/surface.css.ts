import { style } from "@vanilla-extract/css";

export const surfaceBase = style({
  selectors: {
    ":where(&)": {
      boxSizing: "border-box",
      minInlineSize: 0,
      margin: 0,
      padding: 0,
    },
    ":where(&[data-fs='transparent'])": { background: "transparent" },
    ":where(&[data-fs='canvas'])": {
      background: "var(--flux-color-canvas)",
    },
    ":where(&[data-fs='default'])": {
      background: "var(--flux-color-surface)",
    },
    ":where(&[data-fs='subtle'])": {
      background: "var(--flux-color-surface-subtle)",
    },
    ":where(&[data-fs='elevated'])": {
      background: "var(--flux-color-surface-elevated)",
    },
    ":where(&[data-fb='none'])": { border: 0 },
    ":where(&[data-fb='all'])": {
      border: "0.0625rem solid var(--flux-color-border)",
    },
    ":where(&[data-fb='block'])": {
      borderBlock: "0.0625rem solid var(--flux-color-border)",
    },
    ":where(&[data-fb='bottom'])": {
      borderBlockEnd: "0.0625rem solid var(--flux-color-border)",
    },
    ":where(&[data-fr='none'])": { borderRadius: 0 },
    ":where(&[data-fr='sm'])": {
      borderRadius: "var(--flux-radius-sm)",
    },
    ":where(&[data-fr='md'])": {
      borderRadius: "var(--flux-radius-md)",
    },
    ":where(&[data-fr='lg'])": {
      borderRadius: "var(--flux-radius-lg)",
    },
  },
});
