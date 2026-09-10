import { Table } from "@flux-ui/react";

export default function Example() {
  return (
    <Table.Root>
      <Table.Caption>Native elements behind the components</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Component</Table.ColumnHeader>
          <Table.ColumnHeader>Element</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.RowHeader>Switch</Table.RowHeader>
          <Table.Cell>input[type=checkbox]</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeader>Select</Table.RowHeader>
          <Table.Cell>select</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.RowHeader>Progress</Table.RowHeader>
          <Table.Cell>progress</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}
