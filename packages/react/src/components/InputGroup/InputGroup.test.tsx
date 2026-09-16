import { NumberField } from "../NumberField/NumberField.js";
import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Field } from "../Field/Field.js";
import { InputGroup } from "./InputGroup.js";
describe("InputGroup", () => {
  it("keeps Field relationships, native values and ref forwarding on the input", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Field.Root description="In US dollars.">
        <Field.Label>Amount</Field.Label>
        <InputGroup.Root className="consumer">
          <InputGroup.Addon aria-hidden="true">USD</InputGroup.Addon>
          <Field.Control>
            <InputGroup.Input
              ref={ref}
              type="number"
              defaultValue={120}
              min={0}
            />
          </Field.Control>
        </InputGroup.Root>
      </Field.Root>,
    );
    const input = screen.getByRole("spinbutton", { name: "Amount" });
    expect(input).toHaveValue(120);
    expect(input).toHaveAccessibleDescription("In US dollars.");
    expect(ref.current).toBe(input);
    expect(input.parentElement).toHaveClass("consumer");
  });
});
it("composes NumberField without replacing numeric events, refs or Field associations", () => {
  const change = vi.fn();
  const ref = createRef<HTMLInputElement>();
  render(
    <Field.Root description="Price in dollars.">
      <Field.Label>Price</Field.Label>
      <InputGroup.Root>
        <InputGroup.Addon aria-hidden="true">USD</InputGroup.Addon>
        <Field.Control>
          <NumberField
            ref={ref}
            min={0}
            defaultValue={20}
            onValueChange={change}
          />
        </Field.Control>
      </InputGroup.Root>
    </Field.Root>,
  );
  const input = screen.getByRole("spinbutton", { name: "Price" });
  expect(input).toHaveAccessibleDescription("Price in dollars.");
  expect(ref.current).toBe(input);
  fireEvent.change(input, { target: { value: "" } });
  expect(change).toHaveBeenLastCalledWith(null, expect.any(Object));
});
