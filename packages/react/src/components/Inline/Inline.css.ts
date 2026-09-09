import { breakpoints } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";

export const inline = style({
  display: "flex",
  flexDirection: "row",
  minInlineSize: 0,
  alignItems: "var(--flux-inline-align, center)",
  justifyContent: "var(--flux-inline-justify, flex-start)",
  flexWrap: "var(--flux-inline-wrap, nowrap)",
  gap: "var(--flux-inline-gap-base, 0)",
  "@media": {
    [`(min-width: ${breakpoints.sm})`]: {
      gap: "var(--flux-inline-gap-sm, var(--flux-inline-gap-base, 0))",
    },
    [`(min-width: ${breakpoints.md})`]: {
      gap: "var(--flux-inline-gap-md, var(--flux-inline-gap-sm, var(--flux-inline-gap-base, 0)))",
    },
    [`(min-width: ${breakpoints.lg})`]: {
      gap: "var(--flux-inline-gap-lg, var(--flux-inline-gap-md, var(--flux-inline-gap-sm, var(--flux-inline-gap-base, 0))))",
    },
    [`(min-width: ${breakpoints.xl})`]: {
      gap: "var(--flux-inline-gap-xl, var(--flux-inline-gap-lg, var(--flux-inline-gap-md, var(--flux-inline-gap-sm, var(--flux-inline-gap-base, 0)))))",
    },
    [`(min-width: ${breakpoints["2xl"]})`]: {
      gap: "var(--flux-inline-gap-2xl, var(--flux-inline-gap-xl, var(--flux-inline-gap-lg, var(--flux-inline-gap-md, var(--flux-inline-gap-sm, var(--flux-inline-gap-base, 0))))))",
    },
  },
});
