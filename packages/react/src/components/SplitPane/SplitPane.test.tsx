import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SplitPane } from "./SplitPane.js";
describe("SplitPane", () => {
  it("has a named keyboard-resizable separator with percentage limits", () => {
    const commit = vi.fn();
    render(
      <SplitPane
        label="Resize workspace"
        first="First"
        second="Second"
        defaultValue={40}
        min={20}
        max={75}
        onValueCommit={commit}
      />,
    );
    const handle = screen.getByRole("separator", { name: "Resize workspace" });
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    expect(handle).toHaveAttribute("aria-valuenow", "45");
    fireEvent.keyUp(handle, { key: "ArrowRight" });
    expect(commit).toHaveBeenLastCalledWith(45);
    fireEvent.keyDown(handle, { key: "Home" });
    expect(handle).toHaveAttribute("aria-valuenow", "20");
    fireEvent.keyDown(handle, { key: "End" });
    expect(handle).toHaveAttribute("aria-valuenow", "75");
  });
  it("preserves a controlled value and changes the separator axis for stacked panes", () => {
    const change = vi.fn();
    render(
      <SplitPane
        label="Resize"
        first="First"
        second="Second"
        orientation="vertical"
        value={50}
        onValueChange={change}
      />,
    );
    const handle = screen.getByRole("separator");
    expect(handle).toHaveAttribute("aria-orientation", "horizontal");
    fireEvent.keyDown(handle, { key: "ArrowDown" });
    expect(change).toHaveBeenCalledWith(55);
    expect(handle).toHaveAttribute("aria-valuenow", "50");
  });
});

describe("SplitPane hardening", () => {
  it("respects modified shortcuts and capture-phase cancellation", () => {
    const change = vi.fn();
    render(
      <SplitPane
        label="Shortcut-safe panes"
        first="First"
        second="Second"
        onValueChange={change}
        onKeyDownCapture={(event) => {
          if (event.key === "End") event.preventDefault();
        }}
      />,
    );
    const handle = screen.getByRole("separator");
    for (const modifier of ["ctrlKey", "altKey", "metaKey"])
      fireEvent.keyDown(handle, { key: "ArrowRight", [modifier]: true });
    fireEvent.keyDown(handle, { key: "End" });
    expect(change).not.toHaveBeenCalled();
  });
});
