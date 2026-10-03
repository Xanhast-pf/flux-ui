import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Separator } from "./Separator.js";
describe("Separator", () => {
  it("is a horizontal semantic divider by default", () => {
    render(<Separator />);
    const separator = screen.getByRole("separator");
    expect(separator).toHaveAttribute("aria-orientation", "horizontal");
    expect(separator).toHaveAttribute("data-orientation", "horizontal");
  });
  it("supports vertical dividers", () => {
    render(<Separator orientation="vertical" />);
    const separator = screen.getByRole("separator");
    expect(separator).toHaveAttribute("aria-orientation", "vertical");
    expect(separator).toHaveAttribute("data-orientation", "vertical");
  });
  it("keeps decoration out of the separator roles", () => {
    render(<Separator decorative />);
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    const decorative = screen.getByRole("none");
    expect(decorative).not.toHaveAttribute("aria-orientation");
    expect(decorative).toHaveAttribute("data-orientation", "horizontal");
  });
  it("forwards refs and classes", () => {
    const ref = createRef<HTMLHRElement>();
    render(<Separator ref={ref} className="custom" />);
    expect(ref.current).toBe(screen.getByRole("separator"));
    expect(ref.current).toHaveClass("custom");
  });
});
