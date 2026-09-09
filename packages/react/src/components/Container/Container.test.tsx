import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Container } from "./Container.js";

describe("Container", () => {
  it("preserves consumer className", () => {
    render(<Container className="consumer" data-testid="container" />);
    expect(screen.getByTestId("container")).toHaveClass("consumer");
  });
});
