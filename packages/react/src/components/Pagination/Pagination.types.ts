import type { ComponentPropsWithRef } from "react";
export interface PaginationRootProps extends ComponentPropsWithRef<"nav"> {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}
export type PaginationButtonProps = ComponentPropsWithRef<"button">;
export interface PaginationPageProps extends Omit<
  PaginationButtonProps,
  "aria-current"
> {
  page: number;
}
export type PaginationEllipsisProps = Omit<
  ComponentPropsWithRef<"span">,
  "aria-hidden"
>;
