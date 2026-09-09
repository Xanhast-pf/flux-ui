import { breakpoints } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";

const gapBase = "var(--flux-grid-gap-base, 0)";
const rowGapBase = `var(--flux-grid-row-gap-base, ${gapBase})`;
const columnGapBase = `var(--flux-grid-column-gap-base, ${gapBase})`;

function inheritedVar(prefix: string, key: string, previous: string): string {
  return `var(--${prefix}-${key}, ${previous})`;
}

const gapSm = inheritedVar("flux-grid-gap", "sm", gapBase);
const gapMd = inheritedVar("flux-grid-gap", "md", gapSm);
const gapLg = inheritedVar("flux-grid-gap", "lg", gapMd);
const gapXl = inheritedVar("flux-grid-gap", "xl", gapLg);
const gap2xl = inheritedVar("flux-grid-gap", "2xl", gapXl);

const rowGapSm = `var(--flux-grid-row-gap-sm, var(--flux-grid-row-gap-base, ${gapSm}))`;
const rowGapMd = `var(--flux-grid-row-gap-md, var(--flux-grid-row-gap-sm, var(--flux-grid-row-gap-base, ${gapMd})))`;
const rowGapLg = `var(--flux-grid-row-gap-lg, var(--flux-grid-row-gap-md, var(--flux-grid-row-gap-sm, var(--flux-grid-row-gap-base, ${gapLg}))))`;
const rowGapXl = `var(--flux-grid-row-gap-xl, var(--flux-grid-row-gap-lg, var(--flux-grid-row-gap-md, var(--flux-grid-row-gap-sm, var(--flux-grid-row-gap-base, ${gapXl})))))`;
const rowGap2xl = `var(--flux-grid-row-gap-2xl, var(--flux-grid-row-gap-xl, var(--flux-grid-row-gap-lg, var(--flux-grid-row-gap-md, var(--flux-grid-row-gap-sm, var(--flux-grid-row-gap-base, ${gap2xl}))))))`;

const columnGapSm = `var(--flux-grid-column-gap-sm, var(--flux-grid-column-gap-base, ${gapSm}))`;
const columnGapMd = `var(--flux-grid-column-gap-md, var(--flux-grid-column-gap-sm, var(--flux-grid-column-gap-base, ${gapMd})))`;
const columnGapLg = `var(--flux-grid-column-gap-lg, var(--flux-grid-column-gap-md, var(--flux-grid-column-gap-sm, var(--flux-grid-column-gap-base, ${gapLg}))))`;
const columnGapXl = `var(--flux-grid-column-gap-xl, var(--flux-grid-column-gap-lg, var(--flux-grid-column-gap-md, var(--flux-grid-column-gap-sm, var(--flux-grid-column-gap-base, ${gapXl})))))`;
const columnGap2xl = `var(--flux-grid-column-gap-2xl, var(--flux-grid-column-gap-xl, var(--flux-grid-column-gap-lg, var(--flux-grid-column-gap-md, var(--flux-grid-column-gap-sm, var(--flux-grid-column-gap-base, ${gap2xl}))))))`;

export const grid = style({
  display: "grid",
  minInlineSize: 0,
  alignItems: "var(--flux-grid-align, stretch)",
  justifyItems: "var(--flux-grid-justify, stretch)",
  gridAutoRows: "var(--flux-grid-auto-rows, auto)",
  gridTemplateRows: "var(--flux-grid-template-rows-base, none)",
  rowGap: rowGapBase,
  columnGap: columnGapBase,
  "@media": {
    [`(min-width: ${breakpoints.sm})`]: {
      gridTemplateRows:
        "var(--flux-grid-template-rows-sm, var(--flux-grid-template-rows-base, none))",
      rowGap: rowGapSm,
      columnGap: columnGapSm,
    },
    [`(min-width: ${breakpoints.md})`]: {
      gridTemplateRows:
        "var(--flux-grid-template-rows-md, var(--flux-grid-template-rows-sm, var(--flux-grid-template-rows-base, none)))",
      rowGap: rowGapMd,
      columnGap: columnGapMd,
    },
    [`(min-width: ${breakpoints.lg})`]: {
      gridTemplateRows:
        "var(--flux-grid-template-rows-lg, var(--flux-grid-template-rows-md, var(--flux-grid-template-rows-sm, var(--flux-grid-template-rows-base, none))))",
      rowGap: rowGapLg,
      columnGap: columnGapLg,
    },
    [`(min-width: ${breakpoints.xl})`]: {
      gridTemplateRows:
        "var(--flux-grid-template-rows-xl, var(--flux-grid-template-rows-lg, var(--flux-grid-template-rows-md, var(--flux-grid-template-rows-sm, var(--flux-grid-template-rows-base, none)))))",
      rowGap: rowGapXl,
      columnGap: columnGapXl,
    },
    [`(min-width: ${breakpoints["2xl"]})`]: {
      gridTemplateRows:
        "var(--flux-grid-template-rows-2xl, var(--flux-grid-template-rows-xl, var(--flux-grid-template-rows-lg, var(--flux-grid-template-rows-md, var(--flux-grid-template-rows-sm, var(--flux-grid-template-rows-base, none))))))",
      rowGap: rowGap2xl,
      columnGap: columnGap2xl,
    },
  },
});

