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
describe("Slider refinement", () => {
  it("exposes vertical custom appearance without replacing the native input", () => {
    render(
      <Slider
        aria-label="Level"
        orientation="vertical"
        appearance="custom"
        style={{
          "--flux-slider-length": "12rem",
          "--flux-slider-thumb-radius": "0.25rem",
        }}
      />,
    );
    const input = screen.getByRole("slider");
    expect(input).toHaveAttribute("type", "range");
    expect(input).toHaveAttribute("aria-orientation", "vertical");
    expect(input).toHaveAttribute("data-appearance", "custom");
    expect(input.style.getPropertyValue("--flux-slider-length")).toBe("12rem");
  });
  it("resets to the mount-time position, even after the default prop changes", () => {
    const change = vi.fn();
    const view = render(
      <Slider aria-label="Level" defaultValue={25} onValueChange={change} />,
    );
    const input = screen.getByRole("slider");
    fireEvent.change(input, { target: { value: "80" } });
    view.rerender(
      <Slider aria-label="Level" defaultValue={45} onValueChange={change} />,
    );
    change.mockClear();
    fireEvent.doubleClick(input);
    expect(input).toHaveValue("25");
    expect(change).toHaveBeenCalledExactlyOnceWith(
      25,
      expect.objectContaining({
        type: "change",
      }),
    );
    fireEvent.doubleClick(input);
    expect(change).toHaveBeenCalledTimes(1);
  });
  it("requests controlled reset through the real change event without overruling the parent", () => {
    const native = vi.fn();
    const change = vi.fn();
    render(
      <Slider
        aria-label="Owned"
        value={70}
        resetValue={20}
        onChange={native}
        onValueChange={change}
      />,
    );
    const input = screen.getByRole("slider");
    fireEvent.doubleClick(input);
    expect(native).toHaveBeenCalledOnce();
    expect(change).toHaveBeenCalledExactlyOnceWith(
      20,
      expect.objectContaining({
        type: "change",
      }),
    );
    expect(input).toHaveValue("70");
  });
  it("does not invent a controlled reset target", () => {
    const change = vi.fn();
    render(<Slider aria-label="Owned" value={70} onValueChange={change} />);
    fireEvent.doubleClick(screen.getByRole("slider"));
    expect(change).not.toHaveBeenCalled();
  });
  it("preserves cancellation in both the reset shortcut and the change pipeline", () => {
    const change = vi.fn();
    const view = render(
      <Slider
        aria-label="Owned"
        value={70}
        resetValue={20}
        onValueChange={change}
        onDoubleClick={(event) => event.preventDefault()}
      />,
    );
    fireEvent.doubleClick(screen.getByRole("slider"));
    expect(change).not.toHaveBeenCalled();
    view.rerender(
      <Slider
        aria-label="Owned"
        value={70}
        resetValue={20}
        onValueChange={change}
        onChange={(event) => event.preventDefault()}
      />,
    );
    fireEvent.doubleClick(screen.getByRole("slider"));
    expect(change).not.toHaveBeenCalled();
    expect(screen.getByRole("slider")).toHaveValue("70");
  });
  it("does not reset disabled controls", () => {
    const change = vi.fn();
    render(
      <Slider
        aria-label="Level"
        defaultValue={70}
        disabled
        resetValue={20}
        onValueChange={change}
      />,
    );
    fireEvent.doubleClick(screen.getByRole("slider"));
    expect(change).not.toHaveBeenCalled();
    expect(screen.getByRole("slider")).toHaveValue("70");
  });
  it("captures the native default midpoint and preserves callback-ref cleanup", () => {
    const cleanup = vi.fn();
    const ref = vi.fn(() => cleanup);
    const view = render(<Slider ref={ref} aria-label="Level" />);
    const input = screen.getByRole("slider");
    fireEvent.change(input, { target: { value: "90" } });
    fireEvent.doubleClick(input);
    expect(input).toHaveValue("50");
    view.rerender(<Slider ref={ref} aria-label="New label" />);
    expect(ref).toHaveBeenCalledOnce();
    view.unmount();
    expect(cleanup).toHaveBeenCalledOnce();
  });
});
