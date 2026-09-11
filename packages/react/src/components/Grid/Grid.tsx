import { createElement, type ReactElement } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { setResponsiveCssVariable } from "../../internal/responsiveValue.js";
import {
  gapToCssValue,
  setSpacing,
  type CSSVariableStyle,
} from "../../internal/spacing.js";
import { grid, item, subgridColumns, subgridRows } from "./Grid.css.js";
import type { GridItemProps, GridProps } from "./Grid.types.js";

export function Grid({
  as = "div",
  responsiveTo,
  align,
  autoRows,
  className,
  columnGap,
  columns,
  minColumnWidth,
  templateColumns,
  gap,
  justify,
  rowGap,
  style,
  padding,
  paddingBlock,
  paddingInline,
  templateRows,
  ...props
}: GridProps): ReactElement {
  const cssVariables: CSSVariableStyle = {};
  setSpacing(cssVariables, padding, paddingBlock, paddingInline, style);
  setResponsiveCssVariable(cssVariables, "f-g", gap, gapToCssValue);
  setResponsiveCssVariable(cssVariables, "f-r", rowGap, gapToCssValue);
  setResponsiveCssVariable(cssVariables, "f-c", columnGap, gapToCssValue);
  setResponsiveCssVariable(cssVariables, "f-t", templateRows, String);

  if (align !== undefined) cssVariables.alignItems = align;
  if (justify !== undefined) cssVariables.justifyItems = justify;
  if (autoRows !== undefined) cssVariables.gridAutoRows = autoRows;

  if (minColumnWidth !== undefined) {
    cssVariables["--f-k-b"] =
      `repeat(auto-fit, minmax(min(100%, ${minColumnWidth}), 1fr))`;
  } else if (templateColumns !== undefined) {
    setResponsiveCssVariable(cssVariables, "f-k", templateColumns, String);
  } else {
    setResponsiveCssVariable(
      cssVariables,
      "f-k",
      columns,
      (count) => `repeat(${count}, minmax(0, 1fr))`,
    );
  }

  return createElement(as, {
    ...props,
    className: joinClassNames(grid, className),
    style: { ...cssVariables, ...style },
    "data-r": responsiveTo === "container" ? "container" : undefined,
  });
}

export function GridItem({
  as = "div",
  responsiveTo,
  alignSelf,
  className,
  colSpan,
  justifySelf,
  rowSpan,
  style,
  subgrid,
  ...props
}: GridItemProps): ReactElement {
  const cssVariables: CSSVariableStyle = {};

  setResponsiveCssVariable(cssVariables, "f-i", colSpan, (span) =>
    span === "full" ? "1 / -1" : `span ${span} / span ${span}`,
  );
  setResponsiveCssVariable(
    cssVariables,
    "f-j",
    rowSpan,
    (span) => `span ${span} / span ${span}`,
  );

  if (alignSelf !== undefined) cssVariables.alignSelf = alignSelf;
  if (justifySelf !== undefined) cssVariables.justifySelf = justifySelf;

  return createElement(as, {
    ...props,
    className: joinClassNames(
      item,
      (subgrid === "columns" || subgrid === "both") && subgridColumns,
      (subgrid === "rows" || subgrid === "both") && subgridRows,
      className,
    ),
    style: { ...cssVariables, ...style },
    "data-r": responsiveTo === "container" ? "container" : undefined,
  });
}

Grid.Item = GridItem;
