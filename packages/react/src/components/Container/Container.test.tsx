import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Container } from "./Container.js";

describe("Container", () => {
  it("preserves consumer className", () => {
    render(<Container className="consumer" data-testid="container" />);
    expect(screen.getByTestId("container")).toHaveClass("consumer");
  });

  it("preserves semantic elements, refs, sizing state and query ownership", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Container
        as="main"
        ref={ref}
        size="md"
        query
        aria-label="Workspace"
        style={{ marginInline: "auto" }}
      />,
    );
    const container = screen.getByRole("main", { name: "Workspace" });
    expect(ref.current).toBe(container);
    expect(container).toHaveAttribute("data-size", "md");
    expect(container).toHaveAttribute("data-query", "true");
    expect(container.style.marginInline).toBe("auto");
    expect(container).not.toHaveAttribute("size");
    expect(container).not.toHaveAttribute("query");
  });

  it("renders server-safe native markup", () => {
    const markup = renderToString(<Container as="section" size="full" />);
    expect(markup).toContain("<section");
    expect(markup).toContain('data-size="full"');
  });
});
