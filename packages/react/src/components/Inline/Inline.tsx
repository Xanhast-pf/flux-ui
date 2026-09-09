import { joinClassNames } from "../../internal/joinClassNames.js";
import {
  gapToCssValue,
  setResponsiveCssVariable,
  type CSSVariableStyle,
} from "../../internal/layout.js";
import { inline } from "./Inline.css.js";
import type { InlineProps } from "./Inline.types.js";

const justifyValues = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
} as const;

export function Inline({
  align,
  className,
  gap,
  justify,
  style,
  wrap,
  ...props
}: InlineProps) {
  const cssVariables: CSSVariableStyle = { ...style };
  setResponsiveCssVariable(cssVariables, "flux-inline-gap", gap, gapToCssValue);
  if (align !== undefined) cssVariables["--flux-inline-align"] = align;
  if (justify !== undefined) {
    cssVariables["--flux-inline-justify"] = justifyValues[justify];
  }
  if (wrap !== undefined)
    cssVariables["--flux-inline-wrap"] = wrap ? "wrap" : "nowrap";

  return (
    <div
      {...props}
      className={joinClassNames(inline, className)}
      style={cssVariables}
    />
  );
}
