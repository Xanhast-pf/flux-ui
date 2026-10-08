import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChartLegend } from "../ChartLegend/ChartLegend.js";
import { ChartTooltip } from "../ChartTooltip/ChartTooltip.js";
import { ScatterChart } from "./ScatterChart.js";

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
  {
    id: "worker",
    label: "Worker",
    tone: "success" as const,
    data: [
      { x: 10, y: 60 },
      { x: 20, y: 80 },
      { x: 30, y: 100 },
    ],
  },
] as const;

describe("ScatterChart", () => {
  it("keeps every source point and series keyboard inspectable without a legend", () => {
    render(
      <ScatterChart
        label="Latency vs payload"
        description="Illustrative latency."
        series={series}
      />,
    );
    const cursor = screen.getByRole("slider", {
      name: "Latency vs payload data cursor",
    });

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(cursor).toHaveAccessibleDescription(
      /Illustrative latency.*up\/down change series/u,
    );
    expect(cursor).toHaveAttribute("aria-valuetext", "Latency: 10, 90");
    fireEvent.keyDown(cursor, { key: "ArrowRight" });
    expect(cursor).toHaveAttribute("aria-valuetext", "Latency: 20, 110");
    fireEvent.keyDown(cursor, { key: "ArrowDown" });
    expect(cursor).toHaveAttribute("aria-valuetext", "Worker: 20, 80");
    fireEvent.keyDown(cursor, { key: "End" });
    expect(cursor).toHaveAttribute("aria-valuetext", "Worker: 30, 100");
  });

  it("keeps automatic series tones stable when earlier series are hidden", () => {
    const implicit = [
      { id: "first", label: "First", data: [{ x: 0, y: 1 }] },
      { id: "second", label: "Second", data: [{ x: 0, y: 2 }] },
    ] as const;
    render(
      <ChartLegend items={implicit} toggleVisibility>
        <ScatterChart label="Stable tones" series={implicit} />
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

  it("shows an X bucket from the plot and one highlighted point on a direct hit", () => {
    const { container } = render(
      <ChartTooltip
        renderContent={(data) =>
          `${data.label}|${data.items
            .map((item) => `${item.label}:${item.value}`)
            .join("|")}`
        }
      >
        <ScatterChart label="Latency" series={series} />
      </ChartTooltip>,
    );
    const chart = screen.getByRole("slider");
    setChartRect(chart);

    fireEvent.pointerMove(chart, { clientX: 80, clientY: 120 });
    expect(
      container.querySelector("[data-chart-tooltip='true']"),
    ).toHaveTextContent("10|Latency:90|Worker:60");

    const worker = container.querySelector("[data-chart-series='1']");
    const workerPoints = worker?.querySelector("path");
    expect(workerPoints).not.toBeNull();
    if (!workerPoints) return;

    fireEvent.pointerMove(workerPoints, { clientX: 80, clientY: 248 });
    expect(
      container.querySelector("[data-chart-tooltip='true']"),
    ).toHaveTextContent("10|Worker:60");
    expect(container.querySelector("[data-chart-series='0']")).toHaveAttribute(
      "data-muted",
      "true",
    );
    expect(worker).not.toHaveAttribute("data-muted");

    fireEvent.pointerMove(chart, { clientX: 80, clientY: 120 });
    expect(
      container.querySelector("[data-chart-series='0']"),
    ).not.toHaveAttribute("data-muted");
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
