import { createElement, type ReactElement } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { gapToCssValue } from "../../internal/spacing.js";
import { surfaceStyle } from "../../internal/surface.js";
import { box } from "./Box.css.js";
import type { BoxProps } from "./Box.types.js";

export function Box({
  as = "div",
  padding,
  surface,
  border,
  radius,
  paddingBlock,
  paddingInline,
  paddingBlockStart,
  paddingBlockEnd,
  paddingInlineStart,
  paddingInlineEnd,
  className,
  style,
  ...props
}: BoxProps): ReactElement {
  const resolvedStyle = surfaceStyle(
    padding,
    paddingBlock,
    paddingInline,
    style,
  );
  const edgeStyle = {
    paddingBlockStart:
      paddingBlockStart === undefined
        ? undefined
        : gapToCssValue(paddingBlockStart),
    paddingBlockEnd:
      paddingBlockEnd === undefined
        ? undefined
        : gapToCssValue(paddingBlockEnd),
    paddingInlineStart:
      paddingInlineStart === undefined
        ? undefined
        : gapToCssValue(paddingInlineStart),
    paddingInlineEnd:
      paddingInlineEnd === undefined
        ? undefined
        : gapToCssValue(paddingInlineEnd),
    ...resolvedStyle,
  };

  return createElement(as, {
    ...props,
    className: joinClassNames(box, className),
    "data-fs": surface,
    "data-fb": border,
    "data-fr": radius,
    style: edgeStyle,
  });
}
