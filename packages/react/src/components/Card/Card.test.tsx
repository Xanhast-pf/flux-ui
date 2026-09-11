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
  it("leaves default padding in CSS so a consumer class can override it", () => {
    render(<Card className="consumer-card">Padded by CSS</Card>);
    const element = screen.getByText("Padded by CSS");
    expect(element.style.padding).toBe("");
    expect(element.style.paddingInline).toBe("");
  });
  it("lets a consumer shorthand override explicit spacing axes", () => {
    render(
      <Card padding="md" paddingInline="lg" style={{ padding: "3rem" }}>
        Consumer spacing
      </Card>,
    );
    const element = screen.getByText("Consumer spacing");
    expect(element.style.padding).toBe("3rem");
    expect(element.style.paddingInline).toBe("");
  });
  it("renders on the server", () => {
    expect(renderToString(<Card>Server content</Card>)).toContain(
      "Server content",
    );
  });
});
