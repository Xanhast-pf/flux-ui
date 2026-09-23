# Advanced components

These pre-stable families cover concrete documentation and showcase needs. They do
not add an editor engine, chart runtime, audio graph, or data-fetching dependency
to the core library. Their metadata selects an existing size class; the normal
emitted-package budgets and first-baseline checks still apply.

## CodeBlock: plain text first, optional highlighting

Plain `CodeBlock` renders immediately without a language engine. Add the optional
`tokenizeCode` export for bounded lexical coloring:

```tsx
import { useMemo } from "react";
import { CodeBlock, tokenizeCode } from "@flux-ui/react";

export function Source({ code }: { code: string }) {
  const tokens = useMemo(() => tokenizeCode(code, "typescript"), [code]);
  return <CodeBlock code={code} language="typescript" tokens={tokens} />;
}
```

The lexer recognizes JavaScript, TypeScript, JSX, TSX, JSON, CSS, SCSS, HTML, XML,
YAML, Bash, SQL, Python, Rust, Go, Java, C, C++, and Markdown, with common aliases.
It is a lexical highlighter, **not** a grammar parser. Unknown languages and
inputs longer than 500,000 UTF-16 code units fall back to plain text. At 20,000
tokens, the remaining source stays plain; no source characters are removed.

For a grammar engine, supply `highlight(code, language, signal)` returning token
ranges, synchronously or asynchronously. Ranges use ordered, nonoverlapping
UTF-16 offsets with `comment`, `keyword`, `string`, `number`, `property`, or
`punctuation` kinds. Invalid data, split surrogate pairs, or provider errors fall
back to the original literal source. No provider HTML is inserted into the DOM.
Pending requests are aborted when input changes; late responses cannot replace
newer content. Providers must cooperate with cancellation to stop their own work.

A build pipeline can calculate `tokens` in advance; this API does not itself run
a build-time highlighter. The docs currently memoize the small lexer in the
browser. Copy always uses the exact original source, not rendered span text.
CodeBlock remains a viewer, not an editor. Line numbers, diff views, worker-backed
grammars, and a production Shiki adapter are follow-up capabilities, not part of
this implementation.

## Charts and sparklines

```tsx
import { Chart } from "@flux-ui/react";

const income = [
  { x: 1, y: 120 },
  { x: 2, y: null },
  { x: 3, y: 180 },
];
export function IncomeChart() {
  return (
    <Chart
      label="Illustrative monthly income"
      description="The missing second month is a gap, not a zero."
      type="area"
      series={[{ id: "income", label: "Income", data: income }]}
      formatY={(value) => `$${value}`}
    />
  );
}
```

`Chart` supports line, area, and grouped bar views. Series have unique nonempty
IDs and names, strictly increasing finite x values, and finite y values or `null`
gaps. The limits are 32 series and 200,000 source samples in total. Invalid or
numerically unrepresentable domains fail explicitly.

Line and area rendering reduce large series into a bounded number of samples,
retaining gap boundaries, endpoints, and bucket extrema. `maxPoints` defaults to
512 per series and accepts 4–8,192. An excessive number of independent gaps fails
instead of connecting them or silently deleting them. Labels distinguish source
samples from displayed samples. Keyboard inspection still traverses source data.

Bars represent every supplied category. They are not downsampled: aggregate
upstream when necessary. Shared category spacing prevents mixed-density series
from overlapping each other. A category too narrow to draw honestly at the SVG's
working resolution is rejected rather than widened into neighboring categories.

The chart provides a caption, description, series-selection buttons, and a
keyboard data cursor. Arrow keys move between samples; Home/End select endpoints.
Pointer movement picks the closest x sample. Tone and line dashes distinguish
series without requiring color alone. Use short axis formatters; this first
implementation uses a responsive SVG viewBox, not an adaptive label-layout or
Canvas engine. It does not claim streaming, pan/zoom, or million-point throughput.

`Sparkline` is a separate small, labelled SVG for up to 2,048 values. It inherits
`currentColor`, preserves null gaps, and draws a visible dot for isolated samples.
Use `Chart` or a separate text summary when axes and detailed inspection matter.

## Numeric and DAW-style controls

`NumberField` is a native number input with `onValueChange(number | null)` and
normal form, reset, minimum, maximum, step, and validation behavior. Use
`Slider orientation="vertical"` for fader-style range controls. Neither control
steals wheel input or starts an audio engine.

