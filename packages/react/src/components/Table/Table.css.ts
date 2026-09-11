import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";

export const table = style({
  inlineSize: "100%",
  borderCollapse: "collapse",
  fontSize: "var(--flux-font-body-size)",
  selectors: {
    "&[data-d='compact']": {
      fontSize: "var(--flux-font-caption)",
    },
  },
  color: `var(${cssVars.color.text})`,
});

export const caption = style({
  textAlign: "start",
  paddingBlock: `var(${cssVars.space[3]})`,
  color: `var(${cssVars.color.textMuted})`,
  selectors: {
    "&[data-v]": {
      position: "absolute",
      inlineSize: "1px",
      blockSize: "1px",
      padding: 0,
      margin: "-1px",
      overflow: "hidden",
      clipPath: "inset(50%)",
      whiteSpace: "nowrap",
      border: 0,
    },
  },
});

export const row = style({
  borderBlockEnd: `0.0625rem solid var(${cssVars.color.border})`,
});

export const cell = style({
  textAlign: "start",
  verticalAlign: "top",
  padding: "var(--flux-space-3) var(--flux-space-4)",
  selectors: {
    [`${table}[data-d='compact'] &`]: {
      padding: "var(--flux-space-2) var(--flux-space-3)",
    },
  },
});
