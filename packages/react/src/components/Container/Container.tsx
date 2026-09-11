import { createElement } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { container } from "./Container.css.js";
import type { ContainerProps } from "./Container.types.js";

export function Container({
  as = "div",
  query = false,
  className,
  size = "xl",
  ...props
}: ContainerProps) {
  return createElement(as, {
    ...props,
    className: joinClassNames(container, className),
    "data-query": query || undefined,
    "data-size": size === "xl" ? undefined : size,
  });
}
