import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Separator } from "./Separator.js";
describe("Separator", () => {
  it("is a horizontal semantic divider by default", () => {
    render(<Separator />);
    expect(screen.getByRole("separator")).toHaveAttribute(
      "aria-orientation",
      "horizontal",
    );
  });
  it("supports vertical dividers", () => {
    render(<Separator orientation="vertical" />);
    expect(screen.getByRole("separator")).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );
  });
  it("keeps decoration out of the separator roles", () => {
    render(<Separator decorative />);
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    expect(screen.getByRole("none")).not.toHaveAttribute("aria-orientation");
  });
  it("forwards refs and classes", () => {
    const ref = createRef<HTMLHRElement>();
    render(<Separator ref={ref} className="custom" />);
    expect(ref.current).toBe(screen.getByRole("separator"));
    expect(ref.current).toHaveClass("custom");
  });
});
