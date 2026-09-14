import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { knobFraction, knobValue, validateKnob } from "./knobMath.js";
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

describe("Knob hardening", () => {
  it("reaches the true maximum even with a non-dividing step", () => {
    render(
      <Knob
        aria-label="Uneven steps"
        min={0}
        max={10}
        step={3}
        defaultValue={3}
      />,
    );
    const knob = screen.getByRole("slider");
    fireEvent.keyDown(knob, { key: "End" });
    expect(knob).toHaveAttribute("aria-valuenow", "10");
    fireEvent.keyDown(knob, { key: "ArrowDown" });
    expect(knob).toHaveAttribute("aria-valuenow", "9");
    fireEvent.keyDown(knob, { key: "Home" });
    expect(knob).toHaveAttribute("aria-valuenow", "0");
  });
  it("does not consume modified shortcuts", () => {
    const change = vi.fn();
    render(
      <Knob
        aria-label="Shortcut-safe gain"
        value={40}
        onValueChange={change}
      />,
    );
    const knob = screen.getByRole("slider");
    for (const modifier of ["ctrlKey", "altKey", "metaKey"])
      fireEvent.keyDown(knob, { key: "ArrowUp", [modifier]: true });
    expect(change).not.toHaveBeenCalled();
  });
});

describe("Knob range conversion", () => {
  it.each(["linear", "log"] as const)(
    "preserves %s endpoints and interior values",
    (scale) => {
      for (const [min, max] of [
        [0.1, 1.05],
        [20, 20000],
        [1e16, 1e16 + 100],
      ] as const) {
        for (const fraction of [
          -Infinity,
          -1,
          0,
          0.1,
          0.5,
          0.9,
          1,
          2,
          Infinity,
        ]) {
          const expected =
            fraction <= 0
              ? min
              : fraction >= 1
                ? max
                : scale === "log"
                  ? Math.exp(
                      Math.log(min) +
                        fraction * (Math.log(max) - Math.log(min)),
                    )
                  : min + fraction * (max - min);
          expect(knobValue(fraction, min, max, scale)).toBe(expected);
        }
        for (const value of [
          -Infinity,
          min - 1,
          min,
          min + (max - min) / 2,
          max,
          max + 1,
          Infinity,
        ]) {
          const expected =
            value <= min
              ? 0
              : value >= max
                ? 1
                : scale === "log"
                  ? (Math.log(value) - Math.log(min)) /
                    (Math.log(max) - Math.log(min))
                  : (value - min) / (max - min);
          expect(knobFraction(value, min, max, scale)).toBe(expected);
        }
        expect(knobValue(NaN, min, max, scale)).toBeNaN();
        expect(knobFraction(NaN, min, max, scale)).toBeNaN();
      }
    },
  );
  it("rejects collapsed logarithms and invalid ranges", () => {
    expect(() => validateKnob(1e20, 1e20 + 16384, 1, "log")).toThrow(
      RangeError,
    );
    expect(() => validateKnob(-1e308, 1e308, 1, "linear")).toThrow(RangeError);
    expect(() => validateKnob(0, 1, Number.MIN_VALUE, "linear")).toThrow(
      RangeError,
    );
    expect(() => validateKnob(0.1, 1.05, 0.3, "log")).not.toThrow();
  });
});

describe("Knob pointer hardening", () => {
  function pointer(target: HTMLElement, type: string, id: number, y = 100) {
    const event = new Event(type, { bubbles: true, cancelable: true });
    Object.assign(event, {
      pointerId: id,
      clientY: y,
      button: 0,
      isPrimary: true,
    });
    fireEvent(target, event);
  }
  it.each(["pointercancel", "lostpointercapture"])(
    "rolls back only the active pointer on %s",
    (type) => {
      const commit = vi.fn();
      render(
        <Knob aria-label="Drag" defaultValue={50} onValueCommit={commit} />,
      );
      const knob = screen.getByRole("slider");
      knob.setPointerCapture = vi.fn();
      pointer(knob, "pointerdown", 1);
      pointer(knob, "pointermove", 2, 20);
      expect(knob).toHaveAttribute("aria-valuenow", "50");
      pointer(knob, "pointermove", 1, 20);
      expect(knob).toHaveAttribute("aria-valuenow", "100");
      pointer(knob, type, 2);
      expect(knob).toHaveAttribute("aria-valuenow", "100");
      pointer(knob, type, 1);
      expect(knob).toHaveAttribute("aria-valuenow", "50");
      expect(commit).not.toHaveBeenCalled();
    },
  );
  it.each(["pointermove", "pointerup"])(
    "rolls back when disabled before %s",
    (type) => {
      const commit = vi.fn();
      const view = render(
        <Knob aria-label="Drag" defaultValue={50} onValueCommit={commit} />,
      );
      const knob = screen.getByRole("slider");
      knob.setPointerCapture = vi.fn();
      knob.hasPointerCapture = () => false;
      pointer(knob, "pointerdown", 1);
      pointer(knob, "pointermove", 1, 20);
      view.rerender(
        <Knob
          aria-label="Drag"
          defaultValue={50}
          disabled
          onValueCommit={commit}
        />,
      );
      pointer(knob, type, 1, 10);
      expect(knob).toHaveAttribute("aria-valuenow", "50");
      expect(knob).toHaveAttribute("aria-disabled", "true");
      expect(commit).not.toHaveBeenCalled();
    },
  );
});

describe("Knob keyboard directions", () => {
  it.each([
    ["ArrowUp", 3, 6],
    ["ArrowRight", 3, 6],
    ["PageUp", 3, 10],
    ["ArrowDown", 10, 9],
    ["ArrowLeft", 10, 9],
    ["PageDown", 10, 0],
    ["Home", 3, 0],
    ["End", 3, 10],
    ["Escape", 3, 3],
  ] as const)("handles %s from %s", (key, initial, expected) => {
    render(
      <Knob
        aria-label="Steps"
        min={0}
        max={10}
        step={3}
        defaultValue={initial}
      />,
    );
    fireEvent.keyDown(screen.getByRole("slider"), { key });
    expect(screen.getByRole("slider")).toHaveAttribute(
      "aria-valuenow",
      String(expected),
    );
  });
});
