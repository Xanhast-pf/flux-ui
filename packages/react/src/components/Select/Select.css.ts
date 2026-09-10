import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";
export const select = style({
  appearance: "auto",
  boxSizing: "border-box",
  inlineSize: "100%",
  minInlineSize: 0,
  minBlockSize: `var(${cssVars.control.md})`,
  border: `0.0625rem solid var(${cssVars.color.borderStrong})`,
  borderRadius: `var(${cssVars.radius.md})`,
  padding: `var(${cssVars.space[2]}) var(${cssVars.space[3]})`,
  background: `var(${cssVars.color.surface})`,
  color: `var(${cssVars.color.text})`,
  font: "inherit",
  selectors: {
    "&:focus-visible": {
      outline: `0.125rem solid var(${cssVars.color.focus})`,
      outlineOffset: "0.25rem",
    },
    "&:disabled": { opacity: 0.62, cursor: "not-allowed" },
    "&[aria-invalid='true'], &[data-invalid='true'], &:user-invalid": {
      borderColor: `var(${cssVars.color.danger})`,
    },
  },
});
