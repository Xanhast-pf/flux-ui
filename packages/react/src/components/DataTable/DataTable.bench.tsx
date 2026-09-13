import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { DataTable } from "./DataTable.js";
interface Row {
  id: string;
  name: string;
  amount: number;
}
const columns = [
  { id: "name", header: "Name", value: (row: Row) => row.name },
  { id: "amount", header: "Amount", value: (row: Row) => row.amount },
];
const getRowId = (row: Row) => row.id;
const TypedTable = DataTable<Row>;

describe("DataTable SSR", () => {
  bench("render a representative public instance", () => {
    renderToString(
      <TypedTable
        {...({
          label: "Accounts",
          rows: [
            { id: "a", name: "Alpha", amount: 20 },
            { id: "b", name: "Beta", amount: 10 },
          ],
          columns,
          getRowId,
          selectable: true,
        } as const)}
      />,
    );
  });
});
