import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
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

  it("preserves native validity, stepping, refs and styling", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <NumberField
        ref={ref}
        aria-label="Gain"
        min={0}
        max={10}
        step={0.5}
        defaultValue={2}
        required
        className="consumer-number"
        style={{ inlineSize: "8rem" }}
      />,
    );
    const input = screen.getByRole("spinbutton", { name: "Gain" });
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("type", "number");
    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("max", "10");
    expect(input).toHaveAttribute("step", "0.5");
    expect(input).toBeRequired();
    expect(input).toHaveClass("consumer-number");
    expect(input.style.inlineSize).toBe("8rem");
  });

  it("renders a native numeric input on the server", () => {
    expect(renderToString(<NumberField aria-label="Amount" />)).toContain(
      'type="number"',
    );
  });
});
