import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Text } from "./Text.js";
describe("Text", () => {
  it("defaults to inline text and preserves literal children", () => {
    render(<Text>{"<em>Literal</em>"}</Text>);
    expect(screen.getByText("<em>Literal</em>").tagName).toBe("SPAN");
    expect(document.querySelector("em")).toBeNull();
  });
  it("retains semantic time attributes, refs and presentation escape hatches", () => {
    const ref = createRef<HTMLTimeElement>();
    render(
      <Text
        as="time"
        dateTime="2026-09-11"
        ref={ref}
        variant="caption"
        tone="muted"
        numeric
        className="custom"
      >
        September 11
      </Text>,
    );
    expect(ref.current).toHaveAttribute("datetime", "2026-09-11");
    expect(ref.current).toHaveClass("custom");
    expect(ref.current).not.toHaveAttribute("numeric");
    expect(ref.current).not.toHaveAttribute("tone");
  });
  it("exposes text emphasis without leaking styling props to the DOM", () => {
    render(
      <Text italic decoration="line-through" data-testid="emphasis">
        Archived
      </Text>,
    );
    const text = screen.getByTestId("emphasis");
    expect(text).not.toHaveAttribute("italic");
    expect(text).not.toHaveAttribute("decoration");
    expect(text).toHaveAttribute("data-italic", "true");
    expect(text).toHaveAttribute("data-decoration", "line-through");
  });
});
