import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";
export const switchControl = style({
  appearance: "none",
  boxSizing: "border-box",
  position: "relative",
  flexShrink: 0,
  inlineSize: "2.75rem",
  blockSize: "1.5rem",
  margin: 0,
  border: "none",
  borderRadius: "1rem",
  background: `var(${cssVars.color.borderStrong})`,
  verticalAlign: "middle",
  cursor: "pointer",
  selectors: {
    "&::before": {
      content: '""',
      position: "absolute",
      insetBlockStart: "0.25rem",
      insetInlineStart: "0.25rem",
      inlineSize: "1rem",
      blockSize: "1rem",
      borderRadius: "50%",
      background: `var(${cssVars.color.surface})`,
      transition: `transform var(${cssVars.motion.fast}) var(${cssVars.motion.easing})`,
    },
    "&:checked": { background: `var(${cssVars.color.accent})` },
    "&:checked::before": {
      transform: "translateX(1.25rem)",
      background: `var(${cssVars.color.accentForeground})`,
    },
    "&:dir(rtl):checked::before": { transform: "translateX(-1.25rem)" },
    "&:focus-visible": {
      outline: `0.125rem solid var(${cssVars.color.focus})`,
      outlineOffset: "0.25rem",
    },
    "&:disabled": { opacity: 0.62, cursor: "not-allowed" },
    "&[aria-invalid='true'], &[data-invalid='true'], &:user-invalid": {
      boxShadow: `0 0 0 0.125rem var(${cssVars.color.danger})`,
    },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      selectors: { "&::before": { transition: "none" } },
    },
    "(forced-colors: active)": {
      appearance: "auto",
      accentColor: "auto",
      boxShadow: "none",
      selectors: {
        "&::before": { display: "none" },
        "&:focus-visible": { outlineColor: "Highlight" },
      },
    },
  },
});
