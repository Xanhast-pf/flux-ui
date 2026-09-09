import { breakpoints } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";

export const stack = style({
  display: "flex",
  flexDirection: "column",
  minInlineSize: 0,
  alignItems: "var(--flux-stack-align, stretch)",
  gap: "var(--flux-stack-gap-base, 0)",
  "@media": {
    [`(min-width: ${breakpoints.sm})`]: {
      gap: "var(--flux-stack-gap-sm, var(--flux-stack-gap-base, 0))",
    },
    [`(min-width: ${breakpoints.md})`]: {
      gap: "var(--flux-stack-gap-md, var(--flux-stack-gap-sm, var(--flux-stack-gap-base, 0)))",
    },
    [`(min-width: ${breakpoints.lg})`]: {
      gap: "var(--flux-stack-gap-lg, var(--flux-stack-gap-md, var(--flux-stack-gap-sm, var(--flux-stack-gap-base, 0))))",
    },
    [`(min-width: ${breakpoints.xl})`]: {
      gap: "var(--flux-stack-gap-xl, var(--flux-stack-gap-lg, var(--flux-stack-gap-md, var(--flux-stack-gap-sm, var(--flux-stack-gap-base, 0)))))",
    },
    [`(min-width: ${breakpoints["2xl"]})`]: {
      gap: "var(--flux-stack-gap-2xl, var(--flux-stack-gap-xl, var(--flux-stack-gap-lg, var(--flux-stack-gap-md, var(--flux-stack-gap-sm, var(--flux-stack-gap-base, 0))))))",
    },
  },
});
