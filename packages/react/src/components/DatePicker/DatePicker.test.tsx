import { createRef, type ChangeEvent } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { DatePicker } from "./DatePicker.js";

describe("DatePicker", () => {
  it("preserves native date and form semantics", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <form>
        <DatePicker
          aria-label="DatePicker"
          ref={ref}
          name="date-picker"
          defaultValue="2026-10-01"
          min="2026-01-01"
          max="2026-12-31"
          required
        />
      </form>,
    );

    const input = screen.getByLabelText("DatePicker");
    expect(input).toHaveAttribute("type", "date");
    expect(input).toHaveAttribute("name", "date-picker");
    expect(input).toHaveValue("2026-10-01");
    expect(input).toBeRequired();
    expect(ref.current).toBe(input);
  });

  it("reports serialized values after native onChange unless prevented", () => {
    let prevent = false;
    let changes = 0;
    const onValueChange = vi.fn();
    function onChange(event: ChangeEvent<HTMLInputElement>) {
      changes += 1;
      if (prevent) event.preventDefault();
    }
    render(
      <DatePicker
        aria-label="DatePicker"
        defaultValue="2026-10-01"
        onChange={onChange}
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByLabelText("DatePicker");
    fireEvent.change(input, { target: { value: "" } });
    expect(changes).toBe(1);
    expect(onValueChange).toHaveBeenCalledWith("", expect.any(Object));

    prevent = true;
    fireEvent.change(input, { target: { value: "2026-10-01" } });
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("is server safe", () => {
    const markup = renderToString(
      <DatePicker aria-label="DatePicker" value="2026-10-01" readOnly />,
    );
    expect(markup).toContain('type="date"');
    expect(markup).toContain('value="2026-10-01"');
  });
});
