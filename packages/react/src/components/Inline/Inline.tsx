import { createElement, type ReactElement } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { setResponsiveCssVariable } from "../../internal/responsiveValue.js";
import {
  gapToCssValue,
  setSpacing,
  type CSSVariableStyle,
} from "../../internal/spacing.js";
import { inline } from "./Inline.css.js";
import type { InlineProps } from "./Inline.types.js";

const justifyValues = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
} as const;

export function Inline({
  as = "div",
  responsiveTo,
  align,
  className,
  gap,
  justify,
  style,
  padding,
  paddingBlock,
  paddingInline,
  wrap,
  ...props
}: InlineProps): ReactElement {
  const cssVariables: CSSVariableStyle = {};
  setSpacing(cssVariables, padding, paddingBlock, paddingInline, style);
  setResponsiveCssVariable(cssVariables, "f-l", gap, gapToCssValue);
  if (align !== undefined) cssVariables.alignItems = align;
  if (justify !== undefined)
    cssVariables.justifyContent = justifyValues[justify];
  if (wrap !== undefined) cssVariables.flexWrap = wrap ? "wrap" : "nowrap";

  return createElement(as, {
    ...props,
    className: joinClassNames(inline, className),
    style: { ...cssVariables, ...style },
    "data-r": responsiveTo === "container" ? "container" : undefined,
  });
}
