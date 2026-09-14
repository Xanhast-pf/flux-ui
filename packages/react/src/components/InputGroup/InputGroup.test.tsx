import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
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
