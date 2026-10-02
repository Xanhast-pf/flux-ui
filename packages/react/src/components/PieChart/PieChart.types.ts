import type { ComponentPropsWithRef } from "react";
import type { ChartTone } from "../Chart/Chart.types.js";

export interface PieChartDatum {
  id: string;
  label: string;
  value: number;
  tone?: ChartTone | undefined;
}

export interface PieChartProps extends Omit<
  ComponentPropsWithRef<"figure">,
  "children" | "dangerouslySetInnerHTML"
> {
  label: string;
  description?: string | undefined;
  data: readonly PieChartDatum[];
  /** Hard cap on rendered slices. */
  maxSlices?: number | undefined;
  formatValue?: ((value: number) => string) | undefined;
}
