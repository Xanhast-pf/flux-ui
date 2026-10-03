import { joinClassNames } from "../../internal/joinClassNames.js";
import {
  icon as iconClass,
  item,
  label,
  root,
} from "./BottomNavigation.css.js";
import type {
  BottomNavigationItemProps,
  BottomNavigationProps,
} from "./BottomNavigation.types.js";

/**
 * Compact destination navigation for application shells. Positioning remains
 * application-owned; BottomNavigation only provides the semantic surface.
 */
export function BottomNavigation({
  className,
  ...props
}: BottomNavigationProps) {
  return <nav {...props} className={joinClassNames(root, className)} />;
}

function BottomNavigationItem({
  children,
  className,
  current = false,
  icon,
  ...props
}: BottomNavigationItemProps) {
  return (
    <a
      {...props}
      aria-current={current ? "page" : undefined}
      className={joinClassNames(item, className)}
    >
      {icon === undefined ? null : (
        <span aria-hidden="true" className={iconClass}>
          {icon}
        </span>
      )}
      <span className={label}>{children}</span>
    </a>
  );
}

BottomNavigation.Item = BottomNavigationItem;
