import { breakpoints } from "@flux-ui/tokens";
import { style } from "@vanilla-extract/css";
import { responsiveStyle } from "../../internal/responsive.css.js";

type BreakpointKey = "s" | "m" | "l" | "x" | "2";
type ResponsiveVarKey = "b" | BreakpointKey;

const gapBase = "var(--f-g-b, 0)";

function responsiveVar(
  prefix: string,
  key: ResponsiveVarKey,
  fallback: string,
): string {
  return `var(--${prefix}-${key}, ${fallback})`;
}

function axisGap(axis: "r" | "c", key?: BreakpointKey): string {
  const suffix = key ?? "b";
  const inherited =
    key === undefined ? gapBase : responsiveVar("f-g", key, "0");
  return responsiveVar(`f-${axis}`, suffix, inherited);
}

function templateRows(key: BreakpointKey): string {
  return responsiveVar("f-t", key, "none");
}
function templateColumns(key: BreakpointKey): string {
  return responsiveVar("f-k", key, "minmax(0, 1fr)");
}

function itemPlacement(axis: "i" | "j", key: BreakpointKey): string {
  return responsiveVar(`f-${axis}`, key, "auto");
}

export const grid = style(
  responsiveStyle({
    display: "grid",
    minInlineSize: 0,
    boxSizing: "border-box",
    gridTemplateColumns: "var(--f-k-b, minmax(0, 1fr))",
    gridTemplateRows: "var(--f-t-b, none)",
    rowGap: axisGap("r"),
    columnGap: axisGap("c"),
    selectors: {
      "&[hidden]:not([hidden='until-found' i])": {
        display: "none !important",
      },
    },
    "@media": {
      [`(min-width: ${breakpoints.sm})`]: {
        gridTemplateColumns: templateColumns("s"),
        gridTemplateRows: templateRows("s"),
        rowGap: axisGap("r", "s"),
        columnGap: axisGap("c", "s"),
      },
      [`(min-width: ${breakpoints.md})`]: {
        gridTemplateColumns: templateColumns("m"),
        gridTemplateRows: templateRows("m"),
        rowGap: axisGap("r", "m"),
        columnGap: axisGap("c", "m"),
      },
      [`(min-width: ${breakpoints.lg})`]: {
        gridTemplateColumns: templateColumns("l"),
        gridTemplateRows: templateRows("l"),
        rowGap: axisGap("r", "l"),
        columnGap: axisGap("c", "l"),
      },
      [`(min-width: ${breakpoints.xl})`]: {
        gridTemplateColumns: templateColumns("x"),
        gridTemplateRows: templateRows("x"),
        rowGap: axisGap("r", "x"),
        columnGap: axisGap("c", "x"),
      },
      [`(min-width: ${breakpoints["2xl"]})`]: {
        gridTemplateColumns: templateColumns("2"),
        gridTemplateRows: templateRows("2"),
        rowGap: axisGap("r", "2"),
        columnGap: axisGap("c", "2"),
      },
    },
  }),
);

export const item = style(
  responsiveStyle({
    minInlineSize: 0,
    gridColumn: "var(--f-i-b, auto)",
    gridRow: "var(--f-j-b, auto)",
    "@media": {
      [`(min-width: ${breakpoints.sm})`]: {
        gridColumn: itemPlacement("i", "s"),
        gridRow: itemPlacement("j", "s"),
      },
      [`(min-width: ${breakpoints.md})`]: {
        gridColumn: itemPlacement("i", "m"),
        gridRow: itemPlacement("j", "m"),
      },
      [`(min-width: ${breakpoints.lg})`]: {
        gridColumn: itemPlacement("i", "l"),
        gridRow: itemPlacement("j", "l"),
      },
      [`(min-width: ${breakpoints.xl})`]: {
        gridColumn: itemPlacement("i", "x"),
        gridRow: itemPlacement("j", "x"),
      },
      [`(min-width: ${breakpoints["2xl"]})`]: {
        gridColumn: itemPlacement("i", "2"),
        gridRow: itemPlacement("j", "2"),
      },
    },
  }),
);

export const subgridColumns = style(
  responsiveStyle({ display: "grid", gridTemplateColumns: "subgrid" }),
);

export const subgridRows = style(
  responsiveStyle({ display: "grid", gridTemplateRows: "subgrid" }),
);
