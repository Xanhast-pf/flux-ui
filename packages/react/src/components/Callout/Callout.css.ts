import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";
export const callout = style({
  padding: `var(${cssVars.space[4]})`,
  lineHeight: 1.6,
  borderInlineStart: `0.25rem solid var(${cssVars.color.borderStrong})`,
  borderRadius: `var(${cssVars.radius.md})`,
  background: `var(${cssVars.color.surfaceSubtle})`,
  color: `var(${cssVars.color.text})`,
  selectors: {
    "&[data-tone='accent']": {
      background: `var(${cssVars.color.accentSoft})`,
      borderInlineStartColor: `var(${cssVars.color.accent})`,
    },
    "&[data-tone='success']": {
      background: `var(${cssVars.color.successSoft})`,
      borderInlineStartColor: `var(${cssVars.color.success})`,
    },
    "&[data-tone='warning']": {
      background: `var(${cssVars.color.warningSoft})`,
      borderInlineStartColor: `var(${cssVars.color.warning})`,
    },
    "&[data-tone='danger']": {
      background: `var(${cssVars.color.dangerSoft})`,
      borderInlineStartColor: `var(${cssVars.color.danger})`,
    },
    "&[data-tone='info']": {
      background: `var(${cssVars.color.infoSoft})`,
      borderInlineStartColor: `var(${cssVars.color.info})`,
    },
  },
});
