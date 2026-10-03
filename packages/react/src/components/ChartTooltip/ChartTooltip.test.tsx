import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Chart } from "../Chart/Chart.js";
import { ChartTooltip } from "./ChartTooltip.js";

const series = [
  {
    id: "revenue",
    label: "Revenue",
    data: [
      { x: 0, y: 10 },
      { x: 1, y: 14 },
    ],
  },
];

function setChartRect(element: HTMLElement): void {
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    width: 640,
    height: 280,
    right: 640,
    bottom: 280,
    toJSON: () => ({}),
  });
}

describe("ChartTooltip", () => {
  it("shows normalized chart data on hover and hides on pointer leave", () => {
    const { container } = render(
      <ChartTooltip>
        <Chart label="Finance" series={series} />
      </ChartTooltip>,
    );
    const chart = screen.getByRole("slider");
    setChartRect(chart);

    fireEvent.pointerMove(chart, { clientX: 80, clientY: 248 });
    const tooltip = container.querySelector("[data-chart-tooltip='true']");
    expect(tooltip).toHaveAttribute("aria-hidden", "true");
    expect(tooltip).toHaveTextContent("Revenue");
    expect(tooltip).toHaveTextContent("10");

    fireEvent.pointerLeave(chart);
    expect(
      container.querySelector("[data-chart-tooltip='true']"),
    ).not.toBeInTheDocument();
  });

  it("anchors toward available space instead of collapsing at plot edges", () => {
    const { container } = render(
      <ChartTooltip>
        <Chart label="Finance" series={series} />
      </ChartTooltip>,
    );
    const chart = screen.getByRole("slider");
    setChartRect(chart);

    fireEvent.pointerMove(chart, { clientX: 620, clientY: 10 });
    const tooltip = container.querySelector("[data-chart-tooltip='true']");
    expect(tooltip).toHaveAttribute("data-align", "end");
    expect(tooltip).toHaveAttribute("data-side", "bottom");
    expect(tooltip).toHaveStyle({
      left: "96%",
      transform: "translate(-100%, 0.5rem)",
    });
  });

  it("supports click persistence, Escape dismissal and custom content", () => {
    const { container } = render(
      <ChartTooltip
        trigger="click"
        renderContent={(data) => `Point: ${data.items[0]?.value}`}
      >
        <Chart label="Finance" series={series} />
      </ChartTooltip>,
    );
    const chart = screen.getByRole("slider");
    setChartRect(chart);

    fireEvent.click(chart, { clientX: 80, clientY: 248 });
    expect(
      container.querySelector("[data-chart-tooltip='true']"),
    ).toHaveTextContent("Point: 10");

    fireEvent.pointerLeave(chart);
    expect(
      container.querySelector("[data-chart-tooltip='true']"),
    ).toBeInTheDocument();

    fireEvent.keyDown(chart, { key: "Escape" });
    expect(
      container.querySelector("[data-chart-tooltip='true']"),
    ).not.toBeInTheDocument();
  });
});
