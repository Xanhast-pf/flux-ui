import { createRef, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "./Pagination.js";

function Controls() {
  return (
    <>
      <Pagination.Previous />
      <Pagination.Page page={1} />
      <Pagination.Page page={2} />
      <Pagination.Page page={3} />
      <Pagination.Next />
    </>
  );
}

function Controlled() {
  const [page, setPage] = useState(1);
  return (
    <Pagination.Root page={page} pageCount={3} onPageChange={setPage}>
      <Controls />
    </Pagination.Root>
  );
}

describe("Pagination", () => {
  it("changes controlled pages and disables boundaries", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await user.click(screen.getByRole("button", { name: "Page 3" }));
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("provides first/last controls and bounded generated ranges", async () => {
    const user = userEvent.setup();

    function Example() {
      const [page, setPage] = useState(6);
      return (
        <Pagination.Root page={page} pageCount={12} onPageChange={setPage}>
          <Pagination.First />
          <Pagination.Previous />
          <Pagination.Range />
          <Pagination.Next />
          <Pagination.Last />
        </Pagination.Root>
      );
    }

    render(<Example />);
    expect(
      screen
        .getAllByRole("button")
        .map(
          (element) =>
            element.getAttribute("aria-label") ?? element.textContent,
        ),
    ).toEqual([
      "First",
      "Previous",
      "Page 1",
      "Page 5",
      "Page 6",
      "Page 7",
      "Page 12",
      "Next",
      "Last",
    ]);
    expect(screen.getAllByText("…")).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: "Last" }));
    expect(screen.getByRole("button", { name: "Page 12" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("button", { name: "Last" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "First" }));
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("button", { name: "First" })).toBeDisabled();
  });

  it("expands one-page gaps instead of rendering unnecessary ellipses", () => {
    render(
      <Pagination.Root page={4} pageCount={7} onPageChange={() => {}}>
        <Pagination.Range siblingCount={1} boundaryCount={2} />
      </Pagination.Root>,
    );

    expect(screen.queryByText("…")).not.toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(7);
  });

  it("localizes generated page labels and omission content", () => {
    render(
      <Pagination.Root page={5} pageCount={10} onPageChange={() => {}}>
        <Pagination.Range
          getPageLabel={(page) => `Página ${page}`}
          ellipsis="•••"
        />
      </Pagination.Root>,
    );

    expect(screen.getByRole("button", { name: "Página 5" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getAllByText("•••")).toHaveLength(2);
  });

  it("rejects invalid generated range settings", () => {
    for (const siblingCount of [-1, 1.5, Infinity, NaN])
      expect(() =>
        renderToString(
          <Pagination.Root page={1} pageCount={3} onPageChange={() => {}}>
            <Pagination.Range siblingCount={siblingCount} />
          </Pagination.Root>,
        ),
      ).toThrow(RangeError);

    for (const boundaryCount of [0, -1, 1.5, Infinity, NaN])
      expect(() =>
        renderToString(
          <Pagination.Root page={1} pageCount={3} onPageChange={() => {}}>
            <Pagination.Range boundaryCount={boundaryCount} />
          </Pagination.Root>,
        ),
      ).toThrow(RangeError);
  });

  it("does not emit for current, disabled or canceled clicks", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <Pagination.Root page={1} pageCount={3} onPageChange={change}>
        <Pagination.Page page={1} />
        <Pagination.Page
          page={2}
          onClick={(event) => {
            event.preventDefault();
          }}
        />
        <Pagination.Next disabled />
      </Pagination.Root>,
    );
    for (const button of screen.getAllByRole("button"))
      await user.click(button);
    expect(change).not.toHaveBeenCalled();
  });

  it("retains caller labels, refs and button attributes", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Pagination.Root
        page={2}
        pageCount={3}
        onPageChange={() => {}}
        aria-label="Results"
      >
        <Pagination.Previous>Précédent</Pagination.Previous>
        <Pagination.Page
          page={2}
          aria-label="Page courante"
          ref={ref}
          className="custom"
          style={{ margin: "0.25rem" }}
        />
        <Pagination.Ellipsis />
        <Pagination.Next>Suivant</Pagination.Next>
      </Pagination.Root>,
    );
    expect(
      screen.getByRole("navigation", { name: "Results" }),
    ).toBeInTheDocument();
    expect(ref.current).toBe(
      screen.getByRole("button", { name: "Page courante" }),
    );
    expect(ref.current).toHaveAttribute("type", "button");
    expect(ref.current?.style.margin).toBe("0.25rem");
    expect(screen.getByText("…")).toHaveAttribute("aria-hidden", "true");
  });

  it("handles a single page and rejects invalid ranges", () => {
    const markup = renderToString(
      <Pagination.Root page={1} pageCount={1} onPageChange={() => {}}>
        <Pagination.First />
        <Pagination.Previous />
        <Pagination.Page page={1} />
        <Pagination.Next />
        <Pagination.Last />
      </Pagination.Root>,
    );
    expect(markup.match(/disabled=""/g)).toHaveLength(4);
    for (const pageCount of [0, -1, 1.5, Infinity, NaN])
      expect(() =>
        renderToString(
          <Pagination.Root
            page={1}
            pageCount={pageCount}
            onPageChange={() => {}}
          />,
        ),
      ).toThrow(RangeError);
    expect(() =>
      renderToString(
        <Pagination.Root page={4} pageCount={3} onPageChange={() => {}} />,
      ),
    ).toThrow(RangeError);
    expect(() =>
      renderToString(
        <Pagination.Root page={1} pageCount={3} onPageChange={() => {}}>
          <Pagination.Page page={4} />
        </Pagination.Root>,
      ),
    ).toThrow(RangeError);
  });

  it("leaves the state controlled when the caller does not accept a request", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <Pagination.Root page={1} pageCount={3} onPageChange={change}>
        <Controls />
      </Pagination.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Page 2" }));
    expect(change).toHaveBeenCalledWith(2);
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