export const countMode = style({
  gridTemplateColumns:
    "repeat(var(--flux-grid-columns-base, 1), minmax(0, 1fr))",
  "@media": {
    [`(min-width: ${breakpoints.sm})`]: {
      gridTemplateColumns:
        "repeat(var(--flux-grid-columns-sm, var(--flux-grid-columns-base, 1)), minmax(0, 1fr))",
    },
    [`(min-width: ${breakpoints.md})`]: {
      gridTemplateColumns:
        "repeat(var(--flux-grid-columns-md, var(--flux-grid-columns-sm, var(--flux-grid-columns-base, 1))), minmax(0, 1fr))",
    },
    [`(min-width: ${breakpoints.lg})`]: {
      gridTemplateColumns:
        "repeat(var(--flux-grid-columns-lg, var(--flux-grid-columns-md, var(--flux-grid-columns-sm, var(--flux-grid-columns-base, 1)))), minmax(0, 1fr))",
    },
    [`(min-width: ${breakpoints.xl})`]: {
      gridTemplateColumns:
        "repeat(var(--flux-grid-columns-xl, var(--flux-grid-columns-lg, var(--flux-grid-columns-md, var(--flux-grid-columns-sm, var(--flux-grid-columns-base, 1))))), minmax(0, 1fr))",
    },
    [`(min-width: ${breakpoints["2xl"]})`]: {
      gridTemplateColumns:
        "repeat(var(--flux-grid-columns-2xl, var(--flux-grid-columns-xl, var(--flux-grid-columns-lg, var(--flux-grid-columns-md, var(--flux-grid-columns-sm, var(--flux-grid-columns-base, 1)))))), minmax(0, 1fr))",
    },
  },
});

export const autoFitMode = style({
  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(100%, var(--flux-grid-min-column)), 1fr))",
});

export const templateMode = style({
  gridTemplateColumns: "var(--flux-grid-template-columns-base)",
  "@media": {
    [`(min-width: ${breakpoints.sm})`]: {
      gridTemplateColumns:
        "var(--flux-grid-template-columns-sm, var(--flux-grid-template-columns-base))",
    },
    [`(min-width: ${breakpoints.md})`]: {
      gridTemplateColumns:
        "var(--flux-grid-template-columns-md, var(--flux-grid-template-columns-sm, var(--flux-grid-template-columns-base)))",
    },
    [`(min-width: ${breakpoints.lg})`]: {
      gridTemplateColumns:
        "var(--flux-grid-template-columns-lg, var(--flux-grid-template-columns-md, var(--flux-grid-template-columns-sm, var(--flux-grid-template-columns-base))))",
    },
    [`(min-width: ${breakpoints.xl})`]: {
      gridTemplateColumns:
        "var(--flux-grid-template-columns-xl, var(--flux-grid-template-columns-lg, var(--flux-grid-template-columns-md, var(--flux-grid-template-columns-sm, var(--flux-grid-template-columns-base)))))",
    },
    [`(min-width: ${breakpoints["2xl"]})`]: {
      gridTemplateColumns:
        "var(--flux-grid-template-columns-2xl, var(--flux-grid-template-columns-xl, var(--flux-grid-template-columns-lg, var(--flux-grid-template-columns-md, var(--flux-grid-template-columns-sm, var(--flux-grid-template-columns-base))))))",
    },
  },
});

export const item = style({
  minInlineSize: 0,
  gridColumn: "var(--flux-grid-item-column-base, auto)",
  gridRow: "var(--flux-grid-item-row-base, auto)",
  "@media": {
    [`(min-width: ${breakpoints.sm})`]: {
      gridColumn:
        "var(--flux-grid-item-column-sm, var(--flux-grid-item-column-base, auto))",
      gridRow:
        "var(--flux-grid-item-row-sm, var(--flux-grid-item-row-base, auto))",
    },
    [`(min-width: ${breakpoints.md})`]: {
      gridColumn:
        "var(--flux-grid-item-column-md, var(--flux-grid-item-column-sm, var(--flux-grid-item-column-base, auto)))",
      gridRow:
        "var(--flux-grid-item-row-md, var(--flux-grid-item-row-sm, var(--flux-grid-item-row-base, auto)))",
    },
    [`(min-width: ${breakpoints.lg})`]: {
      gridColumn:
        "var(--flux-grid-item-column-lg, var(--flux-grid-item-column-md, var(--flux-grid-item-column-sm, var(--flux-grid-item-column-base, auto))))",
      gridRow:
        "var(--flux-grid-item-row-lg, var(--flux-grid-item-row-md, var(--flux-grid-item-row-sm, var(--flux-grid-item-row-base, auto))))",
    },
    [`(min-width: ${breakpoints.xl})`]: {
      gridColumn:
        "var(--flux-grid-item-column-xl, var(--flux-grid-item-column-lg, var(--flux-grid-item-column-md, var(--flux-grid-item-column-sm, var(--flux-grid-item-column-base, auto)))))",
      gridRow:
        "var(--flux-grid-item-row-xl, var(--flux-grid-item-row-lg, var(--flux-grid-item-row-md, var(--flux-grid-item-row-sm, var(--flux-grid-item-row-base, auto)))))",
    },
    [`(min-width: ${breakpoints["2xl"]})`]: {
      gridColumn:
        "var(--flux-grid-item-column-2xl, var(--flux-grid-item-column-xl, var(--flux-grid-item-column-lg, var(--flux-grid-item-column-md, var(--flux-grid-item-column-sm, var(--flux-grid-item-column-base, auto))))))",
      gridRow:
        "var(--flux-grid-item-row-2xl, var(--flux-grid-item-row-xl, var(--flux-grid-item-row-lg, var(--flux-grid-item-row-md, var(--flux-grid-item-row-sm, var(--flux-grid-item-row-base, auto))))))",
    },
  },
});

export const subgridColumns = style({
  display: "grid",
  gridTemplateColumns: "subgrid",
});

export const subgridRows = style({
  display: "grid",
  gridTemplateRows: "subgrid",
});
