import type { ComponentPropsWithRef } from "react";
export type BreadcrumbsRootProps = ComponentPropsWithRef<"nav">;
export type BreadcrumbsListProps = ComponentPropsWithRef<"ol">;
export type BreadcrumbsItemProps = ComponentPropsWithRef<"li">;
export type BreadcrumbsLinkProps = ComponentPropsWithRef<"a"> & {
  href: string;
};
export type BreadcrumbsCurrentProps = Omit<
  ComponentPropsWithRef<"span">,
  "aria-current"
>;
