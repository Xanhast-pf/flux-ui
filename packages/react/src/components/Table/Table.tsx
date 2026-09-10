import { joinClassNames } from "../../internal/joinClassNames.js";
import { table, caption, row, cell } from "./Table.css.js";
import type {
  TableRootProps,
  TableCaptionProps,
  TableHeaderProps,
  TableBodyProps,
  TableFooterProps,
  TableRowProps,
  TableColumnHeaderProps,
  TableRowHeaderProps,
  TableCellProps,
} from "./Table.types.js";
function TableRoot({ className, ...props }: TableRootProps) {
  return <table {...props} className={joinClassNames(table, className)} />;
}
function TableCaption({ className, ...props }: TableCaptionProps) {
  return <caption {...props} className={joinClassNames(caption, className)} />;
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
