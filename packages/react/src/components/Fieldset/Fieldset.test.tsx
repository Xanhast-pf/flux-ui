import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Fieldset } from "./Fieldset.js";
describe("Fieldset", () => {
  it("keeps native legend naming, disabled descendants and first-legend exception", () => {
    const ref = createRef<HTMLFieldSetElement>();
    render(
      <Fieldset ref={ref} disabled>
        <Fieldset.Legend>
          Shipping <input aria-label="Enable shipping" type="checkbox" />
        </Fieldset.Legend>
        <input aria-label="Street" />
      </Fieldset>,
    );
    expect(screen.getByRole("group")).toBe(ref.current);
    expect(ref.current?.querySelector("legend")?.parentElement).toBe(
      ref.current,
    );
    expect(screen.getByRole("textbox", { name: "Street" })).toBeDisabled();
    expect(
      screen.getByRole("checkbox", { name: "Enable shipping" }),
    ).not.toBeDisabled();
  });
});
