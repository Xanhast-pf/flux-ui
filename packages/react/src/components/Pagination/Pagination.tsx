import { Fragment, createContext, useContext, type MouseEvent } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { root, button, ellipsis } from "./Pagination.css.js";
import type {
  PaginationRootProps,
  PaginationButtonProps,
  PaginationPageProps,
  PaginationRangeProps,
  PaginationEllipsisProps,
} from "./Pagination.types.js";

type PageContext = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

type RangeItem = number | { key: string };

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

function PaginationFirst({
  children = "First",
  disabled,
  ...props
}: PaginationButtonProps) {
  const { page } = usePagination();
  return (
    <PagingButton {...props} disabled={disabled || page === 1} target={1}>
      {children}
    </PagingButton>
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

function PaginationLast({
  children = "Last",
  disabled,
  ...props
}: PaginationButtonProps) {
  const { page, pageCount } = usePagination();
  return (
    <PagingButton
      {...props}
      disabled={disabled || page === pageCount}
      target={pageCount}
    >
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

function rangeItems(
  page: number,
  pageCount: number,
  boundaryCount: number,
  siblingCount: number,
): RangeItem[] {
  const visible = new Set<number>();
  for (let index = 1; index <= Math.min(boundaryCount, pageCount); index++)
    visible.add(index);
  for (
    let index = Math.max(1, pageCount - boundaryCount + 1);
    index <= pageCount;
    index++
  )
    visible.add(index);
  for (
    let index = Math.max(1, page - siblingCount);
    index <= Math.min(pageCount, page + siblingCount);
    index++
  )
    visible.add(index);

  const pages = [...visible].sort((left, right) => left - right);
  const items: RangeItem[] = [];
  let previous = 0;
  for (const value of pages) {
    const gap = value - previous;
    if (previous > 0 && gap === 2) items.push(previous + 1);
    else if (previous > 0 && gap > 2)
      items.push({ key: `ellipsis-${previous}-${value}` });
    items.push(value);
    previous = value;
  }
  return items;
}

function PaginationRange({
  siblingCount = 1,
  boundaryCount = 1,
  getPageLabel,
  ellipsis: ellipsisContent,
}: PaginationRangeProps) {
  const { page, pageCount } = usePagination();
  if (
    !Number.isSafeInteger(siblingCount) ||
    siblingCount < 0 ||
    !Number.isSafeInteger(boundaryCount) ||
    boundaryCount < 1
  )
    throw new RangeError(
      "Pagination.Range requires siblingCount >= 0 and boundaryCount >= 1.",
    );

  return (
    <Fragment>
      {rangeItems(page, pageCount, boundaryCount, siblingCount).map((item) =>
        typeof item === "number" ? (
          <PaginationPage
            key={item}
            page={item}
            aria-label={getPageLabel?.(item)}
          />
        ) : (
          <PaginationEllipsis key={item.key}>
            {ellipsisContent}
          </PaginationEllipsis>
        ),
      )}
    </Fragment>
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
  First: PaginationFirst,
  Previous: PaginationPrevious,
  Range: PaginationRange,
  Next: PaginationNext,
  Last: PaginationLast,
  Page: PaginationPage,
  Ellipsis: PaginationEllipsis,
} as const;
