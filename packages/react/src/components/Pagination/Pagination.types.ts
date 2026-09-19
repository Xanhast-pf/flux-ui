import type { ComponentPropsWithRef } from "react";
export interface PaginationRootProps extends ComponentPropsWithRef<"nav"> {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}
export type PaginationButtonProps = Omit<
  ComponentPropsWithRef<"button">,
  "aria-current"
>;
export type PaginationPreviousProps = PaginationButtonProps;
export type PaginationNextProps = PaginationButtonProps;
export interface PaginationPageProps extends PaginationButtonProps {
  page: number;
}
export type PaginationEllipsisProps = Omit<
  ComponentPropsWithRef<"span">,
  "aria-hidden"
>;
