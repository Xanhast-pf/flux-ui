import { cssVars } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";

export const container = style({
  inlineSize: "100%",
  minInlineSize: 0,
  maxInlineSize: "90rem",
  marginInline: "auto",
  paddingInline: `var(${cssVars.space[4]})`,
  selectors: {
    "&[data-query]": {
      containerType: "inline-size",
      containerName: "flux-layout",
    },
    "&[data-size='xs']": { maxInlineSize: "24rem" },
    "&[data-size='sm']": { maxInlineSize: "40rem" },
    "&[data-size='md']": { maxInlineSize: "56rem" },
    "&[data-size='lg']": { maxInlineSize: "72rem" },
    "&[data-size='full']": { maxInlineSize: "none" },
  },
});
