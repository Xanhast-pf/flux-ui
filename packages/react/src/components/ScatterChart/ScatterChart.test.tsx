import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScatterChart } from "./ScatterChart.js";

const series = [
  {
    id: "latency",
    label: "Latency",
    data: [
      { x: 10, y: 90 },
      { x: 20, y: 110 },
      { x: 30, y: 150 },
    ],
  },
] as const;

describe("ScatterChart", () => {
  it("keeps every source point keyboard inspectable", () => {
    render(<ScatterChart label="Latency vs payload" series={series} />);
    const cursor = screen.getByRole("slider", {
      name: "Latency vs payload data cursor",
    });

    expect(cursor).toHaveAttribute("aria-valuetext", "Latency: 10, 90");
    fireEvent.keyDown(cursor, { key: "ArrowRight" });
    expect(cursor).toHaveAttribute("aria-valuetext", "Latency: 20, 110");
    fireEvent.keyDown(cursor, { key: "End" });
    expect(cursor).toHaveAttribute("aria-valuetext", "Latency: 30, 150");
  });

  it("renders bounded point paths instead of one node per source point", () => {
    const dense = Array.from({ length: 1_000 }, (_, index) => ({
      x: index,
      y: index % 37,
    }));
    const { container } = render(
      <ScatterChart
        label="Dense"
        maxPoints={32}
        series={[{ id: "dense", label: "Dense", data: dense }]}
      />,
    );

    expect(container.querySelectorAll("path")).toHaveLength(4);
    expect(container.querySelectorAll("circle")).toHaveLength(1);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuemax", "999");
  });

  it("rejects invalid numeric data and keeps empty charts non-focusable", () => {
    expect(() =>
      render(
        <ScatterChart
          label="Bad"
          series={[
            {
              id: "bad",
              label: "Bad",
              data: [{ x: Number.NaN, y: 1 }],
            },
          ]}
        />,
      ),
    ).toThrow(/finite/u);

    const view = render(<ScatterChart label="Empty" series={[]} />);
    expect(screen.getByRole("slider")).toHaveAttribute("tabindex", "-1");
    view.unmount();
  });
});
