import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Inline } from "./Inline.js";

describe("Inline", () => {
  it("supports semantic alignment helpers", () => {
    render(<Inline justify="between" wrap data-testid="inline" />);
    expect(screen.getByTestId("inline")).toHaveStyle({
      "--flux-inline-justify": "space-between",
      "--flux-inline-wrap": "wrap",
    });
  });
});
