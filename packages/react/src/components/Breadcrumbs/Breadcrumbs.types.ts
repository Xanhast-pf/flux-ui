import type { ComponentPropsWithRef, ReactNode } from "react";

export type BreadcrumbsRootProps = ComponentPropsWithRef<"nav">;

export type BreadcrumbsListProps = ComponentPropsWithRef<"ol"> & {
  /** Maximum rendered trail items before middle items collapse behind a toggle. */
  maxItems?: number | undefined;
  /** Items kept visible at the start when collapsed. */
  itemsBeforeCollapse?: number | undefined;
  /** Items kept visible at the end when collapsed. */
  itemsAfterCollapse?: number | undefined;
  /** Initial disclosure state when collapsing is enabled. */
  defaultExpanded?: boolean | undefined;
  /** Accessible label for the collapsed disclosure control. */
  expandLabel?: string | undefined;
  /** Accessible label for the expanded disclosure control. */
  collapseLabel?: string | undefined;
};

export type BreadcrumbsItemProps = ComponentPropsWithRef<"li"> & {
  /** Decorative separator content rendered after this item. */
  separator?: ReactNode;
};

export type BreadcrumbsLinkProps = ComponentPropsWithRef<"a"> & {
  href: string;
};

export type BreadcrumbsCurrentProps = Omit<
  ComponentPropsWithRef<"span">,
  "aria-current"
>;
