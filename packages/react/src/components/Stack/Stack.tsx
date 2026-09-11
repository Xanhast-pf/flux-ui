import { createElement, type ReactElement } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { setResponsiveCssVariable } from "../../internal/responsiveValue.js";
import {
  gapToCssValue,
  setSpacing,
  type CSSVariableStyle,
} from "../../internal/spacing.js";
import { stack } from "./Stack.css.js";
import type { StackProps } from "./Stack.types.js";

export function Stack({
  as = "div",
  responsiveTo,
  align,
  className,
  gap,
  style,
  padding,
  paddingBlock,
  paddingInline,
  ...props
}: StackProps): ReactElement {
  const cssVariables: CSSVariableStyle = {};
  setSpacing(cssVariables, padding, paddingBlock, paddingInline, style);
  setResponsiveCssVariable(cssVariables, "f-l", gap, gapToCssValue);
  if (align !== undefined) cssVariables.alignItems = align;

  return createElement(as, {
    ...props,
    className: joinClassNames(stack, className),
    style: { ...cssVariables, ...style },
    "data-r": responsiveTo === "container" ? "container" : undefined,
  });
}
