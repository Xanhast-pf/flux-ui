import { createElement } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import {
  gapToCssValue,
  type CSSVariableStyle,
} from "../../internal/spacing.js";
import { item, list } from "./List.css.js";
import type { ListItemProps, ListProps } from "./List.types.js";
export function List({
  as = "ul",
  gap = "sm",
  variant = "marker",
  className,
  style,
  role,
  ...props
}: ListProps) {
  const variables: CSSVariableStyle = {
    "--flux-list-gap": gapToCssValue(gap),
    ...style,
  };
  return createElement(as, {
    ...props,
    role: role ?? (variant === "plain" ? "list" : undefined),
    className: joinClassNames(list, className),
    style: variables,
    "data-variant": variant,
  });
}
function ListItem({ className, ...props }: ListItemProps) {
  return <li {...props} className={joinClassNames(item, className)} />;
}
List.Item = ListItem;
