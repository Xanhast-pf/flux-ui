import { joinClassNames } from "../../internal/joinClassNames.js";
import {
  gapToCssValue,
  setResponsiveCssVariable,
  type CSSVariableStyle,
} from "../../internal/layout.js";
import { stack } from "./Stack.css.js";
import type { StackProps } from "./Stack.types.js";

export function Stack({ align, className, gap, style, ...props }: StackProps) {
  const cssVariables: CSSVariableStyle = { ...style };
  setResponsiveCssVariable(cssVariables, "flux-stack-gap", gap, gapToCssValue);
  if (align !== undefined) cssVariables["--flux-stack-align"] = align;

  return (
    <div
      {...props}
      className={joinClassNames(stack, className)}
      style={cssVariables}
    />
  );
}
