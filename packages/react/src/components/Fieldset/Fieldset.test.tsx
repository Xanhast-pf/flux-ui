import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
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

  it("preserves native root and legend refs, styles and attributes", () => {
    const rootRef = createRef<HTMLFieldSetElement>();
    const legendRef = createRef<HTMLLegendElement>();
    render(
      <Fieldset
        ref={rootRef}
        name="preferences"
        className="consumer-fieldset"
        style={{ margin: "1rem" }}
      >
        <Fieldset.Legend ref={legendRef} className="consumer-legend">
          Preferences
        </Fieldset.Legend>
      </Fieldset>,
    );
    expect(rootRef.current).toBe(screen.getByRole("group"));
    expect(rootRef.current).toHaveAttribute("name", "preferences");
    expect(rootRef.current).toHaveClass("consumer-fieldset");
    expect(rootRef.current?.style.margin).toBe("1rem");
    expect(legendRef.current).toBe(screen.getByText("Preferences"));
    expect(legendRef.current).toHaveClass("consumer-legend");
  });

  it("renders native fieldset and legend markup on the server", () => {
    const markup = renderToString(
      <Fieldset>
        <Fieldset.Legend>Preferences</Fieldset.Legend>
      </Fieldset>,
    );
    expect(markup).toContain("<fieldset");
    expect(markup).toContain("<legend");
  });
});
