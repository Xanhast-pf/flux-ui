import type { ComponentPropsWithRef, CSSProperties, ReactNode } from "react";
export type CellValue = string | number | null;
export interface DataColumn<Row> {
  id: string;
  header: string;
  value: (row: Row) => CellValue;
  renderCell?: ((row: Row, value: CellValue) => ReactNode) | undefined;
  sortable?: boolean | undefined;
  width?: CSSProperties["width"] | undefined;
}
export interface DataSort {
  columnId: string;
  direction: "ascending" | "descending";
}
/** Fixed-height windowed native table. It is not an editable ARIA grid. */
export interface DataTableProps<Row> extends Omit<
  ComponentPropsWithRef<"div">,
  "children"
> {
  label: string;
  rows: readonly Row[];
  columns: readonly DataColumn<Row>[];
  getRowId: (row: Row) => string;
  height?: number | undefined;
  rowHeight?: number | undefined;
  overscan?: number | undefined;
  sorting?: DataSort | null | undefined;
  defaultSorting?: DataSort | null | undefined;
  onSortingChange?: ((sorting: DataSort | null) => void) | undefined;
  /** Sort the loaded data locally unless the server owns ordering. */
  manualSorting?: boolean | undefined;
  /** Informational total only: unloaded rows are not fabricated or fetched. */
  totalRows?: number | undefined;
  selectable?: boolean | undefined;
  selectedRowIds?: readonly string[] | undefined;
  defaultSelectedRowIds?: readonly string[] | undefined;
  onSelectionChange?: ((rowIds: readonly string[]) => void) | undefined;
}
