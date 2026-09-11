import { render, screen } from "@testing-library/react";
import { createRef } from "react";
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
});
