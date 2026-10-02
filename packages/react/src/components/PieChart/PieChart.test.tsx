import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PieChart } from "./PieChart.js";

const data = [
  { id: "alpha", label: "Alpha", value: 60 },
  { id: "beta", label: "Beta", value: 30 },
  { id: "gamma", label: "Gamma", value: 10 },
] as const;

describe("PieChart", () => {
  it("shares the chart keyboard inspector and legend contract", () => {
    render(<PieChart label="Revenue" data={data} />);
    const cursor = screen.getByRole("slider", {
      name: "Revenue data cursor",
    });

    expect(cursor).toHaveAttribute("aria-valuetext", "Alpha: 60, 60%");
    fireEvent.keyDown(cursor, { key: "ArrowRight" });
    expect(cursor).toHaveAttribute("aria-valuetext", "Beta: 30, 30%");
    fireEvent.keyDown(cursor, { key: "End" });
    expect(cursor).toHaveAttribute("aria-valuetext", "Gamma: 10, 10%");

    fireEvent.click(screen.getByRole("button", { name: /Alpha/u }));
    expect(cursor).toHaveAttribute("aria-valuetext", "Alpha: 60, 60%");
  });

  it("bounds rendered slices and rejects misleading values", () => {
    expect(() =>
      render(<PieChart label="Bad" data={data} maxSlices={2} />),
    ).toThrow(/maxSlices/u);
    expect(() =>
      render(
        <PieChart
          label="Bad"
          data={[{ id: "negative", label: "Negative", value: -1 }]}
        />,
      ),
    ).toThrow(/non-negative/u);
    expect(() =>
      render(
        <PieChart
          label="Bad"
          data={[{ id: "zero", label: "Zero", value: 0 }]}
        />,
      ),
    ).toThrow(/positive total/u);
  });

  it("keeps empty charts non-focusable", () => {
    render(<PieChart label="Empty" data={[]} />);
    const cursor = screen.getByRole("slider");
    expect(cursor).toHaveAttribute("aria-disabled", "true");
    expect(cursor).toHaveAttribute("tabindex", "-1");
    expect(cursor).toHaveAttribute("aria-valuetext", "No chart data");
  });
});
