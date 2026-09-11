import { createElement } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { headingAlign, headingBase, headingSize } from "./Heading.css.js";
import type { HeadingProps } from "./Heading.types.js";

export function Heading({
  level,
  size = "md",
  align,
  className,
  ...props
}: HeadingProps) {
  return createElement(`h${level}`, {
    ...props,
    className: joinClassNames(
      headingBase,
      headingSize[size],
      align === undefined ? undefined : headingAlign[align],
      className,
    ),
  });
}
