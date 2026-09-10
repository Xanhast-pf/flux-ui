import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Table } from "./Table.js";
function Example() {
  return (
    <>
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
    </>
  );
}
describe("Table", () => {
  it("preserves caption, row, cell and header semantics", () => {
    render(
      <Table.Root>
        <Example />
      </Table.Root>,
    );
    expect(
      screen.getByRole("table", { name: "Release checks" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Check" })).toHaveAttribute(
      "scope",
      "col",
    );
    expect(
      screen.getByRole("rowheader", { name: "Accessibility" }),
    ).toHaveAttribute("scope", "row");
    expect(screen.getByRole("cell", { name: "Ready" })).toBeInTheDocument();
  });
  it("forwards refs, styles and native attributes", () => {
    const ref = createRef<HTMLTableElement>();
    render(
      <Table.Root ref={ref} className="custom" style={{ margin: "0.25rem" }}>
        <Example />
      </Table.Root>,
    );
    expect(ref.current).toBe(screen.getByRole("table"));
    expect(ref.current).toHaveClass("custom");
    expect(ref.current?.style.margin).toBe("0.25rem");
  });
  it("renders native server markup without a grid engine", () => {
    const markup = renderToString(
      <Table.Root>
        <Example />
      </Table.Root>,
    );
    expect(markup).toContain("<thead");
    expect(markup).not.toContain('role="grid"');
  });
});
