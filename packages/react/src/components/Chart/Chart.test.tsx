import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Chart } from "./Chart.js";
import { ChartLegend } from "../ChartLegend/ChartLegend.js";
import { ChartTooltip } from "../ChartTooltip/ChartTooltip.js";

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
  {
    id: "other",
    label: "Other",
    tone: "success" as const,
    data: [
      { x: 0, y: 8 },
      { x: 1, y: 6 },
      { x: 2, y: 7 },
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

describe("Chart", () => {
  it("renders only the visualization while keeping every series keyboard inspectable", () => {
    const { container } = render(
      <Chart
        label="Traffic"
        description="Illustrative traffic."
        series={series}
      />,
    );
    const cursor = screen.getByRole("slider", { name: "Traffic data cursor" });

    expect(container.querySelector("figure")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-chart-tooltip='true']"),
    ).not.toBeInTheDocument();
    expect(cursor).toHaveAccessibleDescription(
      /Illustrative traffic.*Left\/right inspect samples/u,
    );

    expect(cursor).toHaveAttribute("aria-valuetext", "Visits: 0, 4");
    fireEvent.keyDown(cursor, { key: "ArrowRight" });
    expect(cursor).toHaveAttribute("aria-valuetext", "Visits: 1, 9");
    fireEvent.keyDown(cursor, { key: "ArrowDown" });
    expect(cursor).toHaveAttribute("aria-valuetext", "Other: 1, 6");
    fireEvent.keyDown(cursor, { key: "Home" });
    expect(cursor).toHaveAttribute("aria-valuetext", "Other: 0, 8");
    fireEvent.keyDown(cursor, { key: "ArrowUp" });
    expect(cursor).toHaveAttribute("aria-valuetext", "Visits: 0, 4");
  });

  it("lets ChartLegend own layout and series visibility", () => {
    render(
      <ChartLegend items={series} toggleVisibility>
        <Chart label="Traffic" series={series} />
      </ChartLegend>,
    );

    const cursor = screen.getByRole("slider");
    const visits = screen.getByRole("button", { name: "Visits" });
    expect(visits).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(visits);
    expect(visits).toHaveAttribute("aria-pressed", "false");
    expect(cursor).toHaveAttribute("aria-valuetext", "Other: 0, 8");

    fireEvent.click(visits);
    expect(visits).toHaveAttribute("aria-pressed", "true");
    expect(cursor).toHaveAttribute("aria-valuetext", "Visits: 0, 4");
  });

  it("keeps automatic series tones stable when earlier series are hidden", () => {
    const implicit = [
      { id: "first", label: "First", data: [{ x: 0, y: 1 }] },
      { id: "second", label: "Second", data: [{ x: 0, y: 2 }] },
    ] as const;
    render(
      <ChartLegend items={implicit} toggleVisibility>
        <Chart label="Stable tones" series={implicit} />
      </ChartLegend>,
    );

    const chart = screen.getByRole("slider");
    expect(chart.querySelector("[data-chart-series='1']")).toHaveAttribute(
      "data-tone",
      "info",
    );

    fireEvent.click(screen.getByRole("button", { name: "First" }));
    expect(chart.querySelector("[data-chart-series='0']")).toHaveAttribute(
      "data-tone",
      "info",
    );
  });

  it("lets ChartTooltip project hover or click data without changing chart semantics", () => {
    const hover = render(
      <ChartTooltip>
        <Chart label="Traffic" series={[series[0]!]} />
      </ChartTooltip>,
    );
    const chart = screen.getByRole("slider");
    setChartRect(chart);

    fireEvent.pointerMove(chart, { clientX: 80, clientY: 248 });
    expect(
      hover.container.querySelector("[data-chart-tooltip='true']"),
    ).toHaveTextContent("Visits");
    expect(
      hover.container.querySelector("[data-chart-tooltip='true']"),
    ).toHaveTextContent("4");
    fireEvent.pointerLeave(chart);
    expect(
      hover.container.querySelector("[data-chart-tooltip='true']"),
    ).not.toBeInTheDocument();
    hover.unmount();

    const click = render(
      <ChartTooltip trigger="click">
        <Chart label="Traffic" series={[series[0]!]} />
      </ChartTooltip>,
    );
    const clickChart = screen.getByRole("slider");
    setChartRect(clickChart);
    fireEvent.click(clickChart, { clientX: 80, clientY: 248 });
    expect(
      click.container.querySelector("[data-chart-tooltip='true']"),
    ).toBeInTheDocument();
    fireEvent.pointerLeave(clickChart);
    expect(
      click.container.querySelector("[data-chart-tooltip='true']"),
    ).toBeInTheDocument();
    fireEvent.keyDown(clickChart, { key: "Escape" });
    expect(
      click.container.querySelector("[data-chart-tooltip='true']"),
    ).not.toBeInTheDocument();
  });

  it("shows an X bucket from the plot and a single highlighted item on a direct hit", () => {
    const { container } = render(
      <ChartTooltip
        renderContent={(data) =>
          `${data.label}|${data.items
            .map((item) => `${item.label}:${item.value}`)
            .join("|")}`
        }
      >
        <Chart label="Traffic" series={series} type="bar" />
      </ChartTooltip>,
    );
    const chart = screen.getByRole("slider");
    setChartRect(chart);

    fireEvent.pointerMove(chart, { clientX: 80, clientY: 120 });
    expect(
      container.querySelector("[data-chart-tooltip='true']"),
    ).toHaveTextContent("0|Visits:4|Other:8");
    expect(container.querySelectorAll("circle")).toHaveLength(0);

    const other = container.querySelector("[data-chart-series='1']");
    const otherShape = other?.querySelector("path");
    expect(otherShape).not.toBeNull();
    if (!otherShape) return;

    fireEvent.pointerMove(otherShape, { clientX: 80, clientY: 120 });
    expect(
      container.querySelector("[data-chart-tooltip='true']"),
    ).toHaveTextContent("0|Other:8");
    expect(container.querySelector("[data-chart-series='0']")).toHaveAttribute(
      "data-muted",
      "true",
    );
    expect(other).not.toHaveAttribute("data-muted");
    expect(container.querySelectorAll("circle")).toHaveLength(1);

    fireEvent.pointerMove(chart, { clientX: 80, clientY: 120 });
    expect(
      container.querySelector("[data-chart-series='0']"),
    ).not.toHaveAttribute("data-muted");
    expect(container.querySelectorAll("circle")).toHaveLength(0);
  });

  it("accepts an empty source and rejects unordered x values", () => {
    const view = render(<Chart label="Traffic" series={[]} />);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("slider")).toHaveAttribute("tabindex", "-1");
    view.unmount();

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
    ).toThrow(/increasing/u);
  });
});
