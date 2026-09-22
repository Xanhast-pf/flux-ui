import { style } from "@vanilla-extract/css";
import { actionButtonStyles } from "../../internal/actionButtonStyles.js";

const styles = actionButtonStyles();

export const button = style(styles.button);
export const content = style(styles.content);
