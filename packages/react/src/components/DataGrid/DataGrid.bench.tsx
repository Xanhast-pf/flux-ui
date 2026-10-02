import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { DataGrid } from "./DataGrid.js";

const rows = Array.from({ length: 100 }, (_, index) => ({
  id: `row-${index}`,
  values: Array.from({ length: 10 }, (_value, column) => index * 10 + column),
}));
const columns = Array.from({ length: 10 }, (_value, index) => ({
  id: `column-${index}`,
  header: `Column ${index + 1}`,
  value: (row: (typeof rows)[number]) => row.values[index] ?? null,
}));

describe("DataGrid SSR", () => {
  bench("render a 100 by 10 admin grid", () => {
    renderToString(
      <DataGrid
        label="Benchmark grid"
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
      />,
    );
  });
});
