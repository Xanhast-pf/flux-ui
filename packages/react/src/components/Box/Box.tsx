import { createElement } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
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
  className,
  style,
  ...props
}: BoxProps) {
  return createElement(as, {
    ...props,
    className: joinClassNames(box, className),
    "data-fs": surface,
    "data-fb": border,
    "data-fr": radius,
    style: surfaceStyle(padding, paddingBlock, paddingInline, style),
  });
}
