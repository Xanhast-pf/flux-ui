import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";
import { actionButtonStyles } from "../../internal/actionButtonStyles.js";

const styles = actionButtonStyles();
export const iconButton = style([
  styles.button,
  {
    paddingInline: 0,
    flexShrink: 0,
    inlineSize: `var(${cssVars.control.md})`,
    selectors: {
      "&:where([data-size='sm'])": {
        paddingInline: 0,
        inlineSize: `var(${cssVars.control.sm})`,
      },
      "&:where([data-size='lg'])": {
        paddingInline: 0,
        inlineSize: `var(${cssVars.control.lg})`,
      },
    },
  },
]);
export const content = style(styles.content);
