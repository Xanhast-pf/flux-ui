import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Sparkline } from "./Sparkline.js";
describe("Sparkline", () => {
  it("renders a named path and keeps gaps disconnected", () => {
    render(
      <Sparkline label="Trend with missing data" values={[1, 2, null, 3, 4]} />,
    );
    const graph = screen.getByRole("img", { name: "Trend with missing data" });
    expect(
      graph.querySelector("path")?.getAttribute("d")?.match(/M/g),
    ).toHaveLength(2);
  });
  it("keeps a flat source finite and forwards SVG attributes", () => {
    render(
      <Sparkline
        label="Steady"
        values={[4, 4, 4]}
        data-testid="trend"
        width={100}
      />,
    );
    expect(screen.getByTestId("trend")).toHaveAttribute("width", "100");
    expect(screen.getByTestId("trend").innerHTML).not.toMatch(/NaN|Infinity/);
  });
});
