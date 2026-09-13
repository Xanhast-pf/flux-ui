import {
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { ScrollArea } from "../ScrollArea/ScrollArea.js";
import { joinClassNames } from "../../internal/joinClassNames.js";
import {
  cellValue,
  identifyRows,
  nextDataSort,
  sortDataRows,
  tableWindow,
} from "./tableModel.js";
import {
  bodyCell,
  caption,
  cellContent,
  dataTable,
  header,
  headerCell,
  scrollport,
  sortButton,
  spacer,
  table,
} from "./DataTable.css.js";
import type { DataTableProps, DataSort } from "./DataTable.types.js";
export function DataTable<Row>({
  label,
  rows,
  columns,
  getRowId,
  height = 400,
  rowHeight = 40,
  overscan = 4,
  sorting,
  defaultSorting = null,
  onSortingChange,
  manualSorting = false,
  totalRows = rows.length,
  selectable = false,
  selectedRowIds,
  defaultSelectedRowIds = [],
  onSelectionChange,
  className,
  ...props
}: DataTableProps<Row>): ReactElement {
  const [localSort, setLocalSort] = useState<DataSort | null>(defaultSorting);
  const [localSelection, setLocalSelection] = useState<readonly string[]>(
    defaultSelectedRowIds,
  );
  const bodyRef = useRef<HTMLTableSectionElement>(null);
  const [viewport, setViewport] = useState({ scrollTop: 0, bodyOffset: 0 });
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const activeSort = sorting === undefined ? localSort : sorting;
  const identified = useMemo(
    () => identifyRows(rows, getRowId),
    [rows, getRowId],
  );
  const ordered = useMemo(
    () => sortDataRows(identified, columns, activeSort, manualSorting),
    [identified, columns, activeSort, manualSorting],
  );
  const rowIndexes = useMemo(
    () => new Map(ordered.map((entry, index) => [entry.id, index])),
    [ordered],
  );
  const selected = useMemo(
    () => new Set(selectedRowIds ?? localSelection),
    [selectedRowIds, localSelection],
  );
  if (!Number.isInteger(totalRows) || totalRows < rows.length)
    throw new RangeError(
      "totalRows must be an integer at least as large as the loaded rows.",
    );
  const window = tableWindow(
    ordered.length,
    viewport.scrollTop,
    height,
    rowHeight,
    overscan,
    viewport.bodyOffset,
  );
  // A focused row remains mounted even outside the visible window. Sorting uses stable IDs.
  const focusedIndex =
    focusedId === null ? -1 : (rowIndexes.get(focusedId) ?? -1);
  const indexes = Array.from(
    { length: window.end - window.start },
    (_, offset) => window.start + offset,
  );
  if (
    focusedIndex >= 0 &&
    (focusedIndex < window.start || focusedIndex >= window.end)
  )
    indexes.push(focusedIndex);
  indexes.sort((a, b) => a - b);
  const colSpan = columns.length + (selectable ? 1 : 0);
  const rendered: ReactNode[] = [];
  let previous = 0;
  function appendSpacer(from: number, to: number) {
    if (to <= from) return;
    rendered.push(
      <tr key={`space-${from}`} aria-hidden="true">
        <td
          className={spacer}
          colSpan={colSpan}
          style={{ height: (to - from) * rowHeight }}
        />
      </tr>,
    );
  }
  function changeSelection(id: string, checked: boolean) {
    const next = new Set(selected);
    if (checked) next.add(id);
    else next.delete(id);
    const ids = [...next];
    if (selectedRowIds === undefined) setLocalSelection(ids);
    onSelectionChange?.(ids);
  }
  for (const index of indexes) {
    const entry = ordered[index];
    if (!entry) continue;
    appendSpacer(previous, index);
    rendered.push(
      <tr
        key={`row-${entry.id}`}
        data-row-id={entry.id}
        aria-rowindex={index + 2}
      >
        {selectable ? (
          <td className={bodyCell}>
            <div className={cellContent} style={{ height: rowHeight }}>
              <input
                type="checkbox"
                aria-label={`Select row ${entry.id}`}
                checked={selected.has(entry.id)}
                onChange={(event) =>
                  changeSelection(entry.id, event.currentTarget.checked)
                }
              />
            </div>
          </td>
        ) : null}
        {columns.map((column) => {
          const value = cellValue(column.value(entry.row));
          return (
            <td key={column.id} className={bodyCell}>
              <div
                className={cellContent}
                style={{ height: rowHeight }}
                title={value === null ? undefined : String(value)}
              >
                {column.renderCell
                  ? column.renderCell(entry.row, value)
                  : (value ?? "—")}
              </div>
            </td>
          );
        })}
      </tr>,
    );
    previous = index + 1;
  }
  appendSpacer(previous, ordered.length);
  return (
    <div {...props} className={joinClassNames(dataTable, className)}>
      <ScrollArea
        aria-label={`${label} scrollable rows`}
        className={scrollport}
        style={{ maxHeight: height }}
        onScroll={(event) => {
          const port = event.currentTarget;
          const body = bodyRef.current;
          // Caption wrapping and header height must not be mistaken for data rows.
          // The tbody starts before virtual spacer rows, so this offset is stable.
          const bodyOffset =
            body && body.getClientRects().length > 0
              ? Math.max(
                  0,
                  body.getBoundingClientRect().top -
                    port.getBoundingClientRect().top -
                    port.clientTop +
                    port.scrollTop,
                )
              : 0;
          setViewport({ scrollTop: port.scrollTop, bodyOffset });
        }}
        onFocusCapture={(event) => {
          const target = event.target;
          if (target instanceof Element)
            setFocusedId(
              target.closest<HTMLElement>("[data-row-id]")?.dataset.rowId ??
                null,
            );
        }}
        onBlurCapture={(event) => {
          if (
            event.relatedTarget instanceof Node &&
            !event.currentTarget.contains(event.relatedTarget)
          )
            setFocusedId(null);
        }}
      >
        <table className={table} aria-rowcount={ordered.length + 1}>
          <caption className={caption}>
            {label} · {rows.length.toLocaleString()} loaded of{" "}
            {totalRows.toLocaleString()} total rows
            {manualSorting ? " · Server ordering" : ""}
          </caption>
          <colgroup>
            {selectable ? <col style={{ width: "3rem" }} /> : null}
            {columns.map((column) => (
              <col key={column.id} style={{ width: column.width }} />
            ))}
          </colgroup>
          <thead className={header}>
            <tr aria-rowindex={1}>
              {selectable ? (
                <th className={headerCell} scope="col">
                  Select
                </th>
              ) : null}
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={headerCell}
                  scope="col"
                  aria-sort={
                    activeSort?.columnId === column.id
                      ? activeSort.direction
                      : undefined
                  }
                >
                  {column.sortable === false ? (
                    column.header
                  ) : (
                    <button
                      type="button"
                      className={sortButton}
                      onClick={() => {
                        const next = nextDataSort(activeSort, column.id);
                        if (sorting === undefined) setLocalSort(next);
                        onSortingChange?.(next);
                      }}
                    >
                      {column.header}
                      {activeSort?.columnId === column.id
                        ? activeSort.direction === "ascending"
                          ? " ↑"
                          : " ↓"
                        : " ↕"}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody ref={bodyRef}>
            {ordered.length ? (
              rendered
            ) : (
              <tr>
                <td className={bodyCell} colSpan={colSpan}>
                  No rows to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  );
}
