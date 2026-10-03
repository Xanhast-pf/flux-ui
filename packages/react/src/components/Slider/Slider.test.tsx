import { createRef } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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
  it("reports a semantic number after the native change event", () => {
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
    expect(change).toHaveBeenCalledWith(30);
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
  it("renders native datalist marks and mirrors controlled value output", () => {
    const view = render(
      <Slider
        aria-label="Volume"
        value={40}
        onChange={() => {}}
        marks={[0, { value: 50, label: "Half" }, 100]}
        showValue
        formatValue={(value) => `${value}%`}
      />,
    );
    const input = screen.getByRole("slider");
    const listId = input.getAttribute("list");
    expect(listId).toBeTruthy();
    const datalist = document.getElementById(listId ?? "");
    expect(datalist?.tagName).toBe("DATALIST");
    expect(datalist?.querySelectorAll("option")).toHaveLength(3);
    expect(datalist?.querySelector("option[value='50']")).toHaveAttribute(
      "label",
      "Half",
    );
    const output = document.querySelector("output");
    expect(output).toHaveTextContent("40%");
    expect(output).toHaveAttribute("aria-hidden", "true");

    fireEvent.change(input, { target: { value: "45" } });
    expect(output).toHaveTextContent("40%");

    view.rerender(
      <Slider
        aria-label="Volume"
        value={45}
        onChange={() => {}}
        marks={[0, { value: 50, label: "Half" }, 100]}
        showValue
        formatValue={(value) => `${value}%`}
      />,
    );
    expect(document.querySelector("output")).toHaveTextContent("45%");
  });

  it("mirrors uncontrolled output and resets it with the native form", async () => {
    render(
      <form aria-label="Mixer">
        <Slider
          aria-label="Gain"
          name="gain"
          defaultValue={20}
          showValue
          formatValue={(value) => `${value}%`}
        />
      </form>,
    );
    const input = screen.getByRole("slider");
    const output = document.querySelector("output");
    expect(output).toHaveTextContent("20%");

    fireEvent.change(input, { target: { value: "55" } });
    expect(output).toHaveTextContent("55%");

    screen.getByRole<HTMLFormElement>("form").reset();
    expect(input).toHaveValue("20");
    await waitFor(() => {
      expect(output).toHaveTextContent("20%");
    });
  });

  it("rejects conflicting or invalid native mark contracts", () => {
    expect(() =>
      render(<Slider aria-label="Marks" marks={[0, 50]} list="external" />),
    ).toThrow(TypeError);
    expect(() =>
      render(<Slider aria-label="Marks" marks={[0, Number.NaN]} />),
    ).toThrow(RangeError);
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
    expect(change).toHaveBeenCalledExactlyOnceWith(25);
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
    expect(change).toHaveBeenCalledExactlyOnceWith(20);
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
