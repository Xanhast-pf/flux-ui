import {
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { attachRef } from "../../internal/attachRef.js";
import { joinClassNames } from "../../internal/joinClassNames.js";
import {
  bodyRow,
  cell,
  editError,
  editorInput,
  grid,
  headerCell,
  headerRow,
  sortButton,
} from "./DataGrid.css.js";
import type {
  DataGridCellValue,
  DataGridColumn,
  DataGridProps,
  DataGridSort,
} from "./DataGrid.types.js";

interface CellIdentity {
  rowId: string;
  columnId: string;
}

interface EditState {
  identity: CellIdentity;
  previousValue: DataGridCellValue;
  draft: string;
  error: string | null;
}

function allCells(scope: HTMLElement): HTMLElement[] {
  return [...scope.querySelectorAll<HTMLElement>('[role="gridcell"]')];
}

function cellIdentity(cell: HTMLElement): CellIdentity | null {
  const rowId = cell.dataset.rowId;
  const columnId = cell.dataset.columnId;
  return rowId && columnId ? { rowId, columnId } : null;
}

function setTabStop(
  scope: HTMLElement,
  preferred: CellIdentity | null,
): HTMLElement | null {
  const cells = allCells(scope);
  const active =
    preferred === null
      ? (cells[0] ?? null)
      : (cells.find(
          (candidate) =>
            candidate.dataset.rowId === preferred.rowId &&
            candidate.dataset.columnId === preferred.columnId,
        ) ??
        cells[0] ??
        null);
  for (const candidate of cells)
    candidate.tabIndex = candidate === active ? 0 : -1;
  return active;
}

function promoteTabStop(scope: HTMLElement, target: HTMLElement): void {
  const current = scope.querySelector<HTMLElement>(
    '[role="gridcell"][tabindex="0"]',
  );
  if (current === target) return;
  if (current !== null) current.tabIndex = -1;
  target.tabIndex = 0;
}

function cellAt(
  scope: HTMLElement,
  rowIndex: number,
  columnIndex: number,
): HTMLElement | null {
  return scope.querySelector<HTMLElement>(
    `[role="gridcell"][data-flux-grid-row="${rowIndex}"][data-flux-grid-column="${columnIndex}"]`,
  );
}

function trackWidth(width: DataGridColumn<unknown>["width"]) {
  if (typeof width === "number") return `${width}px`;
  return width === undefined ? "minmax(8rem, 1fr)" : String(width);
}

function displayValue(value: DataGridCellValue): string | number {
  if (typeof value === "number" && !Number.isFinite(value))
    throw new RangeError("DataGrid numeric cell values must be finite.");
  return value ?? "—";
}

function compareValues(a: DataGridCellValue, b: DataGridCellValue): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a ?? "").localeCompare(String(b ?? ""), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function nextSort(
  current: DataGridSort | null,
  columnId: string,
): DataGridSort | null {
  if (current?.columnId !== columnId)
    return { columnId, direction: "ascending" };
  if (current.direction === "ascending")
    return { columnId, direction: "descending" };
  return null;
}

function editDraft(value: DataGridCellValue): string {
  return value === null ? "" : String(value);
}

function editedValue(
  previousValue: DataGridCellValue,
  draft: string,
): DataGridCellValue {
  if (typeof previousValue === "number") {
    if (draft.trim() === "") return null;
    const number = Number(draft);
    return Number.isFinite(number) ? number : null;
  }
  if (previousValue === null) return draft === "" ? null : draft;
  return draft;
}

/**
 * Interactive grid with app-owned data transforms and transient inline editing.
 * Virtualization and server-data orchestration remain later architecture work.
 */
export function DataGrid<Row>({
  label,
  rows,
  columns,
  getRowId,
  filters = [],
  pagination = null,
  visibleColumnIds,
  selectable = false,
  sorting,
  defaultSorting = null,
  onSortingChange,
  selectedRowIds,
  defaultSelectedRowIds = [],
  onSelectedRowIdsChange,
  onCellEditCommit,
  className,
  onClick,
  onDoubleClick,
  onFocusCapture,
  onKeyDown,
  ref,
  ...props
}: DataGridProps<Row>) {
  if (columns.length < 1 || columns.length > 32)
    throw new RangeError("DataGrid requires 1 to 32 columns.");
  if (rows.length > 2_000)
    throw new RangeError("DataGrid supports at most 2,000 loaded rows.");

  const columnIds = columns.map((column) => column.id);
  if (
    columnIds.some((id) => id.length === 0) ||
    new Set(columnIds).size !== columnIds.length
  )
    throw new RangeError("DataGrid columns need unique non-empty IDs.");

  const entries = useMemo(
    () => rows.map((row) => ({ row, id: getRowId(row) })),
    [rows, getRowId],
  );
  const rowIds = entries.map((entry) => entry.id);
  if (
    rowIds.some((id) => id.length === 0) ||
    new Set(rowIds).size !== rowIds.length
  )
    throw new RangeError("DataGrid rows need unique non-empty IDs.");

  const columnsById = useMemo(
    () => new Map(columns.map((column) => [column.id, column])),
    [columns],
  );
  for (const filter of filters)
    if (!columnsById.has(filter.columnId))
      throw new RangeError(
        `Unknown DataGrid filter column "${filter.columnId}".`,
      );

  const visibleColumns =
    visibleColumnIds === undefined
      ? columns
      : visibleColumnIds.map((id) => {
          const column = columnsById.get(id);
          if (column === undefined)
            throw new RangeError(`Unknown DataGrid visible column "${id}".`);
          return column;
        });
  if (
    visibleColumns.length < 1 ||
    new Set(visibleColumns.map((column) => column.id)).size !==
      visibleColumns.length
  )
    throw new RangeError(
      "DataGrid visible column IDs must be unique and non-empty.",
    );

  if (
    pagination !== null &&
    (!Number.isInteger(pagination.pageIndex) ||
      pagination.pageIndex < 0 ||
      !Number.isInteger(pagination.pageSize) ||
      pagination.pageSize < 1 ||
      pagination.pageSize > 2_000)
  )
    throw new RangeError(
      "DataGrid requires pageIndex >= 0 and pageSize 1–2,000.",
    );

  const [localSort, setLocalSort] = useState<DataGridSort | null>(
    defaultSorting,
  );
  const [localSelection, setLocalSelection] = useState<readonly string[]>(
    defaultSelectedRowIds,
  );
  const [editing, setEditing] = useState<EditState | null>(null);
  const activeSort = sorting === undefined ? localSort : sorting;
  const selected = useMemo(
    () => new Set(selectedRowIds ?? localSelection),
    [selectedRowIds, localSelection],
  );

  if (activeSort !== null) {
    const sortColumn = columnsById.get(activeSort.columnId);
    if (sortColumn === undefined)
      throw new RangeError(
        `Unknown DataGrid sort column "${activeSort.columnId}".`,
      );
    if (sortColumn.sortable === false)
      throw new RangeError(
        `DataGrid column "${activeSort.columnId}" is not sortable.`,
      );
  }

  const ordered = useMemo(() => {
    let result = entries;
    for (const filter of filters) {
      if (filter.query.length === 0) continue;
      const column = columnsById.get(filter.columnId);
      if (column === undefined) continue;
      const query = filter.query.toLocaleLowerCase();
      result = result.filter((entry) =>
        column.filter
          ? column.filter(entry.row, filter.query)
          : String(column.value(entry.row) ?? "")
              .toLocaleLowerCase()
              .includes(query),
      );
    }

    if (activeSort === null) return result;
    const column = columnsById.get(activeSort.columnId);
    if (column === undefined) return result;
    const direction = activeSort.direction === "ascending" ? 1 : -1;
    return [...result].sort((a, b) => {
      const compared = column.compare
        ? column.compare(a.row, b.row)
        : compareValues(column.value(a.row), column.value(b.row));
      return compared * direction;
    });
  }, [entries, filters, columnsById, activeSort]);

  const pageStart =
    pagination === null ? 0 : pagination.pageIndex * pagination.pageSize;
  const pageEntries =
    pagination === null
      ? ordered
      : ordered.slice(pageStart, pageStart + pagination.pageSize);
  const template = visibleColumns
    .map((column) => trackWidth(column.width))
    .join(" ");
  const editingEnabled =
    onCellEditCommit !== undefined &&
    visibleColumns.some((column) => column.editable === true);
  const scope = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLInputElement | null>(null);
  const lastFocused = useRef<CellIdentity | null>(null);
  const pendingFocusRestore = useRef<CellIdentity | null>(null);
  const editErrorId = useId();

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      scope.current = node;
      if (node === null) return;
      const detach = attachRef(ref, node);
      return () => {
        scope.current = null;
        detach?.();
      };
    },
    [ref],
  );

  useLayoutEffect(() => {
    if (editing === null) return;
    const rowVisible = pageEntries.some(
      (entry) => entry.id === editing.identity.rowId,
    );
    const columnVisible = visibleColumns.some(
      (column) => column.id === editing.identity.columnId,
    );
    if (rowVisible && columnVisible) return;

    pendingFocusRestore.current = editing.identity;
    const frame = requestAnimationFrame(() => {
      setEditing((current) => (current === editing ? null : current));
    });
    return () => cancelAnimationFrame(frame);
  }, [editing, pageEntries, visibleColumns]);

  useLayoutEffect(() => {
    const gridElement = scope.current;
    if (gridElement === null) return;

    if (editing !== null) {
      const editor = editorRef.current;
      if (editor !== null && gridElement.ownerDocument.activeElement !== editor)
        editor.focus();
      return;
    }

    if (pendingFocusRestore.current !== null) {
      const target = setTabStop(gridElement, pendingFocusRestore.current);
      pendingFocusRestore.current = null;
      if (target !== null) {
        lastFocused.current = cellIdentity(target);
        target.focus();
      }
      return;
    }

    const active = gridElement.ownerDocument.activeElement;
    if (
      active instanceof HTMLElement &&
      active.getAttribute("role") === "gridcell" &&
      gridElement.contains(active)
    ) {
      lastFocused.current = cellIdentity(active);
      promoteTabStop(gridElement, active);
      return;
    }
    const target = setTabStop(gridElement, lastFocused.current);
    lastFocused.current =
      target === null ? lastFocused.current : cellIdentity(target);
  });

  function changeSorting(column: DataGridColumn<Row>): void {
    if (column.sortable === false) return;
    const next = nextSort(activeSort, column.id);
    if (sorting === undefined) setLocalSort(next);
    onSortingChange?.(next);
  }

  function changeSelection(rowId: string): void {
    if (!selectable) return;
    const next = new Set(selected);
    if (next.has(rowId)) next.delete(rowId);
    else next.add(rowId);
    const ids = [...next];
    if (selectedRowIds === undefined) setLocalSelection(ids);
    onSelectedRowIdsChange?.(ids);
  }

  function startEditing(identity: CellIdentity): boolean {
    if (onCellEditCommit === undefined) return false;
    const column = columnsById.get(identity.columnId);
    if (column?.editable !== true) return false;
    const entry = entries.find((candidate) => candidate.id === identity.rowId);
    if (entry === undefined) return false;
    const previousValue = column.value(entry.row);
    displayValue(previousValue);
    lastFocused.current = identity;
    setEditing({
      identity,
      previousValue,
      draft: editDraft(previousValue),
      error: null,
    });
    return true;
  }

  function cancelEditing(restoreFocus: boolean): void {
    if (editing === null) return;
    if (restoreFocus) pendingFocusRestore.current = editing.identity;
    setEditing(null);
  }

  function commitEditing(): void {
    if (editing === null || onCellEditCommit === undefined) return;
    const column = columnsById.get(editing.identity.columnId);
    const entry = entries.find(
      (candidate) => candidate.id === editing.identity.rowId,
    );
    if (column === undefined || entry === undefined) {
      pendingFocusRestore.current = editing.identity;
      setEditing(null);
      return;
    }

    const input = editorRef.current;
    if (input !== null && !input.checkValidity()) {
      setEditing((current) =>
        current === null
          ? current
          : {
              ...current,
              error: input.validationMessage || "Invalid value.",
            },
      );
      input.focus();
      return;
    }

    const value = editedValue(editing.previousValue, editing.draft);
    const validation = column.validateEdit?.(value, entry.row);
    if (validation) {
      setEditing((current) =>
        current === null ? current : { ...current, error: validation },
      );
      input?.focus();
      return;
    }

    onCellEditCommit({
      row: entry.row,
      rowId: entry.id,
      columnId: column.id,
      previousValue: editing.previousValue,
      value,
    });
    pendingFocusRestore.current = editing.identity;
    setEditing(null);
  }

  function handleEditorChange(event: ChangeEvent<HTMLInputElement>): void {
    const draft = event.currentTarget.value;
    setEditing((current) =>
      current === null ? current : { ...current, draft, error: null },
    );
  }

  function handleEditorKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      cancelEditing(true);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      commitEditing();
    }
  }

  function handleClick(event: MouseEvent<HTMLDivElement>): void {
    onClick?.(event);
    if (event.defaultPrevented || !selectable) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest('[data-flux-grid-editor="true"]')) return;
    const cellElement = target.closest<HTMLElement>('[role="gridcell"]');
    if (cellElement === null || !event.currentTarget.contains(cellElement))
      return;
    const identity = cellIdentity(cellElement);
    if (identity !== null) changeSelection(identity.rowId);
  }

  function handleDoubleClick(event: MouseEvent<HTMLDivElement>): void {
    onDoubleClick?.(event);
    if (event.defaultPrevented) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const cellElement = target.closest<HTMLElement>('[role="gridcell"]');
    if (cellElement === null || !event.currentTarget.contains(cellElement))
      return;
    const identity = cellIdentity(cellElement);
    if (identity !== null && startEditing(identity)) event.preventDefault();
  }

  function handleFocusCapture(event: FocusEvent<HTMLDivElement>): void {
    onFocusCapture?.(event);
    const target = event.target;
    if (
      target instanceof HTMLElement &&
      target.getAttribute("role") === "gridcell" &&
      event.currentTarget.contains(target)
    ) {
      lastFocused.current = cellIdentity(target);
      if (editing === null) promoteTabStop(event.currentTarget, target);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    onKeyDown?.(event);
    if (
      event.defaultPrevented ||
      event.altKey ||
      event.metaKey ||
      event.nativeEvent.isComposing
    )
      return;

    const target = event.target;
    if (
      !(target instanceof HTMLElement) ||
      target.getAttribute("role") !== "gridcell"
    )
      return;

    const identity = cellIdentity(target);
    if (event.key === " " && selectable && identity !== null) {
      event.preventDefault();
      changeSelection(identity.rowId);
      return;
    }
    if (event.key === "F2" && identity !== null && startEditing(identity)) {
      event.preventDefault();
      return;
    }
    if (event.key === "Enter" && identity !== null) {
      const column = columnsById.get(identity.columnId);
      if (column !== undefined && column.sortable !== false) {
        event.preventDefault();
        changeSorting(column);
        return;
      }
      if (startEditing(identity)) event.preventDefault();
      return;
    }

    const rowIndex = Number(target.dataset.fluxGridRow);
    const columnIndex = Number(target.dataset.fluxGridColumn);
    if (!Number.isInteger(rowIndex) || !Number.isInteger(columnIndex)) return;

    let nextRow = rowIndex;
    let nextColumn = columnIndex;
    if (event.key === "ArrowLeft" && !event.ctrlKey) nextColumn -= 1;
    else if (event.key === "ArrowRight" && !event.ctrlKey) nextColumn += 1;
    else if (event.key === "ArrowUp" && !event.ctrlKey) nextRow -= 1;
    else if (event.key === "ArrowDown" && !event.ctrlKey) nextRow += 1;
    else if (event.key === "Home") {
      if (event.ctrlKey) nextRow = 0;
      nextColumn = 0;
    } else if (event.key === "End") {
      if (event.ctrlKey) nextRow = pageEntries.length - 1;
      nextColumn = visibleColumns.length - 1;
    } else return;

    nextRow = Math.max(0, Math.min(pageEntries.length - 1, nextRow));
    nextColumn = Math.max(0, Math.min(visibleColumns.length - 1, nextColumn));
    const next = cellAt(event.currentTarget, nextRow, nextColumn);
    if (next === null || next === target) return;
    event.preventDefault();
    const nextIdentity = cellIdentity(next);
    target.tabIndex = -1;
    next.tabIndex = 0;
    lastFocused.current = nextIdentity;
    next.focus();
  }

  return (
    <div
      {...props}
      ref={setRef}
      className={joinClassNames(grid, className)}
      role="grid"
      aria-label={label}
      aria-readonly={!editingEnabled}
      aria-rowcount={ordered.length + 1}
      aria-colcount={visibleColumns.length}
      aria-multiselectable={selectable ? true : undefined}
      tabIndex={pageEntries.length === 0 ? 0 : -1}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onFocusCapture={handleFocusCapture}
      onKeyDown={handleKeyDown}
    >
      <div
        className={headerRow}
        role="row"
        aria-rowindex={1}
        style={{ gridTemplateColumns: template }}
      >
        {visibleColumns.map((column, columnIndex) => {
          const sortDirection =
            activeSort?.columnId === column.id
              ? activeSort.direction
              : undefined;
          return (
            <div
              key={column.id}
              className={headerCell}
              role="columnheader"
              aria-colindex={columnIndex + 1}
              aria-sort={sortDirection}
            >
              {column.sortable === false ? (
                column.header
              ) : (
                <button
                  type="button"
                  className={sortButton}
                  tabIndex={-1}
                  onClick={() => changeSorting(column)}
                >
                  {column.header}
                  {sortDirection === "ascending"
                    ? " ↑"
                    : sortDirection === "descending"
                      ? " ↓"
                      : " ↕"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {pageEntries.map((entry, rowIndex) => (
        <div
          key={entry.id}
          className={bodyRow}
          role="row"
          aria-rowindex={pageStart + rowIndex + 2}
          aria-selected={selectable ? selected.has(entry.id) : undefined}
          data-row-id={entry.id}
          data-selected={
            selectable && selected.has(entry.id) ? "true" : undefined
          }
          style={{ gridTemplateColumns: template }}
        >
          {visibleColumns.map((column, columnIndex) => {
            const value = displayValue(column.value(entry.row));
            const isEditing =
              editing?.identity.rowId === entry.id &&
              editing.identity.columnId === column.id;
            const cellEditable =
              onCellEditCommit !== undefined && column.editable === true;
            return (
              <div
                key={column.id}
                className={cell}
                role="gridcell"
                aria-colindex={columnIndex + 1}
                aria-readonly={editingEnabled ? !cellEditable : undefined}
                data-column-id={column.id}
                data-row-id={entry.id}
                data-editable={cellEditable ? "true" : undefined}
                data-editing={isEditing ? "true" : undefined}
                data-flux-grid-column={columnIndex}
                data-flux-grid-row={rowIndex}
                tabIndex={
                  editing !== null
                    ? -1
                    : rowIndex === 0 && columnIndex === 0
                      ? 0
                      : -1
                }
                title={isEditing ? undefined : String(value)}
              >
                {isEditing ? (
                  <>
                    <input
                      ref={editorRef}
                      className={editorInput}
                      data-flux-grid-editor="true"
                      type={
                        typeof editing.previousValue === "number"
                          ? "number"
                          : "text"
                      }
                      step={
                        typeof editing.previousValue === "number"
                          ? "any"
                          : undefined
                      }
                      value={editing.draft}
                      aria-label={`Edit ${column.header}, row ${pageStart + rowIndex + 1}`}
                      aria-invalid={editing.error ? true : undefined}
                      aria-describedby={editing.error ? editErrorId : undefined}
                      onChange={handleEditorChange}
                      onKeyDown={handleEditorKeyDown}
                      onBlur={() => cancelEditing(false)}
                    />
                    {editing.error ? (
                      <span id={editErrorId} className={editError} role="alert">
                        {editing.error}
                      </span>
                    ) : null}
                  </>
                ) : (
                  value
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