`Knob` is a named slider for numeric interaction:

```tsx
import { Knob } from "@flux-ui/react";

export function Frequency() {
  return (
    <Knob
      aria-label="Filter frequency"
      min={20}
      max={20000}
      step={1}
      scale="log"
      defaultValue={1000}
      formatValue={(value) => `${Math.round(value)} Hz`}
    />
  );
}
```

A logarithmic range must have a positive minimum. Values are bounded and snapped
to the requested step. Arrow keys adjust, Page keys take larger steps, and
Home/End reach limits. Hold Shift for fine keyboard or pointer adjustment.
Dragging uses pointer capture; cancellation restores the gesture's starting
value without committing. `onValueChange` reports previews and `onValueCommit`
reports the completed gesture. Pair with NumberField for exact entry; Knob is
not itself a form input. Custom slider behavior still needs manual assistive-
technology review, especially touch screen readers.

`LevelMeter` is passive, labelled output with horizontal/vertical orientation,
caller-managed peak and clip status, and no timers or live-region flood. It
renders supplied values; measurement, smoothing, peak hold, audio permissions,
and DSP belong to the caller. The music demo remains silent and illustrative.

## DataTable: a windowed readable table

The existing `Table` stays a lightweight native composition. `DataTable` adds a
fixed-row-height window, stable identity, optional selection, and sorting:

```tsx
import { DataTable, type DataColumn } from "@flux-ui/react";

interface Invoice {
  id: string;
  customer: string;
  amount: number;
}
const columns: DataColumn<Invoice>[] = [
  { id: "customer", header: "Customer", value: (row) => row.customer },
  { id: "amount", header: "Amount", value: (row) => row.amount },
];
const getRowId = (row: Invoice) => row.id;

export function Invoices({ rows }: { rows: readonly Invoice[] }) {
  return (
    <DataTable
      label="Invoices"
      rows={rows}
      columns={columns}
      getRowId={getRowId}
      height={400}
      rowHeight={40}
      selectable
    />
  );
}
```

Keep rows, columns, and getRowId stable when their meaning has not changed. Local
sorting caches accessor values once, retains stable tie ordering, and does not
mutate caller arrays. Cell values must be text, finite numbers, or null. Custom
cell rendering is constrained by the declared fixed row height. IDs must be
unique; index-based identity does not preserve selection across reordering.

The mounted window is bounded by viewport size and overscan. A focused row stays
mounted outside that window, with spacer rows preserving geometry. Caption and
header height are measured on scroll instead of being mistaken for data rows.
Sorting state is controlled with `sorting`/`onSortingChange`, or initialized with
`defaultSorting`; controlled selection likewise pairs `selectedRowIds` with
`onSelectionChange`, while `defaultSelectedRowIds` initializes local selection.

For server ordering, set `manualSorting` with `onSortingChange` and fetch a new
loaded window in response to sorting changes. `totalRows` is informational: it neither fabricates unloaded
rows nor fetches them. The native table's row-count semantics describe the loaded
window. Data loading, cancellation, stale-response handling, filtering, and
server pagination belong to the application in this version.

Loaded input is capped at one million rows, and virtual scroll extent is limited
to 16,000,000 CSS pixels. For example, one million 40px rows must be split into
server windows. DOM virtualization does not eliminate memory, parsing, sorting,
or transfer costs. Seeded 100,000-row tests exercise bounded node counts; they
are not a production throughput guarantee. This is a readable native table, not
an editable ARIA grid, variable-height grid, or column-virtualization engine.

## SplitPane

`SplitPane` takes `first`, `second`, and an accessible `label`. It defaults to a
horizontal split with a 50% value and 10–90% bounds. Vertical splits need a bounded
container height. Fractional tracks account for the separator's own width, so
pane percentages cannot manufacture overflow.

The separator supports pointer capture/cancellation, arrow keys, Home/End, and
RTL-aware horizontal keys. Its visual grip is narrower than its 24px hit target.
It supports controlled or uncontrolled state and separate preview/commit
callbacks. It does not add persistence, routing, or modal behavior.

## Still separate work

A grammar/worker integration, adaptive Canvas charts, editable data grids,
Popover, Tooltip, Combobox, waveform/envelope/timeline editors, and real audio
processing remain separate projects. Add them against demonstrated use cases and
measured consumer scenarios, not by expanding every foundational import.
