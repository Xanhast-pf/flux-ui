import { style } from "@vanilla-extract/css";
export const themeScope = style({
  fontFamily: "var(--flux-font-body)",
  color: "var(--flux-color-text)",
  selectors: {
    "&[data-query]": {
      containerType: "inline-size",
      containerName: "flux-layout",
    },
  },
});
