import { breakpoints } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";
import { responsiveStyle } from "./responsive.css.js";

// Stack and Inline share one responsive gap rule set and one local reset chain.
export const flexLayout = style(
  responsiveStyle({
    display: "flex",
    minInlineSize: 0,
    boxSizing: "border-box",
    gap: "var(--f-l-b, 0)",
    selectors: {
      "&[hidden]:not([hidden='until-found' i])": {
        display: "none !important",
      },
    },
    "@media": {
      [`(min-width: ${breakpoints.sm})`]: { gap: "var(--f-l-s, 0)" },
      [`(min-width: ${breakpoints.md})`]: { gap: "var(--f-l-m, 0)" },
      [`(min-width: ${breakpoints.lg})`]: { gap: "var(--f-l-l, 0)" },
      [`(min-width: ${breakpoints.xl})`]: { gap: "var(--f-l-x, 0)" },
      [`(min-width: ${breakpoints["2xl"]})`]: { gap: "var(--f-l-2, 0)" },
    },
  }),
);
