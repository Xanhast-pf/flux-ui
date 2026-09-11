import { createElement } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { surfaceBase } from "../../internal/surface.css.js";
import { surfaceStyle } from "../../internal/surface.js";
import { themeScope } from "./ThemeScope.css.js";
import type { ThemeScopeProps } from "./ThemeScope.types.js";

export function ThemeScope({
  as = "div",
  theme,
  query = false,
  padding,
  surface,
  border,
  radius,
  paddingBlock,
  paddingInline,
  className,
  style,
  ...props
}: ThemeScopeProps) {
  return createElement(as, {
    ...props,
    "data-flux-theme": theme,
    "data-query": query || undefined,
    className: joinClassNames(surfaceBase, themeScope, className),
    "data-fs": surface,
    "data-fb": border,
    "data-fr": radius,
    style: surfaceStyle(padding, paddingBlock, paddingInline, style),
  });
}
