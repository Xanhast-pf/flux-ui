import Preview from "./data-grid.preview.js";
import code from "./data-grid.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  props: [
    [
      "rows / getRowId",
      "readonly Row[] / (row) => string",
      "Application-owned rows with stable, unique, non-empty row identity.",
    ],
    [
      "columns",
      "readonly DataGridColumn<Row>[]",
      "Columns expose stable IDs, display values, optional sizing, sorting/filtering hooks, and opt-in cell editing.",
    ],
    [
      "sorting / defaultSorting",
      "DataGridSort | null",
      "Controlled or uncontrolled single-column sorting. Pointer activation uses the header; Enter sorts the focused cell's column.",
    ],
    [
      "filters / pagination",
      "readonly DataGridFilter[] / DataGridPagination",
      "Application-owned client transforms. Filtering runs before sorting, then pagination slices the logical result.",
    ],
    [
      "visibleColumnIds",
      "readonly string[]",
      "Optional ordered projection of visible columns while preserving stable column identity.",
    ],
    [
      "selectable / selectedRowIds",
      "boolean / readonly string[]",
      "Optional multiple row selection with controlled or uncontrolled IDs. Pointer activation or Space toggles the focused row.",
    ],
    [
      "onCellEditCommit",
      "(edit: DataGridCellEdit<Row>) => void",
      "Enables columns marked editable. Flux owns only transient editor state; committed row data stays application-owned.",
    ],
    ["label", "string", "Accessible name for the interactive grid."],
  ],
  notes: [
    "DataGrid remains a distinct ARIA grid; DataTable stays the native table choice for browse-oriented tabular data.",
    "Tab enters the current roving body cell. Arrow keys move by row/column, Home/End move within the row, Control+Home/End reach page endpoints, Enter sorts the focused cell's column, and Space toggles row selection when selectable.",
    "F2 starts editing an editable focused cell; double-click is the pointer equivalent. Enter commits, Escape cancels, and either explicit path restores focus to the logical cell.",
    "Clicking or tabbing away cancels the transient editor instead of silently committing. Custom validation stays synchronous through column.validateEdit.",
    "Filtering, pagination, and column visibility are application-owned inputs so Flux does not invent search, paging, or column-manager UI that products may already compose from existing controls.",
    "Row editing, arbitrary interactive descendants, virtualization, and server-data orchestration remain later roadmap work.",
  ],
} satisfies ComponentExample;
