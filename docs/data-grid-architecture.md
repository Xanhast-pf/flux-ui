# DataGrid beta architecture

DataGrid is a distinct interactive-grid family. It does not replace or mutate DataTable.

## Product use case

Finance/admin/product screens sometimes need spreadsheet-like cell focus plus client-side data transforms and narrow inline editing. DataTable remains the preferred native table for browse/sort/select workflows that do not need ARIA-grid cell navigation.

## Milestone 2 scope

The beta contract includes:

- `role="grid"`, rows, column headers, and grid cells;
- stable non-empty string row and column identities;
- exactly one tabbable body cell when not editing;
- Arrow keys for adjacent-cell movement;
- Home/End for row endpoints;
- Control+Home / Control+End for rendered-page endpoints;
- click/focus synchronization with the roving tab stop;
- controlled or uncontrolled single-column sorting;
- keyboard sorting of the focused column with Enter;
- pointer sorting through non-tabbable header controls;
- application-owned column filters;
- application-owned pagination projection;
- application-owned visible-column projection;
- controlled or uncontrolled multiple row selection;
- pointer or Space row-selection toggling;
- opt-in inline editing for string/number/null display cells;
- synchronous column validation for edits;
- deterministic focus restoration after explicit commit/cancel;
- deterministic SSR initial tab stop;
- bounded non-virtualized rendering: at most 2,000 loaded rows and 32 columns.

## Explicit non-goals

This milestone does not implement:

- row-level edit modes;
- custom/arbitrary interactive descendants inside display cells;
- asynchronous edit validation or persistence state;
- virtualization;
- server-data fetching/orchestration;
- column grouping;
- persisted layout;
- built-in search, pagination, or column-manager controls.

Those remain later milestones or application composition concerns.

## Public data model

```tsx
<DataGrid
  label="Positions"
  rows={positions}
  columns={[
    { id: "symbol", header: "Symbol", value: (row) => row.symbol },
    {
      id: "quantity",
      header: "Quantity",
      value: (row) => row.quantity,
      editable: true,
      validateEdit: (value) =>
        typeof value === "number" && value >= 0
          ? null
          : "Quantity must be zero or greater.",
    },
  ]}
  getRowId={(row) => row.id}
  onCellEditCommit={({ rowId, columnId, value }) => {
    // Update application-owned row data.
  }}
/>
```

Rows remain application-owned objects. `getRowId` must return a non-empty unique string.

Columns use non-empty unique IDs and produce string/number/null display values. A column may opt out of sorting, provide a custom comparator/filter matcher, opt into editing, and synchronously validate a candidate edit.

## Transformation order

The grid applies client transforms in a deterministic order:

1. validate row/column identity;
2. apply all non-empty column filters;
3. apply the active single-column sort;
4. apply pagination;
5. project the requested visible columns for rendering.

Filters, pagination, and visible columns are application-owned inputs. Flux does not own search boxes, pagination controls, or column-manager UI because existing Flux controls can compose those product-specific surfaces.

Sorting and selection expose controlled/uncontrolled state because DataGrid directly mutates those interaction states. Editing is different: row data remains application-owned, so Flux only emits `onCellEditCommit`.

## Keyboard and focus model

When not editing, the body has exactly one `tabIndex=0` gridcell. All other body cells are `-1`.

- ArrowLeft / ArrowRight: previous/next visible cell in the row.
- ArrowUp / ArrowDown: same visible column in the previous/next rendered row.
- Home / End: first/last visible cell in the current row.
- Control+Home / Control+End: first/last body cell on the rendered page.
- Enter: cycle sorting for the focused cell's column when sortable.
- F2: start editing when the focused cell's column is editable.
- Enter on a non-sortable editable cell: start editing.
- Space: toggle the focused row when `selectable`.
- Tab: leave the grid normally; DataGrid does not trap focus.

Header sort buttons intentionally use `tabIndex={-1}` so sorting does not create extra Tab stops before the roving body cell.

Stable row/column identity is remembered across ordinary rerenders and sorting so the focused logical cell remains the tab stop when it is still rendered.

## Editing model

Editing is deliberately narrow and transient.

A column becomes editable with `editable: true`, and the grid enables editing only when `onCellEditCommit` is present.

Entry:

- F2 from a focused editable body cell;
- Enter from a focused editable cell only when that column is non-sortable;
- double-click with a pointer.

While editing:

- the grid's body-cell tab stop is replaced by one native input;
- string/null values use a text input;
- numeric values use `input[type=number]` with `step="any"`;
- the editor receives an accessible name from the column header and rendered row position;
- the owning grid reports `aria-readonly="false"`, while non-editable cells remain individually readonly.

Exit:

- Enter commits a valid candidate through `onCellEditCommit`;
- Escape cancels;
- clicking or tabbing away cancels rather than silently committing;
- explicit commit/cancel restores focus to the same logical cell when it is still rendered, otherwise the roving-focus fallback is used.

This intentionally avoids hidden persistence semantics. The callback carries row identity, the original row object, previous value, and candidate value; the application updates `rows`.

## Validation model

Validation is synchronous and column-local through `validateEdit(value, row)`.

- return `null` / `undefined` to allow the commit;
- return a string to keep the editor active, set `aria-invalid`, and expose the message through an alert/described-by relationship;
- native input validity is checked first.

Async persistence errors remain application state and are not modeled as a transient editor promise/reducer.

## Selection semantics

When `selectable` is true:

- the grid exposes `aria-multiselectable="true"`;
- body rows expose `aria-selected`;
- pointer activation of a body cell toggles its row;
- Space toggles the focused row;
- selected IDs may be controlled or uncontrolled;
- pointer interaction inside the active editor does not toggle row selection.

Selection remains row-oriented. Cell selection and range selection are not part of this milestone.

## Browser and accessibility assumptions

The implementation uses DOM roles, native focus, native buttons for pointer-sort affordance, and a native input for the transient editor.

Targeted Chromium, Firefox, and WebKit tests must verify:

- one-tab-stop cell navigation;
- focused-cell preservation through sorting;
- edit entry/commit/focus restoration;
- row selection semantics;
- axe-clean docs output.

## Performance boundary

DataGrid renders all loaded cells and therefore rejects more than 2,000 loaded rows or 32 columns. This is an architecture guard, not a claim that 2,000 × 32 cells is an ideal product layout.

Filtering and sorting are client-side over loaded rows. Editing introduces only one input at a time. Large-data virtualization and server-owned query orchestration remain later architecture work.

## Server/client boundary

Rows and columns are plain application data/functions. The initial tab stop is deterministic in server markup, so hydration does not need browser-only initialization.

Editing state exists only after user interaction. Data fetching, persistence, and optimistic/server reconciliation remain outside DataGrid.

## Form semantics

DataGrid itself is not a form control. Its transient editor is an internal native input and does not submit application data directly; applications commit edits into their own row/form/domain state.

## Dependencies

No new dependency is required for milestone 2.

## Test plan

- unit tests for roles, identity validation, roving focus, boundaries, sorting, filters, pagination, visibility, selection, editing, validation, commit/cancel, escape hatches, and SSR;
- focused three-engine browser tests for focus movement, editing, sorting, selection, and axe;
- React/docs type checks and lint;
- component doctor/readiness;
- accepted data-heavy baseline regression review;
- representative SSR benchmark.
