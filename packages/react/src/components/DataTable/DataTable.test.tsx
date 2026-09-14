import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DataTable } from "./DataTable.js";
import { tableWindow } from "./tableModel.js";
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

describe("DataTable hardening", () => {
  it("keeps nonempty rows mounted when filtering invalidates a distant scroll offset", () => {
    const rows = Array.from({ length: 2000 }, (_, i) => ({
      id: `row-${i}`,
      value: i,
    }));
    const view = render(
      <DataTable
        label="Filtered rows"
        rows={rows}
        columns={columns}
        getRowId={getRowId}
      />,
    );
    fireEvent.scroll(screen.getByRole("region"), {
      target: { scrollTop: 40000 },
    });
    view.rerender(
      <DataTable
        label="Filtered rows"
        rows={rows.slice(0, 5)}
        columns={columns}
        getRowId={getRowId}
      />,
    );
    expect(view.container.querySelectorAll("[data-row-id]")).toHaveLength(5);
    expect(
      view.container.querySelector("[data-row-id='row-0']"),
    ).not.toBeNull();
  });
  it("does not rebuild cell contents for scroll events inside the same virtual window", () => {
    const renderCell = vi.fn((row: Row) => String(row.value));
    const renderedColumns = [
      {
        id: "value",
        header: "Value",
        value: (row: Row) => row.value,
        renderCell,
      },
    ];
    const rows = Array.from({ length: 2000 }, (_, i) => ({
      id: `row-${i}`,
      value: i,
    }));
    render(
      <DataTable
        label="Efficient rows"
        rows={rows}
        columns={renderedColumns}
        getRowId={getRowId}
      />,
    );
    renderCell.mockClear();
    const region = screen.getByRole("region");
    for (const scrollTop of [1, 2, 10, 20])
      fireEvent.scroll(region, { target: { scrollTop } });
    expect(renderCell).not.toHaveBeenCalled();
    fireEvent.scroll(region, { target: { scrollTop: 4000 } });
    expect(renderCell).toHaveBeenCalled();
  });
});

describe("DataTable window boundaries", () => {
  it.each([
    [0, 40000, 0, 0, 0],
    [5, 40000, 0, 0, 5],
    [100, 40000, 0, 81, 100],
    [100, -40, 0, 0, 19],
    [100, 40, 100, 0, 19],
    [100, 500, 100, 6, 25],
  ])(
    "clamps %i rows at scroll %i and body offset %i",
    (count, scrollTop, bodyOffset, start, end) => {
      const height = 400;
      const rowHeight = 40;
      const overscan = 4;
      expect(
        tableWindow(count, scrollTop, height, rowHeight, overscan, bodyOffset),
      ).toEqual({
        start,
        end,
      });
    },
  );
  it("uses the final scroll window when events are batched", () => {
    const rows = Array.from({ length: 2000 }, (_, i) => ({
      id: `row-${i}`,
      value: i,
    }));
    const view = render(
      <DataTable
        label="Batched rows"
        rows={rows}
        columns={columns}
        getRowId={getRowId}
      />,
    );
    const region = screen.getByRole("region");
    act(() => {
      fireEvent.scroll(region, { target: { scrollTop: 4000 } });
      fireEvent.scroll(region, { target: { scrollTop: 0 } });
    });
    expect(
      view.container.querySelector("[data-row-id='row-0']"),
    ).not.toBeNull();
    expect(view.container.querySelector("[data-row-id='row-100']")).toBeNull();
  });
});
