import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Chart } from "./Chart.js";
const series = [
  {
    id: "visits",
    label: "Visits",
    data: [
      { x: 0, y: 4 },
      { x: 1, y: 9 },
      { x: 2, y: null },
    ],
  },
];
describe("Chart", () => {
  it("exposes every source sample to keyboard inspection", () => {
    render(<Chart label="Traffic" series={series} />);
    const cursor = screen.getByRole("slider", { name: "Traffic data cursor" });
    expect(cursor).toHaveAttribute("aria-valuetext", "Visits: 0, 4");
    fireEvent.keyDown(cursor, { key: "ArrowRight" });
    expect(cursor).toHaveAttribute("aria-valuetext", "Visits: 1, 9");
    fireEvent.keyDown(cursor, { key: "End" });
    expect(cursor).toHaveAttribute("aria-valuetext", "Visits: 2, No value");
  });
  it("keeps series selection local and accepts an empty source", () => {
    const view = render(
      <Chart
        label="Traffic"
        series={[
          ...series,
          { id: "other", label: "Other", data: [{ x: 0, y: 8 }] },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Other/ }));
    expect(screen.getByRole("slider")).toHaveAttribute(
      "aria-valuetext",
      "Other: 0, 8",
    );
    view.rerender(<Chart label="Traffic" series={[]} />);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("slider")).toHaveAttribute("tabindex", "-1");
  });
  it("rejects unordered x values instead of drawing misleading data", () => {
    expect(() =>
      render(
        <Chart
          label="Bad"
          series={[
            {
              id: "x",
              label: "x",
              data: [
                { x: 2, y: 0 },
                { x: 1, y: 1 },
              ],
            },
          ]}
        />,
      ),
    ).toThrow(/increasing/);
  });
});
