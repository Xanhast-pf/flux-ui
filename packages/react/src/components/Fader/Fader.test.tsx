import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Fader } from "./Fader.js";
describe("Fader", () => {
  it("preserves native range and vertical value semantics", () => {
    const change = vi.fn();
    render(
      <Fader
        aria-label="Gain"
        name="gain"
        min={-60}
        max={0}
        defaultValue={-12}
        onValueChange={change}
      />,
    );
    const input = screen.getByRole("slider");
    expect(input).toHaveAttribute("type", "range");
    expect(input).toHaveAttribute("aria-orientation", "vertical");
    fireEvent.change(input, { target: { value: "-6" } });
    expect(change).toHaveBeenCalledWith(-6, expect.any(Object));
  });
});
