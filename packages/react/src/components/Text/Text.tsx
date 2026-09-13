import { createElement, type ReactElement } from "react";
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
  italic,
  decoration,
  className,
  ...props
}: TextProps): ReactElement {
  return createElement(as, {
    ...props,
    "data-italic": italic || undefined,
    "data-decoration": decoration,
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
