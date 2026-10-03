import type { ComponentPropsWithRef, ReactNode } from "react";

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
export type PaginationFirstProps = PaginationButtonProps;
export type PaginationLastProps = PaginationButtonProps;

export interface PaginationPageProps extends PaginationButtonProps {
  page: number;
}

export interface PaginationRangeProps {
  /** Pages shown on each side of the current page. */
  siblingCount?: number | undefined;
  /** Pages always shown at the start and end. */
  boundaryCount?: number | undefined;
  /** Localizes the accessible label for generated page buttons. */
  getPageLabel?: ((page: number) => string) | undefined;
  /** Visual omission marker. It remains decorative. */
  ellipsis?: ReactNode | undefined;
}

export type PaginationEllipsisProps = Omit<
  ComponentPropsWithRef<"span">,
  "aria-hidden"
>;
