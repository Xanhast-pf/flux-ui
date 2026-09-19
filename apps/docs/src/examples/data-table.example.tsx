import Preview from "./data-table.preview.js";
import code from "./data-table.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  code,
  previewLayout: "fill",
  notes: [
    "Windowed, fixed-row-height native table; not an editable spreadsheet or ARIA grid.",
    "Row and column IDs must be unique and stable. Sorting is stable; input data is not mutated.",
    "Focused rows remain mounted outside the visible window. Keep cell content within the fixed row height.",
    "manualSorting hands ordering to the application. totalRows is informational: Flux never fabricates or fetches unloaded rows.",
    "Virtualization bounds DOM nodes, not parsing, sorting or memory. Portable scroll extent is limited to 16 million CSS pixels; use server windows beyond it.",
  ],
  props: [
    [
      "rows / columns / getRowId",
      "typed data and columns",
      "Stable, typed data access without field-name magic.",
    ],
    [
      "height / rowHeight / overscan",
      "number",
      "Finite fixed-height virtualization window.",
    ],
    [
      "sorting / onSortingChange",
      "DataSort | null",
      "Controlled sorting requires onSortingChange; defaultSorting initializes local state. manualSorting also requires a sort-request callback.",
    ],
    [
      "selectedRowIds / onSelectionChange",
      "readonly string[]",
      "Controlled selection requires onSelectionChange; defaultSelectedRowIds initializes local selection by identity.",
    ],
  ],
} satisfies ComponentExample;
