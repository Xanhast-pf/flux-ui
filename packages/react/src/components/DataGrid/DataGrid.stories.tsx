import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataGrid } from "./DataGrid.js";
import type { DataGridProps } from "./DataGrid.types.js";

interface Position {
  id: string;
  symbol: string;
  quantity: number;
  state: string;
}

const rows: Position[] = [
  { id: "aapl", symbol: "AAPL", quantity: 12, state: "Open" },
  { id: "msft", symbol: "MSFT", quantity: 7, state: "Pending" },
  { id: "nvda", symbol: "NVDA", quantity: 4, state: "Closed" },
];

function PositionsGrid(props: DataGridProps<Position>) {
  return <DataGrid {...props} />;
}

const columns: DataGridProps<Position>["columns"] = [
  { id: "symbol", header: "Symbol", value: (row) => row.symbol },
  { id: "quantity", header: "Quantity", value: (row) => row.quantity },
  { id: "state", header: "State", value: (row) => row.state },
];

const meta = {
  title: "Data/DataGrid",
  component: PositionsGrid,
  args: {
    label: "Positions",
    rows,
    columns,
    getRowId: (row) => row.id,
    selectable: true,
    defaultSelectedRowIds: ["msft"],
  },
} satisfies Meta<typeof PositionsGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Positions: Story = {};
