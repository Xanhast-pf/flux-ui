import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Knob } from "./Knob.js";
describe("Knob", () => {
  it("supports keyboard steps, fine mode, endpoints and commits", () => {
    const commit = vi.fn();
    render(
      <Knob
        aria-label="Pan"
        min={-100}
        max={100}
        step={10}
        defaultValue={0}
        onValueCommit={commit}
      />,
    );
    const knob = screen.getByRole("slider");
    fireEvent.keyDown(knob, { key: "ArrowRight" });
    expect(knob).toHaveAttribute("aria-valuenow", "10");
    fireEvent.keyUp(knob, { key: "ArrowRight" });
    expect(commit).toHaveBeenLastCalledWith(10);
    fireEvent.keyDown(knob, { key: "ArrowRight", shiftKey: true });
    expect(knob).toHaveAttribute("aria-valuenow", "11");
    fireEvent.keyDown(knob, { key: "Home" });
    expect(knob).toHaveAttribute("aria-valuenow", "-100");
  });
  it("does not mutate a controlled value and ignores disabled input", () => {
    const change = vi.fn();
    const view = render(
      <Knob aria-label="Gain" value={40} onValueChange={change} />,
    );
    const knob = screen.getByRole("slider");
    fireEvent.keyDown(knob, { key: "ArrowUp" });
    expect(change).toHaveBeenCalledWith(41);
    expect(knob).toHaveAttribute("aria-valuenow", "40");
    view.rerender(
      <Knob aria-label="Gain" value={40} disabled onValueChange={change} />,
    );
    change.mockClear();
    fireEvent.keyDown(knob, { key: "ArrowUp" });
    expect(change).not.toHaveBeenCalled();
    expect(knob).toHaveAttribute("tabindex", "-1");
  });
});
