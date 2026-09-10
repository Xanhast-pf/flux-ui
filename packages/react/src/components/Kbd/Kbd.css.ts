import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";
export const kbd = style({
  display: "inline-block",
  paddingInline: `var(${cssVars.space[2]})`,
  border: `0.0625rem solid var(${cssVars.color.borderStrong})`,
  borderBlockEndWidth: "0.125rem",
  borderRadius: `var(${cssVars.radius.sm})`,
  background: `var(${cssVars.color.surfaceSubtle})`,
  color: `var(${cssVars.color.textMuted})`,
  fontFamily: "ui-monospace, monospace",
  fontSize: "0.75rem",
  lineHeight: 1.75,
  whiteSpace: "nowrap",
  verticalAlign: "baseline",
});
