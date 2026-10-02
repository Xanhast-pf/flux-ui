import { createRef, type ChangeEvent } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { TimePicker } from "./TimePicker.js";

describe("TimePicker", () => {
  it("preserves native time and form semantics", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <form>
        <TimePicker
          aria-label="TimePicker"
          ref={ref}
          name="time-picker"
          defaultValue="14:30"
          min="09:00"
          max="18:00"
          required
        />
      </form>,
    );

    const input = screen.getByLabelText("TimePicker");
    expect(input).toHaveAttribute("type", "time");
    expect(input).toHaveValue("14:30");
    expect(input).toBeRequired();
    expect(ref.current).toBe(input);
  });

  it("reports serialized values after native onChange unless prevented", () => {
    let prevent = false;
    const onValueChange = vi.fn();
    function onChange(event: ChangeEvent<HTMLInputElement>) {
      if (prevent) event.preventDefault();
    }
    render(
      <TimePicker
        aria-label="TimePicker"
        defaultValue="14:30"
        onChange={onChange}
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByLabelText("TimePicker");
    fireEvent.change(input, { target: { value: "15:45" } });
    expect(onValueChange).toHaveBeenCalledWith("15:45", expect.any(Object));

    prevent = true;
    fireEvent.change(input, { target: { value: "16:00" } });
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("is server safe", () => {
    const markup = renderToString(
      <TimePicker aria-label="TimePicker" value="14:30" readOnly />,
    );
    expect(markup).toContain('type="time"');
    expect(markup).toContain('value="14:30"');
  });
});
