import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Stack } from "./Stack.js";

describe("Stack", () => {
  it("maps gap tokens to responsive CSS variables", () => {
    render(<Stack gap={{ base: "sm", lg: "xl" }} data-testid="stack" />);
    expect(screen.getByTestId("stack")).toHaveStyle({
      "--flux-stack-gap-base": "var(--flux-space-2)",
      "--flux-stack-gap-lg": "var(--flux-space-8)",
    });
  });
});
