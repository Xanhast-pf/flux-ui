import { render, screen } from "@testing-library/react";
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
});
