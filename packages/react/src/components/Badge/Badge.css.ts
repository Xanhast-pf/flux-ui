import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";
export const badge = style({
  display: "inline-flex",
  alignItems: "center",
  gap: `var(${cssVars.space[1]})`,
  padding: `var(${cssVars.space[1]}) var(${cssVars.space[2]})`,
  fontSize: "0.75rem",
  fontWeight: 600,
  lineHeight: 1.5,
  verticalAlign: "middle",
  borderRadius: `var(${cssVars.radius.md})`,
  background: `var(${cssVars.color.surfaceSubtle})`,
  color: `var(${cssVars.color.text})`,
  selectors: {
    "&[data-tone='accent']": { background: `var(${cssVars.color.accentSoft})` },
    "&[data-tone='success']": {
      background: `var(${cssVars.color.successSoft})`,
    },
    "&[data-tone='warning']": {
      background: `var(${cssVars.color.warningSoft})`,
    },
    "&[data-tone='danger']": { background: `var(${cssVars.color.dangerSoft})` },
    "&[data-tone='info']": { background: `var(${cssVars.color.infoSoft})` },
  },
});
