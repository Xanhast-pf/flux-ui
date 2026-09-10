import { createContext, useContext, type MouseEvent } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { root, button, ellipsis } from "./Pagination.css.js";
import type {
  PaginationRootProps,
  PaginationButtonProps,
  PaginationPageProps,
  PaginationEllipsisProps,
} from "./Pagination.types.js";
type PageContext = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};
const PaginationContext = createContext<PageContext | null>(null);
function usePagination(): PageContext {
  const context = useContext(PaginationContext);
  if (context === null)
    throw new Error(
      "Pagination controls must be rendered inside Pagination.Root.",
    );
  return context;
}
function PaginationRoot({
  className,
  page,
  pageCount,
  onPageChange,
  "aria-label": label = "Pagination",
  ...props
}: PaginationRootProps) {
  if (
    !Number.isSafeInteger(pageCount) ||
    pageCount < 1 ||
    !Number.isSafeInteger(page) ||
    page < 1 ||
    page > pageCount
  ) {
    throw new RangeError(
      "Pagination requires integer pageCount >= 1 and 1 <= page <= pageCount.",
    );
  }
  return (
    <PaginationContext value={{ page, pageCount, onPageChange }}>
      <nav
        {...props}
        aria-label={label}
        className={joinClassNames(root, className)}
      />
    </PaginationContext>
  );
}
function PagingButton({
  target,
  current = false,
  className,
  disabled,
  onClick,
  type = "button",
  ...props
}: PaginationButtonProps & { target: number; current?: boolean }) {
  const context = usePagination();
  const unavailable = disabled || target < 1 || target > context.pageCount;
  function handleClick(event: MouseEvent<HTMLButtonElement>): void {
    onClick?.(event);
    if (!event.defaultPrevented && !unavailable && target !== context.page)
      context.onPageChange(target);
  }
  return (
    <button
      {...props}
      type={type}
      disabled={unavailable}
      className={joinClassNames(button, className)}
      aria-current={current ? "page" : undefined}
      onClick={handleClick}
    />
  );
}
function PaginationPrevious({
  children = "Previous",
  ...props
}: PaginationButtonProps) {
  const { page } = usePagination();
  return (
    <PagingButton {...props} target={page - 1}>
      {children}
    </PagingButton>
  );
}
function PaginationNext({
  children = "Next",
  ...props
}: PaginationButtonProps) {
  const { page } = usePagination();
  return (
    <PagingButton {...props} target={page + 1}>
      {children}
    </PagingButton>
  );
}
function PaginationPage({
  page,
  children = page,
  "aria-label": label = `Page ${page}`,
  ...props
}: PaginationPageProps) {
  const context = usePagination();
  if (!Number.isSafeInteger(page) || page < 1 || page > context.pageCount)
    throw new RangeError(
      "Pagination.Page.page must be within the root's page range.",
    );
  return (
    <PagingButton
      {...props}
      aria-label={label}
      target={page}
      current={page === context.page}
    >
      {children}
    </PagingButton>
  );
}
function PaginationEllipsis({
  children = "…",
  className,
  ...props
}: PaginationEllipsisProps) {
  return (
    <span
      {...props}
      aria-hidden="true"
      className={joinClassNames(ellipsis, className)}
    >
      {children}
    </span>
  );
}
export const Pagination = {
  Root: PaginationRoot,
  Previous: PaginationPrevious,
  Next: PaginationNext,
  Page: PaginationPage,
  Ellipsis: PaginationEllipsis,
} as const;
