import { createRef, useState } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ToggleGroup } from "./ToggleGroup.js";
function Items() {
  return (
    <>
      <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
      <ToggleGroup.Item value="list">List</ToggleGroup.Item>
      <ToggleGroup.Item value="compact" disabled>
        Compact
      </ToggleGroup.Item>
    </>
  );
}
function Controlled() {
  const [value, setValue] = useState<string | null>("grid");
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={setValue}
      aria-label="View"
    >
      <Items />
    </ToggleGroup.Root>
  );
}
describe("ToggleGroup", () => {
  it("selects and clears a single value", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    const list = screen.getByRole("button", { name: "List" });
    await user.click(list);
    expect(list).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Grid" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    await user.click(list);
    expect(list).toHaveAttribute("aria-pressed", "false");
  });
  it("toggles multiple values without mutating caller arrays", async () => {
    const initial = Object.freeze(["grid"]);
    const change = vi.fn();
    const user = userEvent.setup();
    render(
      <ToggleGroup.Root
        type="multiple"
        defaultValue={initial}
        onValueChange={change}
        aria-label="Modes"
      >
        <Items />
      </ToggleGroup.Root>,
    );
    await user.click(screen.getByRole("button", { name: "List" }));
    expect(change).toHaveBeenLastCalledWith(["grid", "list"]);
    expect(initial).toEqual(["grid"]);
    await user.click(screen.getByRole("button", { name: "Grid" }));
    expect(change).toHaveBeenLastCalledWith(["list"]);
  });
  it("moves focus, not selection, and skips disabled options", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <ToggleGroup.Root
        type="single"
        defaultValue="grid"
        onValueChange={change}
        aria-label="View"
      >
        <Items />
      </ToggleGroup.Root>,
    );
    const grid = screen.getByRole("button", { name: "Grid" });
    const list = screen.getByRole("button", { name: "List" });
    expect(grid).toHaveAttribute("tabindex", "0");
    expect(list).toHaveAttribute("tabindex", "-1");
    grid.focus();
    await user.keyboard("{ArrowRight}");
    expect(list).toHaveFocus();
    expect(change).not.toHaveBeenCalled();
    await user.keyboard("{ArrowRight}");
    expect(grid).toHaveFocus();
    await user.keyboard("{End}");
    expect(list).toHaveFocus();
    await user.keyboard(" ");
    expect(list).toHaveAttribute("aria-pressed", "true");
  });
  it("respects vertical non-looping navigation and canceled keys", () => {
    render(
      <ToggleGroup.Root
        type="multiple"
        orientation="vertical"
        loopFocus={false}
        aria-label="Tools"
      >
        <ToggleGroup.Item
          value="one"
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") event.preventDefault();
          }}
        >
          One
        </ToggleGroup.Item>
        <ToggleGroup.Item value="two">Two</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    const one = screen.getByRole("button", { name: "One" });
    const two = screen.getByRole("button", { name: "Two" });
    one.focus();
    fireEvent.keyDown(one, { key: "ArrowDown" });
    expect(one).toHaveFocus();
    two.focus();
    fireEvent.keyDown(two, { key: "ArrowDown" });
    expect(two).toHaveFocus();
    fireEvent.keyDown(two, { key: "Home" });
    expect(one).toHaveFocus();
  });
  it("honors a declined controlled update and canceled click", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <ToggleGroup.Root
        type="single"
        value={null}
        onValueChange={change}
        aria-label="Modes"
      >
        <ToggleGroup.Item
          value="one"
          onClick={(event) => {
            event.preventDefault();
          }}
        >
          One
        </ToggleGroup.Item>
        <ToggleGroup.Item value="two">Two</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    await user.click(screen.getByRole("button", { name: "One" }));
    expect(change).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Two" }));
    expect(change).toHaveBeenCalledWith("two");
    expect(screen.getByRole("button", { name: "Two" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
  it("keeps collections isolated and restores a stop after disabling the focused item", () => {
    const { rerender } = render(
      <ToggleGroup.Root type="single" aria-label="A">
        <ToggleGroup.Item value="one">One</ToggleGroup.Item>
        <ToggleGroup.Item value="two">Two</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    screen.getByRole("button", { name: "Two" }).focus();
    rerender(
      <ToggleGroup.Root type="single" aria-label="A">
        <ToggleGroup.Item value="one">One</ToggleGroup.Item>
        <ToggleGroup.Item value="two" disabled>
          Two
        </ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    expect(screen.getByRole("button", { name: "One" })).toHaveAttribute(
      "tabindex",
      "0",
    );
    rerender(
      <>
        <ToggleGroup.Root type="single" aria-label="A">
          <Items />
        </ToggleGroup.Root>
        <ToggleGroup.Root type="single" aria-label="B">
          <Items />
        </ToggleGroup.Root>
      </>,
    );
    for (const name of ["A", "B"])
      expect(
        within(screen.getByRole("group", { name }))
          .getAllByRole("button")
          .filter((node) => node.tabIndex === 0),
      ).toHaveLength(1);
  });
  it("disables the whole group and preserves root and item refs", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const rootRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLButtonElement>();
    render(
      <ToggleGroup.Root
        type="single"
        disabled
        ref={rootRef}
        aria-label="View"
        onValueChange={change}
      >
        <ToggleGroup.Item ref={itemRef} value="grid" className="custom">
          Grid
        </ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    expect(rootRef.current).toBe(screen.getByRole("group"));
    expect(itemRef.current).toBeDisabled();
    expect(itemRef.current).toHaveClass("custom");
    await user.click(screen.getByRole("button"));
    expect(change).not.toHaveBeenCalled();
  });
  it("makes aria-disabled items unavailable to focus and selection", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <ToggleGroup.Root type="single" aria-label="View" onValueChange={change}>
        <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
        <ToggleGroup.Item value="list" aria-disabled>
          List
        </ToggleGroup.Item>
        <ToggleGroup.Item value="compact">Compact</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    const grid = screen.getByRole("button", { name: "Grid" });
    grid.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Compact" })).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "List" }));
    expect(change).not.toHaveBeenCalled();
  });
  it("renders deterministic pressed states on the server", () => {
    const markup = renderToString(
      <ToggleGroup.Root
        type="multiple"
        defaultValue={["grid"]}
        aria-label="Modes"
      >
        <Items />
      </ToggleGroup.Root>,
    );
    expect(markup).toContain('aria-pressed="true"');
    expect(markup).not.toContain("loopFocus=");
    expect(markup).not.toContain('type="multiple"');
  });
});
