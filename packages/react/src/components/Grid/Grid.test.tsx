import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Grid } from "./Grid.js";

describe("Grid", () => {
  it("renders direct children without requiring item wrappers", () => {
    render(
      <Grid columns={2} data-testid="grid">
        <span>One</span>
        <span>Two</span>
      </Grid>,
    );

    expect(screen.getByTestId("grid")).toHaveStyle({
      "--flux-grid-columns-base": "2",
    });
    expect(screen.getByText("One")).toBeInTheDocument();
  });

  it("supports breakpoint-free auto-fit columns", () => {
    render(<Grid minColumnWidth="15rem" data-testid="grid" />);
    expect(screen.getByTestId("grid")).toHaveStyle({
      "--flux-grid-min-column": "15rem",
    });
  });

  it("supports full-width item spans", () => {
    render(<Grid.Item colSpan="full" data-testid="item" />);
    expect(screen.getByTestId("item")).toHaveStyle({
      "--flux-grid-item-column-base": "1 / -1",
    });
  });
});
