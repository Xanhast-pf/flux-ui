import { render, screen } from "@testing-library/react";
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
});
