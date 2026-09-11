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
      "--f-k-b": "repeat(2, minmax(0, 1fr))",
    });
    expect(screen.getByText("One")).toBeInTheDocument();
  });

  it("supports breakpoint-free auto-fit columns", () => {
    render(<Grid minColumnWidth="15rem" data-testid="grid" />);
    expect(screen.getByTestId("grid")).toHaveStyle({
      "--f-k-b": "repeat(auto-fit, minmax(min(100%, 15rem), 1fr))",
    });
  });

  it("keeps sparse templates, row spans and explicit consumer styles", () => {
    render(
      <Grid
        templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
        align="center"
        style={{ alignItems: "end", rowGap: "3rem" }}
        data-testid="grid"
      >
        <Grid.Item rowSpan={{ base: 1, md: 2 }} data-testid="item" />
      </Grid>,
    );
    const grid = screen.getByTestId("grid");
    expect(grid).toHaveStyle({
      "--f-k-b": "1fr",
      "--f-k-l": "2fr 1fr",
    });
    expect(grid.style.alignItems).toBe("end");
    expect(grid.style.rowGap).toBe("3rem");
    expect(screen.getByTestId("item")).toHaveStyle({
      "--f-j-b": "span 1 / span 1",
      "--f-j-m": "span 2 / span 2",
    });
    expect(grid.style.getPropertyValue("--f-k-m")).toBe("");
  });
  it("supports full-width item spans", () => {
    render(<Grid.Item colSpan="full" data-testid="item" />);
    expect(screen.getByTestId("item")).toHaveStyle({
      "--f-i-b": "1 / -1",
    });
  });
});
