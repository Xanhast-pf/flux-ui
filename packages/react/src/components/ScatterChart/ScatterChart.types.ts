import type { ComponentPropsWithRef } from "react";
import type { ChartTone } from "../Chart/Chart.types.js";

export interface ScatterChartPoint {
  x: number;
  y: number;
}

export interface ScatterChartSeries {
  id: string;
  label: string;
  data: readonly ScatterChartPoint[];
  tone?: ChartTone | undefined;
}

export interface ScatterChartProps extends Omit<
  ComponentPropsWithRef<"figure">,
  "children" | "dangerouslySetInnerHTML"
> {
  label: string;
  description?: string | undefined;
  series: readonly ScatterChartSeries[];
  /** Maximum rendered points per series; source points remain keyboard inspectable. */
  maxPoints?: number | undefined;
  formatX?: ((value: number) => string) | undefined;
  formatY?: ((value: number) => string) | undefined;
}
