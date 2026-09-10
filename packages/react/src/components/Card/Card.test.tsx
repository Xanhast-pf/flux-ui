import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Card } from "./Card.js";
describe("Card", () => {
  it("preserves content, classes, inline styles, data and refs", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Card
        ref={ref}
        className="custom"
        style={{ margin: "0.25rem" }}
        data-project="flux"
      >
        Example
      </Card>,
    );
    const element = screen.getByText("Example");
    expect(element).toHaveClass("custom");
    expect(element.style.margin).toBe("0.25rem");
    expect(element).toHaveAttribute("data-project", "flux");
    expect(ref.current).toBe(element);
  });
  it("does not invent a landmark or a tab stop", () => {
    render(<Card>Example</Card>);
    expect(screen.getByText("Example")).not.toHaveAttribute("role");
    expect(screen.getByText("Example")).not.toHaveAttribute("tabindex");
  });
  it("renders on the server", () => {
    expect(renderToString(<Card>Server content</Card>)).toContain(
      "Server content",
    );
  });
});
