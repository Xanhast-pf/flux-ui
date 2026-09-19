import { describe, expect, it } from "vitest";
import type { ChartProps } from "../components/Chart/Chart.types.js";
import { DataTable } from "../components/DataTable/DataTable.js";
import type {
  DataColumn,
  DataTableProps,
} from "../components/DataTable/DataTable.types.js";
import { LevelMeter } from "../components/LevelMeter/LevelMeter.js";
import type { LevelMeterProps } from "../components/LevelMeter/LevelMeter.types.js";
import { Sparkline } from "../components/Sparkline/Sparkline.js";
import type { SparklineProps } from "../components/Sparkline/Sparkline.types.js";
import type { StatProps } from "../components/Stat/Stat.types.js";
import type { TagProps } from "../components/Tag/Tag.types.js";

interface Row {
  id: string;
  value: number;
}

const rows: readonly Row[] = [{ id: "a", value: 1 }];
const columns: readonly DataColumn<Row>[] = [
  { id: "value", header: "Value", value: (row) => row.value },
];
const getRowId = (row: Row) => row.id;
const base = { label: "Rows", rows, columns, getRowId } as const;

describe("Data public type contracts", () => {
  it("keeps ownership and runtime semantics explicit", () => {
    const valid = (
      <>
        <DataTable {...base} defaultSorting={null} />
        <DataTable {...base} sorting={null} onSortingChange={() => {}} />
        <DataTable {...base} manualSorting onSortingChange={() => {}} />
        <DataTable
          {...base}
          selectable
          selectedRowIds={[]}
          onSelectionChange={() => {}}
        />
        <LevelMeter aria-label="Bus" value={-12} />
        <Sparkline label="Trend" values={[1, 2]} />
        <Sparkline aria-hidden values={[1, 2]} />
      </>
    );
    expect(valid).toBeDefined();

    // @ts-expect-error Controlled sorting requires an owner callback.
    const ownerlessSort: DataTableProps<Row> = {
      ...base,
      sorting: { columnId: "value", direction: "ascending" },
    };
    // @ts-expect-error Controlled sorting cannot also declare a default.
    const ambiguousSort: DataTableProps<Row> = {
      ...base,
      sorting: null,
      defaultSorting: null,
      onSortingChange: () => {},
    };
    // @ts-expect-error Server-owned sorting requires a sort-request callback.
    const ownerlessManualSort: DataTableProps<Row> = {
      ...base,
      manualSorting: true,
    };
    // @ts-expect-error Controlled selection requires an owner callback.
    const ownerlessSelection: DataTableProps<Row> = {
      ...base,
      selectedRowIds: [],
    };
    // @ts-expect-error Controlled selection cannot also declare a default.
    const ambiguousSelection: DataTableProps<Row> = {
      ...base,
      selectedRowIds: [],
      defaultSelectedRowIds: [],
      onSelectionChange: () => {},
    };
    // @ts-expect-error Exposed sparklines require a label.
    const unnamedSparkline = <Sparkline values={[1, 2]} />;
    const hiddenNamedSparkline = (
      // @ts-expect-error Hidden sparklines do not expose a redundant label.
      <Sparkline aria-hidden label="Trend" values={[1, 2]} />
    );

    const meterRole: LevelMeterProps = {
      value: -12,
      "aria-label": "Bus",
      // @ts-expect-error LevelMeter always exposes meter semantics.
      role: "slider",
    };
    const meterMin: LevelMeterProps = {
      value: -12,
      "aria-label": "Bus",
      // @ts-expect-error LevelMeter owns its numeric minimum.
      "aria-valuemin": -80,
    };
    const meterMax: LevelMeterProps = {
      value: -12,
      "aria-label": "Bus",
      // @ts-expect-error LevelMeter owns its numeric maximum.
      "aria-valuemax": 6,
    };
    const meterNow: LevelMeterProps = {
      value: -12,
      "aria-label": "Bus",
      // @ts-expect-error LevelMeter owns the clamped numeric ARIA value.
      "aria-valuenow": -6,
    };
    const meterHtml: LevelMeterProps = {
      value: -12,
      "aria-label": "Bus",
      // @ts-expect-error LevelMeter owns its rendered meter/clip child tree.
      dangerouslySetInnerHTML: { __html: "unsafe" },
    };
    const sparklineRole: SparklineProps = {
      label: "Trend",
      values: [1, 2],
      // @ts-expect-error Sparkline is always an image when exposed.
      role: "presentation",
    };
    const sparklineViewBox: SparklineProps = {
      label: "Trend",
      values: [1, 2],
      // @ts-expect-error Sparkline owns its fixed geometry.
      viewBox: "0 0 20 20",
    };
    const sparklineLabel: SparklineProps = {
      label: "Trend",
      values: [1, 2],
      // @ts-expect-error Use the public label prop, not a second native label.
      "aria-label": "Other",
    };
    const sparklineHtml: SparklineProps = {
      label: "Trend",
      values: [1, 2],
      // @ts-expect-error Sparkline owns its generated SVG path child tree.
      dangerouslySetInnerHTML: { __html: "unsafe" },
    };

    const chartHtml: ChartProps = {
      label: "Traffic",
      series: [],
      // @ts-expect-error Chart owns its rendered child tree.
      dangerouslySetInnerHTML: { __html: "unsafe" },
    };
    const tableHtml: DataTableProps<Row> = {
      ...base,
      // @ts-expect-error DataTable owns its rendered table tree.
      dangerouslySetInnerHTML: { __html: "unsafe" },
    };
    const statHtml: StatProps = {
      label: "Errors",
      value: 0,
      // @ts-expect-error Stat owns its dl/dt/dd child tree.
      dangerouslySetInnerHTML: { __html: "unsafe" },
    };
    const tagHtml: TagProps = {
      children: "Design",
      // @ts-expect-error Tag owns its label/remove child composition.
      dangerouslySetInnerHTML: { __html: "unsafe" },
    };

    expect([
      ownerlessSort,
      ambiguousSort,
      ownerlessManualSort,
      ownerlessSelection,
      ambiguousSelection,
      unnamedSparkline,
      hiddenNamedSparkline,
      meterRole,
      meterMin,
      meterMax,
      meterNow,
      meterHtml,
      sparklineRole,
      sparklineViewBox,
      sparklineLabel,
      sparklineHtml,
      chartHtml,
      tableHtml,
      statHtml,
      tagHtml,
    ]).toHaveLength(20);
  });
});
