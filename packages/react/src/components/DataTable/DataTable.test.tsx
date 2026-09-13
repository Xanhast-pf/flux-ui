import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DataTable } from "./DataTable.js";
interface Row {
  id: string;
  value: number;
}
const columns = [
  { id: "value", header: "Value", value: (row: Row) => row.value },
];
const getRowId = (row: Row) => row.id;
describe("DataTable", () => {
  it("windows a 100,000-row source instead of mounting all rows", () => {
    const rows = Array.from({ length: 100000 }, (_, i) => ({
      id: `row-${i}`,
      value: i,
    }));
    const view = render(
      <DataTable
        label="Rows"
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        height={400}
      />,
    );
    expect(screen.getByRole("table")).toHaveAttribute(
      "aria-rowcount",
      "100001",
    );
    expect(
      view.container.querySelectorAll("[data-row-id]").length,
    ).toBeLessThan(30);
    fireEvent.scroll(screen.getByRole("region"), {
      target: { scrollTop: 40000 },
    });
    expect(
      view.container.querySelector("[data-row-id='row-1000']"),
    ).not.toBeNull();
    expect(
      view.container.querySelectorAll("[data-row-id]").length,
    ).toBeLessThan(30);
  });
  it("keeps selection by row identity through stable sorting", () => {
    render(
      <DataTable
        label="Rows"
        rows={[
          { id: "b", value: 2 },
          { id: "a", value: 1 },
        ]}
        columns={columns}
        getRowId={getRowId}
        selectable
      />,
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "Select row b" }));
    fireEvent.click(screen.getByRole("button", { name: /Value/ }));
    expect(
      screen.getByRole("checkbox", { name: "Select row b" }),
    ).toBeChecked();
    expect(screen.getByRole("columnheader", { name: /Value/ })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
  });
  it("pins the focused row instead of discarding its input during scroll", () => {
    const rows = Array.from({ length: 2000 }, (_, i) => ({
      id: `row-${i}`,
      value: i,
    }));
    render(
      <DataTable
        label="Rows"
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        selectable
      />,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Select row row-0" });
    fireEvent.focus(checkbox);
    fireEvent.scroll(screen.getByRole("region"), {
      target: { scrollTop: 40000 },
    });
    expect(checkbox).toBeInTheDocument();
  });
});
