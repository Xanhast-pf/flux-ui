import type { CellValue, DataColumn, DataSort } from "./DataTable.types.js";
const cellCollator = new Intl.Collator("en", { numeric: true });
const MAX_LOADED_ROWS = 1_000_000;
const MAX_SCROLL_GEOMETRY_PX = 16_000_000;
function nonempty(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}
export interface DataRow<Row> {
  id: string;
  row: Row;
}
export function identifyRows<Row>(
  rows: readonly Row[],
  getRowId: (row: Row) => string,
): DataRow<Row>[] {
  if (rows.length > MAX_LOADED_ROWS)
    throw new RangeError(
      "DataTable accepts at most one million loaded rows; use server windows for larger sources.",
    );
  const seen = new Set<string>();
  return rows.map((row) => {
    const id = getRowId(row);
    if (!nonempty(id) || seen.has(id))
      throw new Error("DataTable row IDs must be nonempty and unique.");
    seen.add(id);
    return { row, id };
  });
}
export function cellValue(value: unknown): CellValue {
  if (
    value === null ||
    typeof value === "string" ||
    (typeof value === "number" && Number.isFinite(value))
  )
    return value;
  throw new TypeError(
    "DataTable cell values must be text, finite numbers or null.",
  );
}
export function compareCells(left: CellValue, right: CellValue): number {
  if (left === right) return 0;
  if (left === null) return 1;
  if (right === null) return -1;
  if (typeof left === "number" && typeof right === "number")
    return left - right;
  return cellCollator.compare(String(left), String(right));
}
export function sortDataRows<Row>(
  rows: readonly DataRow<Row>[],
  columns: readonly DataColumn<Row>[],
  sorting: DataSort | null,
  manual: boolean,
): readonly DataRow<Row>[] {
  const ids = new Set(columns.map((column) => column.id));
  if (
    ids.size !== columns.length ||
    columns.some(
      (column) => !nonempty(column.id) || !nonempty(column.header),
    ) ||
    columns.length === 0 ||
    columns.length > 128
  )
    throw new Error(
      "DataTable needs 1–128 uniquely identified, named columns.",
    );
  if (!sorting) return rows;
  if (!["ascending", "descending"].includes(sorting.direction))
    throw new Error("Invalid DataTable sort direction.");
  const column = columns.find((item) => item.id === sorting.columnId);
  if (!column || column.sortable === false)
    throw new Error("DataTable sorting must name a sortable column.");
  if (manual) return rows;
  // Cache accessor values once. Native stable sort preserves source order for
  // equal cells, without storing a second index on every loaded row.
  return rows
    .map((entry) => ({ entry, value: cellValue(column.value(entry.row)) }))
    .sort((left, right) => {
      const order = compareCells(left.value, right.value);
      return sorting.direction === "ascending" ? order : -order;
    })
    .map(({ entry }) => entry);
}
export function tableWindow(
  count: number,
  scrollTop: number,
  height: number,
  rowHeight: number,
  overscan: number,
  bodyOffset = 0,
) {
  if (
    !Number.isFinite(height) ||
    height < 80 ||
    height > 4000 ||
    !Number.isFinite(rowHeight) ||
    rowHeight < 24 ||
    rowHeight > 256 ||
    !Number.isInteger(overscan) ||
    overscan < 0 ||
    overscan > 50
  )
    throw new RangeError("Invalid DataTable viewport, row height or overscan.");
  if (
    !Number.isInteger(count) ||
    count < 0 ||
    !Number.isFinite(scrollTop) ||
    !Number.isFinite(bodyOffset) ||
    bodyOffset < 0
  )
    throw new RangeError("Invalid DataTable row count or scroll position.");
  if (count * rowHeight > MAX_SCROLL_GEOMETRY_PX)
    throw new RangeError(
      "DataTable scroll geometry exceeds the portable browser range; load a smaller server window.",
    );
  const visibleCount = Math.ceil(height / rowHeight) + overscan * 2 + 1;
  // Filtering can leave a stale scroll offset beyond the new data. Keep a
  // complete trailing window mounted until the browser clamps its scrollport.
  const start = Math.max(
    0,
    Math.min(
      count - visibleCount,
      Math.floor((scrollTop - bodyOffset) / rowHeight) - overscan,
    ),
  );
  const end = Math.min(count, start + visibleCount);
  return { start, end };
}
export function nextDataSort(
  current: DataSort | null,
  columnId: string,
): DataSort | null {
  if (current?.columnId !== columnId)
    return { columnId, direction: "ascending" };
  return current.direction === "ascending"
    ? { columnId, direction: "descending" }
    : null;
}
