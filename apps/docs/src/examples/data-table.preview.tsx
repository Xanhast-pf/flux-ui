import { useMemo, useState } from "react";
import {
  Badge,
  DataTable,
  Field,
  Select,
  Stack,
  Text,
  type DataColumn,
} from "@flux-ui/react";
interface Row {
  id: string;
  name: string;
  amount: number;
  active: boolean;
}
const columns: readonly DataColumn<Row>[] = [
  { id: "name", header: "Account", value: (row) => row.name },
  { id: "amount", header: "Amount", value: (row) => row.amount },
  {
    id: "status",
    header: "Status",
    value: (row) => (row.active ? "Active" : "Paused"),
    renderCell: (row) => <Badge>{row.active ? "Active" : "Paused"}</Badge>,
  },
];
const getRowId = (row: Row) => row.id;
export default function Preview() {
  const [count, setCount] = useState(1000);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const rows = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: `account-${index}`,
        name: `Account ${index + 1}`,
        amount: (index * 7919) % 100000,
        active: index % 3 !== 0,
      })),
    [count],
  );
  return (
    <Stack gap="md">
      <Field.Root>
        <Field.Label>Loaded rows</Field.Label>
        <Field.Control>
          <Select
            value={count}
            onChange={(event) => setCount(Number(event.currentTarget.value))}
          >
            <option value={100}>100</option>
            <option value={1000}>1,000</option>
            <option value={10000}>10,000</option>
          </Select>
        </Field.Control>
      </Field.Root>
      <DataTable
        label="Seeded accounts"
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        height={400}
        selectable
        selectedRowIds={selected}
        onSelectionChange={setSelected}
      />
      <Text tone="muted">
        {selected.length} selected IDs. Sorting preserves identity. Only a
        fixed-height window is mounted; the entire loaded array still occupies
        memory.
      </Text>
    </Stack>
  );
}
