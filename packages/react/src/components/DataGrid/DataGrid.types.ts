import type { ComponentPropsWithRef, CSSProperties } from "react";

export type DataGridCellValue = string | number | null;

export interface DataGridSort {
  columnId: string;
  direction: "ascending" | "descending";
}

export interface DataGridFilter {
  columnId: string;
  query: string;
}

export interface DataGridPagination {
  pageIndex: number;
  pageSize: number;
}

export interface DataGridCellEdit<Row> {
  row: Row;
  rowId: string;
  columnId: string;
  previousValue: DataGridCellValue;
  value: DataGridCellValue;
}

export interface DataGridColumn<Row> {
  id: string;
  header: string;
  value: (row: Row) => DataGridCellValue;
  width?: CSSProperties["width"] | undefined;
  sortable?: boolean | undefined;
  compare?: ((a: Row, b: Row) => number) | undefined;
  filter?: ((row: Row, query: string) => boolean) | undefined;
  editable?: boolean | undefined;
  validateEdit?:
    | ((value: DataGridCellValue, row: Row) => string | null | undefined)
    | undefined;
}

type DataGridBaseProps<Row> = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "role" | "aria-label"
> & {
  label: string;
  rows: readonly Row[];
  columns: readonly DataGridColumn<Row>[];
  getRowId: (row: Row) => string;
  filters?: readonly DataGridFilter[] | undefined;
  pagination?: DataGridPagination | null | undefined;
  visibleColumnIds?: readonly string[] | undefined;
  selectable?: boolean | undefined;
  onCellEditCommit?: ((edit: DataGridCellEdit<Row>) => void) | undefined;
};

type DataGridSortingProps =
  | {
      sorting: DataGridSort | null;
      defaultSorting?: never;
      onSortingChange?: ((sorting: DataGridSort | null) => void) | undefined;
    }
  | {
      sorting?: undefined;
      defaultSorting?: DataGridSort | null | undefined;
      onSortingChange?: ((sorting: DataGridSort | null) => void) | undefined;
    };

type DataGridSelectionProps =
  | {
      selectedRowIds: readonly string[];
      defaultSelectedRowIds?: never;
      onSelectedRowIdsChange?:
        ((rowIds: readonly string[]) => void) | undefined;
    }
  | {
      selectedRowIds?: undefined;
      defaultSelectedRowIds?: readonly string[] | undefined;
      onSelectedRowIdsChange?:
        ((rowIds: readonly string[]) => void) | undefined;
    };

export type DataGridProps<Row> = DataGridBaseProps<Row> &
  DataGridSortingProps &
  DataGridSelectionProps;
