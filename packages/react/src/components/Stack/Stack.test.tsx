import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Stack } from "./Stack.js";

describe("Stack", () => {
  it("preserves native semantics and lets style override alignment and gap", () => {
    render(
      <Stack
        as="section"
        aria-label="Summary"
        align="center"
        gap="sm"
        padding="md"
        style={{ alignItems: "flex-end", gap: "2rem", padding: "3rem" }}
      />,
    );
    const element = screen.getByRole("region", { name: "Summary" });
    expect(element.tagName).toBe("SECTION");
    expect(element.style.alignItems).toBe("flex-end");
    expect(element.style.gap).toBe("2rem");
    expect(element.style.padding).toBe("3rem");
  });

  it("maps gap tokens to responsive CSS variables", () => {
    render(<Stack gap={{ base: "sm", lg: "xl" }} data-testid="stack" />);
    expect(screen.getByTestId("stack")).toHaveStyle({
      "--f-l-b": "var(--flux-space-2)",
      "--f-l-l": "var(--flux-space-8)",
    });
  });

  it("preserves refs and marks container-responsive layout explicitly", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Stack
        as="aside"
        ref={ref}
        responsiveTo="container"
        aria-label="Inspector"
        className="consumer-stack"
      />,
    );
    const stack = screen.getByRole("complementary", { name: "Inspector" });
    expect(ref.current).toBe(stack);
    expect(stack).toHaveAttribute("data-r", "container");
    expect(stack).toHaveClass("consumer-stack");
  });

  it("renders semantic server markup", () => {
    expect(renderToString(<Stack as="section" />)).toContain("<section");
  });
});
