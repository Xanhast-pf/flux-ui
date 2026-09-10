import Preview from "./table.preview.js";
import code from "./table.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  notes: [
    "Table preserves table semantics. It is not a data grid, virtualizer, sorting engine or selection model.",
    "Use Caption and scoped column/row headers. Root forwards its ref to the real table.",
    "Put wide tables in a named, keyboard-focusable scrolling region at the app layer.",
  ],
  props: [
    [
      "Root / Caption",
      "table / caption props",
      "Table structure and accessible caption.",
    ],
    [
      "Header / Body / Footer / Row",
      "thead / tbody / tfoot / tr props",
      "Compose native row groups and rows.",
    ],
    [
      "ColumnHeader / RowHeader / Cell",
      "th / th / td props",
      "Headers default to the correct col or row scope.",
    ],
  ],
} satisfies ComponentExample;
