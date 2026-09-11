import { joinClassNames } from "../../internal/joinClassNames.js";
import { caption, cell, row, table } from "./Table.css.js";
import type {
  TableBodyProps,
  TableCaptionProps,
  TableCellProps,
  TableColumnHeaderProps,
  TableFooterProps,
  TableHeaderProps,
  TableRootProps,
  TableRowHeaderProps,
  TableRowProps,
} from "./Table.types.js";

function TableRoot({
  density = "comfortable",
  className,
  ...props
}: TableRootProps) {
  return (
    <table
      {...props}
      data-d={density === "comfortable" ? undefined : density}
      className={joinClassNames(table, className)}
    />
  );
}

function TableCaption({
  visuallyHidden = false,
  className,
  ...props
}: TableCaptionProps) {
  return (
    <caption
      {...props}
      className={joinClassNames(caption, className)}
      data-v={visuallyHidden || undefined}
    />
  );
}

function TableHeader(props: TableHeaderProps) {
  return <thead {...props} />;
}

function TableBody(props: TableBodyProps) {
  return <tbody {...props} />;
}

function TableFooter(props: TableFooterProps) {
  return <tfoot {...props} />;
}

function TableRow({ className, ...props }: TableRowProps) {
  return <tr {...props} className={joinClassNames(row, className)} />;
}

function TableColumnHeader({ className, ...props }: TableColumnHeaderProps) {
  return (
    <th {...props} className={joinClassNames(cell, className)} scope="col" />
  );
}

function TableRowHeader({ className, ...props }: TableRowHeaderProps) {
  return (
    <th {...props} className={joinClassNames(cell, className)} scope="row" />
  );
}

function TableCell({ className, ...props }: TableCellProps) {
  return <td {...props} className={joinClassNames(cell, className)} />;
}

export const Table = {
  Root: TableRoot,
  Caption: TableCaption,
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  ColumnHeader: TableColumnHeader,
  RowHeader: TableRowHeader,
  Cell: TableCell,
} as const;
