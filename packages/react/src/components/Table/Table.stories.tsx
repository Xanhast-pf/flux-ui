import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table } from "./Table.js";
const meta = { title: "Data/Table", component: Table.Root } satisfies Meta<
  typeof Table.Root
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {},
  render: () => (
    <Table.Root>
      <Table.Caption>Release checks</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Check</Table.ColumnHeader>
          <Table.ColumnHeader>Status</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.RowHeader>Accessibility</Table.RowHeader>
          <Table.Cell>Ready</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  ),
};
