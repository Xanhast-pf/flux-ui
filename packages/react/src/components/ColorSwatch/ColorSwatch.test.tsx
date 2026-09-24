import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ColorSwatch } from "./ColorSwatch.js";

describe("ColorSwatch", () => {
  it("is decorative presentation, not an unnamed selection control", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <ColorSwatch color="#123456" selected ref={ref} data-testid="swatch" />,
    );
    expect(screen.getByTestId("swatch")).toBe(ref.current);
    expect(ref.current).toHaveAttribute("aria-hidden", "true");
    expect(ref.current?.style.getPropertyValue("--flux-swatch-color")).toBe(
      "#123456",
    );
    expect(screen.queryByRole("button")).toBeNull();
    expect(ref.current).not.toHaveAttribute("tabindex");
  });

  it("preserves its color variable, consumer styles and visual data", () => {
    render(
      <ColorSwatch
        color="#123456"
        data-testid="swatch"
        size="lg"
        className="consumer-swatch"
        style={{ margin: "0.25rem" }}
      />,
    );
    const swatch = screen.getByTestId("swatch");
    expect(swatch.style.getPropertyValue("--flux-swatch-color")).toBe(
      "#123456",
    );
    expect(swatch.style.margin).toBe("0.25rem");
    expect(swatch).toHaveAttribute("data-size", "lg");
    expect(swatch).toHaveClass("consumer-swatch");
    expect(swatch).not.toHaveAttribute("data-selected");
  });

  it("renders decorative server markup", () => {
    const markup = renderToString(<ColorSwatch color="#123456" />);
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).not.toContain("tabindex");
  });
});
