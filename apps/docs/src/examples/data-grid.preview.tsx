import { useState } from "react";
import { DataGrid } from "@varua/flux-ui";

interface Position {
  id: string;
  symbol: string;
  quantity: number;
  state: string;
}

const initialRows: Position[] = [
  { id: "aapl", symbol: "AAPL", quantity: 12, state: "Open" },
  { id: "msft", symbol: "MSFT", quantity: 7, state: "Pending" },
  { id: "nvda", symbol: "NVDA", quantity: 4, state: "Closed" },
  { id: "shop", symbol: "SHOP", quantity: 9, state: "Open" },
];

export default function Example() {
  const [rows, setRows] = useState(initialRows);

  return (
    <DataGrid
      label="Positions"
      rows={rows}
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
        {
          id: "state",
          header: "State",
          value: (row) => row.state,
          editable: true,
          sortable: false,
        },
      ]}
      getRowId={(row) => row.id}
      selectable
      defaultSelectedRowIds={["msft"]}
      onCellEditCommit={({ rowId, columnId, value }) => {
        setRows((current) =>
          current.map((row) => {
            if (row.id !== rowId) return row;
            if (columnId === "quantity" && typeof value === "number")
              return { ...row, quantity: value };
            if (columnId === "state" && typeof value === "string")
              return { ...row, state: value };
            return row;
          }),
        );
      }}
    />
  );
}
