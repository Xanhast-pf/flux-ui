import { createElement } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { surfaceStyle } from "../../internal/surface.js";
import { card } from "./Card.css.js";
import type { CardProps } from "./Card.types.js";

export function Card({
  as = "div",
  padding,
  surface = "default",
  border = "all",
  radius = "lg",
  paddingBlock,
  paddingInline,
  className,
  style,
  ...props
}: CardProps) {
  return createElement(as, {
    ...props,
    className: joinClassNames(card, className),
    "data-fs": surface,
    "data-fb": border,
    "data-fr": radius,
    style: surfaceStyle(padding, paddingBlock, paddingInline, style),
  });
}
