import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Slider } from "./Slider.js";
describe("Slider", () => {
  it("keeps native range attributes, refs and consumer styling", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Slider
        ref={ref}
        aria-label="Traffic"
        defaultValue={25}
        min={0}
        max={100}
        step={5}
        className="custom"
        style={{ margin: "0.25rem" }}
      />,
    );
    const slider = screen.getByRole("slider");
    expect(ref.current).toBe(slider);
    expect(slider).toHaveAttribute("type", "range");
    expect(slider).toHaveAttribute("step", "5");
    expect(slider).toHaveValue("25");
    expect(slider).toHaveClass("custom");
    expect(slider.style.margin).toBe("0.25rem");
  });
  it("reports a number and preserves the native change event", () => {
    const native = vi.fn();
    const change = vi.fn();
    render(
      <Slider
        aria-label="Traffic"
        defaultValue={25}
        onChange={native}
        onValueChange={change}
      />,
    );
    fireEvent.change(screen.getByRole("slider"), { target: { value: "30" } });
    expect(native).toHaveBeenCalledOnce();
    expect(change).toHaveBeenCalledWith(
      30,
      expect.objectContaining({ type: "change" }),
    );
  });
  it("honors native callback cancellation", () => {
    const change = vi.fn();
    render(
      <Slider
        aria-label="Traffic"
        defaultValue={25}
        onChange={(event) => {
          event.preventDefault();
        }}
        onValueChange={change}
      />,
    );
    fireEvent.change(screen.getByRole("slider"), { target: { value: "30" } });
    expect(change).not.toHaveBeenCalled();
  });
  it("keeps native form values and reset", () => {
    render(
      <form aria-label="Release">
        <Slider aria-label="Traffic" name="traffic" defaultValue={25} />
      </form>,
    );
    const form = screen.getByRole<HTMLFormElement>("form");
    fireEvent.change(screen.getByRole("slider"), { target: { value: "50" } });
    expect(new FormData(form).get("traffic")).toBe("50");
    form.reset();
    expect(screen.getByRole("slider")).toHaveValue("25");
  });
  it("preserves disabled and server-rendered attributes", () => {
    render(<Slider aria-label="Traffic" disabled />);
    expect(screen.getByRole("slider")).toBeDisabled();
    expect(renderToString(<Slider defaultValue={25} />)).toContain(
      'type="range"',
    );
  });
});
