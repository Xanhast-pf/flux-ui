import type { ComponentPropsWithRef, ReactNode } from "react";

export type BreadcrumbsRootProps = ComponentPropsWithRef<"nav">;
export type BreadcrumbsListProps = ComponentPropsWithRef<"ol">;
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
