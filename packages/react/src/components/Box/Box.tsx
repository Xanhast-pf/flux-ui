import { createElement, type ReactElement } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { gapToCssValue, type LayoutGap } from "../../internal/spacing.js";
import { box } from "./Box.css.js";
import type { BoxProps } from "./Box.types.js";

function paddingValue(value: LayoutGap | undefined): string | undefined {
  return value === undefined ? undefined : gapToCssValue(value);
}

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
  const blockOverride =
    style?.padding !== undefined || style?.paddingBlock !== undefined;
  const inlineOverride =
    style?.padding !== undefined || style?.paddingInline !== undefined;
  // Resolve prop shorthands to logical edges. Mixing React style shorthands
  // and longhands can overwrite unchanged edges during incremental updates.
  const edgeStyle = {
    paddingBlockStart: blockOverride
      ? undefined
      : paddingValue(paddingBlockStart ?? paddingBlock ?? padding),
    paddingBlockEnd: blockOverride
      ? undefined
      : paddingValue(paddingBlockEnd ?? paddingBlock ?? padding),
    paddingInlineStart: inlineOverride
      ? undefined
      : paddingValue(paddingInlineStart ?? paddingInline ?? padding),
    paddingInlineEnd: inlineOverride
      ? undefined
      : paddingValue(paddingInlineEnd ?? paddingInline ?? padding),
    ...style,
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
