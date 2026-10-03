import { createRef, type ChangeEvent } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { DateTimePicker } from "./DateTimePicker.js";

describe("DateTimePicker", () => {
  it("preserves native local datetime and form semantics", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <form>
        <DateTimePicker
          aria-label="DateTimePicker"
          ref={ref}
          name="date-time-picker"
          defaultValue="2026-10-01T14:30"
          min="2026-10-01T09:00"
          max="2026-10-01T18:00"
          required
        />
      </form>,
    );

    const input = screen.getByLabelText("DateTimePicker");
    expect(input).toHaveAttribute("type", "datetime-local");
    expect(input).toHaveValue("2026-10-01T14:30");
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
      <DateTimePicker
        aria-label="DateTimePicker"
        defaultValue="2026-10-01T14:30"
        onChange={onChange}
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByLabelText("DateTimePicker");
    fireEvent.change(input, { target: { value: "2026-10-01T15:45" } });
    expect(onValueChange).toHaveBeenCalledWith("2026-10-01T15:45");

    prevent = true;
    fireEvent.change(input, { target: { value: "2026-10-01T16:00" } });
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("is server safe", () => {
    const markup = renderToString(
      <DateTimePicker
        aria-label="DateTimePicker"
        value="2026-10-01T14:30"
        readOnly
      />,
    );
    expect(markup).toContain('type="datetime-local"');
    expect(markup).toContain('value="2026-10-01T14:30"');
  });
});
