import type { ComponentPropsWithRef, ReactNode } from "react";
import type { AccessibleName } from "../../internal/accessibility.types.js";

export type BottomNavigationProps = Omit<
  ComponentPropsWithRef<"nav">,
  "aria-label" | "aria-labelledby"
> &
  AccessibleName;

export type BottomNavigationItemProps = Omit<
  ComponentPropsWithRef<"a">,
  "aria-current" | "children"
> & {
  href: string;
  children: ReactNode;
  /** Marks the link as the current application destination. */
  current?: boolean | undefined;
  /** Optional decorative icon shown above the destination label. */
  icon?: ReactNode | undefined;
};
