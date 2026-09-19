import { Box, DataTable } from "@flux-ui/react";
import type { ScenarioProps } from "../scenario.types.js";
interface Row {
  id: string;
  value: number;
}
const columns = [
  { id: "id", header: "ID", value: (row: Row) => row.id },
  { id: "value", header: "Value", value: (row: Row) => row.value },
];
const getRowId = (row: Row) => row.id;
const ignoreSortingChange = () => {};

export default function Fixture({ count, revision }: ScenarioProps) {
  const rows = Array.from({ length: count }, (_, i) => ({
    id: `row-${i}`,
    value: (i * 7919 + revision) % 10000,
  }));
  return (
    <Box data-perf-root>
      <DataTable
        label="Seeded table workload"
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        height={400}
        sorting={{
          columnId: "value",
          direction: revision === 0 ? "ascending" : "descending",
        }}
        onSortingChange={ignoreSortingChange}
      />
    </Box>
  );
}
