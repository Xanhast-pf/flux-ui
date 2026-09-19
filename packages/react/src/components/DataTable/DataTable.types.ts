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
type DataTableBaseProps<Row> = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "dangerouslySetInnerHTML"
> & {
  label: string;
  rows: readonly Row[];
  columns: readonly DataColumn<Row>[];
  getRowId: (row: Row) => string;
  height?: number | undefined;
  rowHeight?: number | undefined;
  overscan?: number | undefined;
  /** Informational total only: unloaded rows are not fabricated or fetched. */
  totalRows?: number | undefined;
  selectable?: boolean | undefined;
};

type DataTableSortingProps =
  | {
      sorting: DataSort | null;
      defaultSorting?: never;
      onSortingChange: (sorting: DataSort | null) => void;
      manualSorting?: boolean | undefined;
    }
  | {
      sorting?: undefined;
      defaultSorting?: DataSort | null | undefined;
      onSortingChange?: ((sorting: DataSort | null) => void) | undefined;
      manualSorting?: false | undefined;
    }
  | {
      sorting?: undefined;
      defaultSorting?: DataSort | null | undefined;
      onSortingChange: (sorting: DataSort | null) => void;
      /** Server-owned ordering requires a request callback. */
      manualSorting: true;
    };

type DataTableSelectionProps =
  | {
      selectedRowIds: readonly string[];
      defaultSelectedRowIds?: never;
      onSelectionChange: (rowIds: readonly string[]) => void;
    }
  | {
      selectedRowIds?: undefined;
      defaultSelectedRowIds?: readonly string[] | undefined;
      onSelectionChange?: ((rowIds: readonly string[]) => void) | undefined;
    };

export type DataTableProps<Row> = DataTableBaseProps<Row> &
  DataTableSortingProps &
  DataTableSelectionProps;
