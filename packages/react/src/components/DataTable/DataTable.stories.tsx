import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable } from "./DataTable.js";
import type { DataTableProps } from "./DataTable.types.js";
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
function TypedTable(props: DataTableProps<Row>) {
  return <DataTable {...props} />;
}

const meta = {
  title: "Data/DataTable",
  component: TypedTable,
  args: {
    label: "Accounts",
    rows: [
      { id: "a", name: "Alpha", amount: 20 },
      { id: "b", name: "Beta", amount: 10 },
    ],
    columns,
    getRowId,
    selectable: true,
  },
} satisfies Meta<typeof TypedTable>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
