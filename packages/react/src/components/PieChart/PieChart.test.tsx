import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChartLegend } from "../ChartLegend/ChartLegend.js";
import { ChartTooltip } from "../ChartTooltip/ChartTooltip.js";
import { PieChart } from "./PieChart.js";

function setChartRect(element: HTMLElement): void {
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    width: 320,
    height: 240,
    right: 320,
    bottom: 240,
    toJSON: () => ({}),
  });
}

const data = [
  { id: "alpha", label: "Alpha", value: 60 },
  { id: "beta", label: "Beta", value: 30 },
  { id: "gamma", label: "Gamma", value: 10 },
] as const;

describe("PieChart", () => {
  it("is standalone and keeps every slice keyboard inspectable", () => {
    const { container } = render(
      <PieChart
        label="Revenue"
        description="Illustrative revenue."
        data={data}
      />,
    );
    const cursor = screen.getByRole("slider", {
      name: "Revenue data cursor",
    });

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(container.querySelector("figure")).not.toBeInTheDocument();
    expect(cursor).toHaveAccessibleDescription(
      /Illustrative revenue.*Arrow keys inspect slices/u,
    );
    expect(cursor).toHaveAttribute("aria-valuetext", "Alpha: 60, 60%");
    fireEvent.keyDown(cursor, { key: "ArrowRight" });
    expect(cursor).toHaveAttribute("aria-valuetext", "Beta: 30, 30%");
    fireEvent.keyDown(cursor, { key: "End" });
    expect(cursor).toHaveAttribute("aria-valuetext", "Gamma: 10, 10%");
  });

  it("lets ChartLegend remove hidden slices and recompute the visible total", () => {
    render(
      <ChartLegend items={data} toggleVisibility>
        <PieChart label="Revenue" data={data} />
      </ChartLegend>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Alpha" }));
    expect(screen.getByRole("slider")).toHaveAttribute(
      "aria-valuetext",
      "Beta: 30, 75%",
    );
  });

  it("supports both hover and persistent click tooltips while highlighting slices", () => {
    const hover = render(
      <ChartTooltip>
        <PieChart label="Revenue" data={data} />
      </ChartTooltip>,
    );
    const hoverChart = screen.getByRole("slider");
    setChartRect(hoverChart);

    fireEvent.pointerMove(hoverChart, { clientX: 80, clientY: 120 });
    expect(
      hover.container.querySelector("[data-chart-tooltip='true']"),
    ).toHaveTextContent("Beta");
    expect(hoverChart).toHaveAttribute("aria-valuetext", "Beta: 30, 30%");
    expect(
      hover.container.querySelectorAll("[data-active='true']"),
    ).toHaveLength(1);
    fireEvent.pointerLeave(hoverChart);
    expect(
      hover.container.querySelector("[data-chart-tooltip='true']"),
    ).not.toBeInTheDocument();
    hover.unmount();

    const click = render(
      <ChartTooltip trigger="click">
        <PieChart label="Revenue" data={data} />
      </ChartTooltip>,
    );
    const clickChart = screen.getByRole("slider");
    setChartRect(clickChart);

    fireEvent.click(clickChart, { clientX: 80, clientY: 120 });
    expect(
      click.container.querySelector("[data-chart-tooltip='true']"),
    ).toHaveTextContent("Beta");
    fireEvent.pointerLeave(clickChart);
    expect(
      click.container.querySelector("[data-chart-tooltip='true']"),
    ).toBeInTheDocument();
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
