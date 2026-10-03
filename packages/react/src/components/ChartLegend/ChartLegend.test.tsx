import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Chart } from "../Chart/Chart.js";
import { ChartLegend } from "./ChartLegend.js";

const series = [
  {
    id: "revenue",
    label: "Revenue",
    data: [
      { x: 0, y: 10 },
      { x: 1, y: 14 },
    ],
  },
  {
    id: "cost",
    label: "Cost",
    tone: "warning" as const,
    data: [
      { x: 0, y: 7 },
      { x: 1, y: 9 },
    ],
  },
];

describe("ChartLegend", () => {
  it("renders a static semantic legend without adding controls by default", () => {
    render(
      <ChartLegend items={series}>
        <Chart label="Finance" series={series} />
      </ChartLegend>,
    );

    expect(screen.getByRole("list", { name: "Chart legend" })).toBeVisible();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("owns optional uncontrolled visibility and updates the wrapped chart", () => {
    const onHiddenIdsChange = vi.fn();
    render(
      <ChartLegend
        items={series}
        toggleVisibility
        onHiddenIdsChange={onHiddenIdsChange}
      >
        <Chart label="Finance" series={series} />
      </ChartLegend>,
    );

    const revenue = screen.getByRole("button", { name: "Revenue" });
    fireEvent.click(revenue);

    expect(revenue).toHaveAttribute("aria-pressed", "false");
    expect(onHiddenIdsChange).toHaveBeenLastCalledWith(["revenue"]);
    expect(screen.getByRole("slider")).toHaveAttribute(
      "aria-valuetext",
      "Cost: 0, 7",
    );
  });

  it("keeps controlled hiddenIds owner-authoritative", () => {
    const onHiddenIdsChange = vi.fn();
    render(
      <ChartLegend
        items={series}
        hiddenIds={["revenue"]}
        toggleVisibility
        onHiddenIdsChange={onHiddenIdsChange}
      >
        <Chart label="Finance" series={series} />
      </ChartLegend>,
    );

    const revenue = screen.getByRole("button", { name: "Revenue" });
    expect(revenue).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(revenue);
    expect(onHiddenIdsChange).toHaveBeenLastCalledWith([]);
    expect(revenue).toHaveAttribute("aria-pressed", "false");
  });

  it("lets onItemClick cancel visibility changes", () => {
    render(
      <ChartLegend
        items={series}
        toggleVisibility
        onItemClick={(_, event) => event.preventDefault()}
      >
        <Chart label="Finance" series={series} />
      </ChartLegend>,
    );

    const revenue = screen.getByRole("button", { name: "Revenue" });
    fireEvent.click(revenue);
    expect(revenue).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("slider")).toHaveAttribute(
      "aria-valuetext",
      "Revenue: 0, 10",
    );
  });
});
