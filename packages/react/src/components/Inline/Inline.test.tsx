import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Inline } from "./Inline.js";

describe("Inline", () => {
  it("consumer styles override prop-based alignment and wrapping", () => {
    render(
      <Inline
        justify="between"
        wrap
        style={{ justifyContent: "center", flexWrap: "nowrap" }}
        data-testid="inline"
      />,
    );
    expect(screen.getByTestId("inline")).toHaveStyle({
      justifyContent: "center",
      flexWrap: "nowrap",
    });
  });

  it("supports semantic alignment helpers", () => {
    render(<Inline justify="between" wrap data-testid="inline" />);
    expect(screen.getByTestId("inline")).toHaveStyle({
      justifyContent: "space-between",
      flexWrap: "wrap",
    });
  });

  it("preserves semantic elements, refs and container-responsive ownership", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Inline
        as="nav"
        ref={ref}
        responsiveTo="container"
        aria-label="Actions"
        gap={{ base: "sm", lg: "lg" }}
        className="consumer-inline"
      />,
    );
    const inline = screen.getByRole("navigation", { name: "Actions" });
    expect(ref.current).toBe(inline);
    expect(inline).toHaveAttribute("data-r", "container");
    expect(inline).toHaveClass("consumer-inline");
    expect(inline).toHaveStyle({
      "--f-l-b": "var(--flux-space-2)",
      "--f-l-l": "var(--flux-space-6)",
    });
  });

  it("renders native server markup", () => {
    expect(renderToString(<Inline as="section" />)).toContain("<section");
  });
});
