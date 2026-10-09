import { Box, DataGrid } from "@varua/flux-ui";
import type { ScenarioProps } from "../scenario.types.js";

interface Row {
  id: string;
  symbol: string;
  quantity: number;
  state: string;
}

const columns = [
  { id: "symbol", header: "Symbol", value: (row: Row) => row.symbol },
  { id: "quantity", header: "Quantity", value: (row: Row) => row.quantity },
  { id: "state", header: "State", value: (row: Row) => row.state },
] as const;

const getRowId = (row: Row) => row.id;
const ignoreSortingChange = () => {};
const ignoreSelectionChange = () => {};

export default function Fixture({ count, revision }: ScenarioProps) {
  const rows = Array.from({ length: count }, (_, index) => ({
    id: `row-${index}`,
    symbol: `SYM${String(index).padStart(4, "0")}`,
    quantity: (index * 7919 + revision) % 10000,
    state: index % 3 === 0 ? "Open" : index % 3 === 1 ? "Pending" : "Closed",
  }));
  const selectedRowIds =
    count === 0 ? [] : [revision === 0 ? "row-0" : `row-${count - 1}`];

  return (
    <Box data-perf-root>
      <DataGrid
        label="Seeded grid workload"
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        sorting={{
          columnId: "quantity",
          direction: revision === 0 ? "ascending" : "descending",
        }}
        onSortingChange={ignoreSortingChange}
        pagination={{ pageIndex: 0, pageSize: Math.min(100, count) }}
        selectable
        selectedRowIds={selectedRowIds}
        onSelectedRowIdsChange={ignoreSelectionChange}
      />
    </Box>
  );
}
