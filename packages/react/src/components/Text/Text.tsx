import { createElement } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import {
  textAlign,
  textBase,
  textNumeric,
  textTone,
  textVariant,
  textWeight,
} from "./Text.css.js";
import type { TextProps } from "./Text.types.js";

export function Text({
  as = "span",
  variant,
  tone,
  weight,
  align,
  numeric,
  className,
  ...props
}: TextProps) {
  return createElement(as, {
    ...props,
    className: joinClassNames(
      textBase,
      variant === undefined ? undefined : textVariant[variant],
      tone === undefined ? undefined : textTone[tone],
      weight === undefined ? undefined : textWeight[weight],
      align === undefined ? undefined : textAlign[align],
      numeric ? textNumeric : undefined,
      className,
    ),
  });
}
