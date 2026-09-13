import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NumberField } from "./NumberField.js";
describe("NumberField", () => {
  it("keeps a native number input and reports empty as null", () => {
    const change = vi.fn();
    render(
      <NumberField
        aria-label="Tempo"
        name="bpm"
        min={40}
        max={240}
        defaultValue={120}
        onValueChange={change}
      />,
    );
    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "140" } });
    expect(change).toHaveBeenLastCalledWith(140, expect.any(Object));
    fireEvent.change(input, { target: { value: "" } });
    expect(change).toHaveBeenLastCalledWith(null, expect.any(Object));
    expect(input).toHaveAttribute("name", "bpm");
  });
  it("allows native onChange to cancel the convenience callback", () => {
    const change = vi.fn();
    render(
      <NumberField
        aria-label="Tempo"
        onChange={(event) => event.preventDefault()}
        onValueChange={change}
      />,
    );
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "2" },
    });
    expect(change).not.toHaveBeenCalled();
  });
});
