import { createRef } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { DataGrid } from "./DataGrid.js";
import type { DataGridSort } from "./DataGrid.types.js";

const rows = [
  { id: "aapl", symbol: "AAPL", quantity: 12, state: "Open" },
  { id: "msft", symbol: "MSFT", quantity: 7, state: "Pending" },
  { id: "nvda", symbol: "NVDA", quantity: 4, state: "Closed" },
] as const;

const columns = [
  {
    id: "symbol",
    header: "Symbol",
    value: (row: (typeof rows)[number]) => row.symbol,
  },
  {
    id: "quantity",
    header: "Quantity",
    value: (row: (typeof rows)[number]) => row.quantity,
  },
  {
    id: "state",
    header: "State",
    value: (row: (typeof rows)[number]) => row.state,
  },
] as const;

function Example() {
  return (
    <DataGrid
      label="Positions"
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
    />
  );
}

describe("DataGrid", () => {
  it("renders interactive grid semantics with stable row/column identity", () => {
    render(<Example />);

    const grid = screen.getByRole("grid", { name: "Positions" });
    expect(grid).toHaveAttribute("aria-readonly", "true");
    expect(grid).toHaveAttribute("aria-rowcount", "4");
    expect(grid).toHaveAttribute("aria-colcount", "3");

    const renderedRows = within(grid).getAllByRole("row");
    expect(renderedRows).toHaveLength(4);
    expect(within(renderedRows[0]!).getAllByRole("columnheader")).toHaveLength(
      3,
    );

    const aapl = screen.getByRole("gridcell", { name: "AAPL" });
    expect(aapl).toHaveAttribute("data-row-id", "aapl");
    expect(aapl).toHaveAttribute("data-column-id", "symbol");
    expect(aapl).toHaveAttribute("tabindex", "0");

    const cells = within(grid).getAllByRole("gridcell");
    expect(cells.filter((cell) => cell.tabIndex === 0)).toHaveLength(1);
  });

  it("implements row/column roving focus without trapping Tab", async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">Before</button>
        <Example />
        <button type="button">After</button>
      </>,
    );

    screen.getByRole("button", { name: "Before" }).focus();
    await user.tab();
    expect(screen.getByRole("gridcell", { name: "AAPL" })).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("gridcell", { name: "12" })).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("gridcell", { name: "7" })).toHaveFocus();

    await user.keyboard("{End}");
    expect(screen.getByRole("gridcell", { name: "Pending" })).toHaveFocus();

    await user.keyboard("{Home}");
    expect(screen.getByRole("gridcell", { name: "MSFT" })).toHaveFocus();

    await user.keyboard("{Control>}{End}{/Control}");
    expect(screen.getByRole("gridcell", { name: "Closed" })).toHaveFocus();

    await user.keyboard("{Control>}{Home}{/Control}");
    expect(screen.getByRole("gridcell", { name: "AAPL" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
  });

  it("keeps keyboard and pointer interaction in the grid owner document", () => {
    const iframe = document.createElement("iframe");
    document.body.append(iframe);
    const ownerDocument = iframe.contentDocument;
    if (ownerDocument === null) throw new Error("Missing iframe document.");
    const container = ownerDocument.createElement("div");
    ownerDocument.body.append(container);
    const editableColumns = columns.map((column) =>
      column.id === "symbol"
        ? { ...column, editable: true, sortable: false }
        : column,
    );
    const rendered = render(
      <DataGrid
        label="Realm grid"
        rows={rows}
        columns={editableColumns}
        getRowId={(row) => row.id}
        selectable
        onCellEditCommit={vi.fn()}
      />,
      { container },
    );

    try {
      const cells =
        container.querySelectorAll<HTMLElement>('[role="gridcell"]');
      const first = cells[0];
      const second = cells[1];
      if (first === undefined || second === undefined)
        throw new Error("Missing grid cells.");
      first.focus();
      fireEvent.keyDown(first, { key: "ArrowRight" });
      expect(ownerDocument.activeElement).toBe(second);

      fireEvent.click(first);
      expect(first.closest('[role="row"]')).toHaveAttribute(
        "aria-selected",
        "true",
      );

      fireEvent.doubleClick(first);
      const editor = container.querySelector<HTMLInputElement>(
        'input[aria-label="Edit Symbol, row 1"]',
      );
      expect(editor).not.toBeNull();
      expect(ownerDocument.activeElement).toBe(editor);
    } finally {
      rendered.unmount();
      iframe.remove();
    }
  });

  it("preserves the focused stable cell across ordinary rerenders", () => {
    const { rerender } = render(<Example />);
    const pending = screen.getByRole("gridcell", { name: "Pending" });
    pending.focus();
    expect(pending).toHaveFocus();

    rerender(<Example />);
    expect(screen.getByRole("gridcell", { name: "Pending" })).toHaveFocus();
    expect(screen.getByRole("gridcell", { name: "Pending" })).toHaveAttribute(
      "tabindex",
      "0",
    );
  });

  it("forwards root escape hatches and rejects ambiguous identity", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <DataGrid
        ref={ref}
        label="Positions"
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        className="custom-grid"
        data-density="dense"
        style={{ marginBlock: "0.25rem" }}
      />,
    );

    const grid = screen.getByRole("grid");
    expect(grid).toHaveClass("custom-grid");
    expect(grid).toHaveAttribute("data-density", "dense");
    expect(grid.style.marginBlock).toBe("0.25rem");
    expect(ref.current).toBe(grid);

    expect(() =>
      render(
        <DataGrid
          label="Bad"
          rows={[rows[0], rows[0]]}
          columns={columns}
          getRowId={(row) => row.id}
        />,
      ),
    ).toThrow(/unique non-empty IDs/u);

    expect(() =>
      render(
        <DataGrid
          label="Bad header"
          rows={rows}
          columns={[{ ...columns[0], header: "" }]}
          getRowId={(row) => row.id}
        />,
      ),
    ).toThrow(/non-empty headers/u);

    const invalidSorting: DataGridSort = {
      columnId: "quantity",
      direction: "ascending",
    };
    Object.defineProperty(invalidSorting, "direction", { value: "sideways" });
    expect(() =>
      render(
        <DataGrid
          label="Bad sorting"
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          sorting={invalidSorting}
        />,
      ),
    ).toThrow(/sort direction/u);
  });

  it("supports pointer and keyboard sorting without adding header tab stops", async () => {
    const user = userEvent.setup();
    render(<Example />);

    const grid = screen.getByRole("grid", { name: "Positions" });
    const quantityButton = screen.getByRole("button", { name: "Quantity ↕" });
    expect(quantityButton).toHaveAttribute("tabindex", "-1");

    await user.click(quantityButton);
    let renderedRows = within(grid).getAllByRole("row");
    expect(renderedRows[1]).toHaveTextContent("NVDA");
    expect(
      screen.getByRole("columnheader", { name: "Quantity ↑" }),
    ).toHaveAttribute("aria-sort", "ascending");

    const quantity = screen.getByRole("gridcell", { name: "4" });
    quantity.focus();
    await user.keyboard("{Enter}");
    renderedRows = within(grid).getAllByRole("row");
    expect(renderedRows[1]).toHaveTextContent("AAPL");
    expect(
      screen.getByRole("columnheader", { name: "Quantity ↓" }),
    ).toHaveAttribute("aria-sort", "descending");
  });

  it("applies filtering, pagination, and visible-column projection before rendering", () => {
    render(
      <DataGrid
        label="Filtered positions"
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        filters={[{ columnId: "state", query: "e" }]}
        pagination={{ pageIndex: 1, pageSize: 1 }}
        visibleColumnIds={["symbol", "state"]}
      />,
    );

    const grid = screen.getByRole("grid", { name: "Filtered positions" });
    expect(grid).toHaveAttribute("aria-rowcount", "4");
    expect(grid).toHaveAttribute("aria-colcount", "2");
    expect(screen.getByRole("gridcell", { name: "MSFT" })).toBeInTheDocument();
    expect(screen.queryByRole("gridcell", { name: "7" })).toBeNull();
    expect(screen.getByRole("row", { name: /MSFT Pending/u })).toHaveAttribute(
      "aria-rowindex",
      "3",
    );
  });

  it("supports controlled-compatible multiple row selection by pointer and Space", async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        label="Selectable positions"
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        selectable
        defaultSelectedRowIds={["msft"]}
      />,
    );

    const grid = screen.getByRole("grid", { name: "Selectable positions" });
    expect(grid).toHaveAttribute("aria-multiselectable", "true");
    const msftRow = screen.getByRole("row", { name: /MSFT 7 Pending/u });
    expect(msftRow).toHaveAttribute("aria-selected", "true");
    expect(msftRow).toHaveAttribute("data-selected", "true");

    const aapl = screen.getByRole("gridcell", { name: "AAPL" });
    await user.click(aapl);
    expect(screen.getByRole("row", { name: /AAPL 12 Open/u })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    aapl.focus();
    await user.keyboard(" ");
    expect(screen.getByRole("row", { name: /AAPL 12 Open/u })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("commits editable cells through app-owned row data and restores focus", async () => {
    const user = userEvent.setup();
    const onCellEditCommit = vi.fn();
    const editableColumns = columns.map((column) =>
      column.id === "quantity" ? { ...column, editable: true } : column,
    );

    render(
      <DataGrid
        label="Editable positions"
        rows={rows}
        columns={editableColumns}
        getRowId={(row) => row.id}
        onCellEditCommit={onCellEditCommit}
      />,
    );

    const grid = screen.getByRole("grid", { name: "Editable positions" });
    expect(grid).toHaveAttribute("aria-readonly", "false");

    const quantity = screen.getByRole("gridcell", { name: "12" });
    expect(quantity).toHaveAttribute("aria-readonly", "false");
    expect(quantity).toHaveAttribute("data-editable", "true");
    expect(quantity).not.toHaveAttribute("data-editing");
    quantity.focus();
    await user.keyboard("{F2}");
    expect(quantity).toHaveAttribute("data-editing", "true");

    const editor = screen.getByRole("spinbutton", {
      name: "Edit Quantity, row 1",
    });
    expect(editor).toHaveFocus();
    expect(editor).toHaveValue(12);

    await user.clear(editor);
    await user.type(editor, "15");
    await user.keyboard("{Enter}");

    expect(onCellEditCommit).toHaveBeenCalledWith({
      row: rows[0],
      rowId: "aapl",
      columnId: "quantity",
      previousValue: 12,
      value: 15,
    });
    expect(screen.getByRole("gridcell", { name: "12" })).toHaveFocus();
  });

  it("keeps invalid edits active and Escape cancels with focus restoration", async () => {
    const user = userEvent.setup();
    const onCellEditCommit = vi.fn();
    const editableColumns = columns.map((column) =>
      column.id === "state"
        ? {
            ...column,
            editable: true,
            sortable: false,
            validateEdit: (value: string | number | null) =>
              value === "Archived" ? "Archived state is not allowed." : null,
          }
        : column,
    );

    render(
      <DataGrid
        label="Validated positions"
        rows={rows}
        columns={editableColumns}
        getRowId={(row) => row.id}
        onCellEditCommit={onCellEditCommit}
      />,
    );

    const state = screen.getByRole("gridcell", { name: "Open" });
    state.focus();
    await user.keyboard("{F2}");

    const editor = screen.getByRole("textbox", {
      name: "Edit State, row 1",
    });
    await user.clear(editor);
    await user.type(editor, "Archived");
    await user.keyboard("{Enter}");

    expect(editor).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Archived state is not allowed.",
    );
    expect(editor).toHaveFocus();
    expect(onCellEditCommit).not.toHaveBeenCalled();

    await user.keyboard("{Escape}");
    expect(screen.getByRole("gridcell", { name: "Open" })).toHaveFocus();
    expect(onCellEditCommit).not.toHaveBeenCalled();
  });

  it("starts editing by double click and cancels when focus leaves the grid", async () => {
    const user = userEvent.setup();
    const onCellEditCommit = vi.fn();
    const editableColumns = columns.map((column) =>
      column.id === "symbol"
        ? { ...column, editable: true, sortable: false }
        : column,
    );

    render(
      <>
        <DataGrid
          label="Pointer edit"
          rows={rows}
          columns={editableColumns}
          getRowId={(row) => row.id}
          onCellEditCommit={onCellEditCommit}
        />
        <button type="button">Outside</button>
      </>,
    );

    await user.dblClick(screen.getByRole("gridcell", { name: "AAPL" }));
    const editor = screen.getByRole("textbox", {
      name: "Edit Symbol, row 1",
    });
    expect(editor).toHaveFocus();

    await user.clear(editor);
    await user.type(editor, "APPLE");
    await user.click(screen.getByRole("button", { name: "Outside" }));

    expect(
      screen.queryByRole("textbox", { name: "Edit Symbol, row 1" }),
    ).toBeNull();
    expect(onCellEditCommit).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Outside" })).toHaveFocus();
  });

  it("is server safe with a deterministic initial tab stop", () => {
    const markup = renderToString(<Example />);
    expect(markup).toContain('role="grid"');
    expect(markup).toContain('role="gridcell"');
    expect(markup).toContain('tabindex="0"');
    expect(markup).toContain('data-row-id="aapl"');
  });
});
