import { joinClassNames } from "../../internal/joinClassNames.js";
import {
  gapToCssValue,
  setResponsiveCssVariable,
  type CSSVariableStyle,
} from "../../internal/layout.js";
import {
  autoFitMode,
  countMode,
  grid,
  item,
  subgridColumns,
  subgridRows,
  templateMode,
} from "./Grid.css.js";
import type { GridItemProps, GridProps } from "./Grid.types.js";

export function Grid({
  align,
  autoRows,
  className,
  columnGap,
  gap,
  justify,
  rowGap,
  style,
  templateRows,
  ...props
}: GridProps) {
  const cssVariables: CSSVariableStyle = { ...style };

  setResponsiveCssVariable(cssVariables, "flux-grid-gap", gap, gapToCssValue);
  setResponsiveCssVariable(
    cssVariables,
    "flux-grid-row-gap",
    rowGap,
    gapToCssValue,
  );
  setResponsiveCssVariable(
    cssVariables,
    "flux-grid-column-gap",
    columnGap,
    gapToCssValue,
  );
  setResponsiveCssVariable(
    cssVariables,
    "flux-grid-template-rows",
    templateRows,
    String,
  );

  if (align !== undefined) cssVariables["--flux-grid-align"] = align;
  if (justify !== undefined) cssVariables["--flux-grid-justify"] = justify;
  if (autoRows !== undefined) cssVariables["--flux-grid-auto-rows"] = autoRows;

  if ("minColumnWidth" in props && props.minColumnWidth !== undefined) {
    cssVariables["--flux-grid-min-column"] = props.minColumnWidth;
    const { minColumnWidth: _minColumnWidth, ...divProps } = props;
    return (
      <div
        {...divProps}
        className={joinClassNames(grid, autoFitMode, className)}
        style={cssVariables}
      />
    );
  }

  if ("templateColumns" in props && props.templateColumns !== undefined) {
    setResponsiveCssVariable(
      cssVariables,
      "flux-grid-template-columns",
      props.templateColumns,
      String,
    );
    const { templateColumns: _templateColumns, ...divProps } = props;
    return (
      <div
        {...divProps}
        className={joinClassNames(grid, templateMode, className)}
        style={cssVariables}
      />
    );
  }

  const columns = "columns" in props ? props.columns : undefined;
  setResponsiveCssVariable(cssVariables, "flux-grid-columns", columns, String);
  const { columns: _columns, ...divProps } = props;

  return (
    <div
      {...divProps}
      className={joinClassNames(grid, countMode, className)}
      style={cssVariables}
    />
  );
}

export function GridItem({
  alignSelf,
  className,
  colSpan,
  justifySelf,
  rowSpan,
  style,
  subgrid,
  ...props
}: GridItemProps) {
  const cssVariables: CSSVariableStyle = { ...style };

  setResponsiveCssVariable(
    cssVariables,
    "flux-grid-item-column",
    colSpan,
    (span) => (span === "full" ? "1 / -1" : `span ${span} / span ${span}`),
  );
  setResponsiveCssVariable(
    cssVariables,
    "flux-grid-item-row",
    rowSpan,
    (span) => `span ${span} / span ${span}`,
  );

  if (alignSelf !== undefined) cssVariables.alignSelf = alignSelf;
  if (justifySelf !== undefined) cssVariables.justifySelf = justifySelf;

  return (
    <div
      {...props}
      className={joinClassNames(
        item,
        (subgrid === "columns" || subgrid === "both") && subgridColumns,
        (subgrid === "rows" || subgrid === "both") && subgridRows,
        className,
      )}
      style={cssVariables}
    />
  );
}

Grid.Item = GridItem;
