import type { ComponentPropsWithRef } from "react";
export interface ChartPoint {
  x: number;
  y: number | null;
}
export type ChartTone = "accent" | "info" | "success" | "warning" | "danger";
export interface ChartSeries {
  id: string;
  label: string;
  /** Strictly increasing finite x values; null y is an intentional gap. */
  data: readonly ChartPoint[];
  tone?: ChartTone | undefined;
}
export interface ChartProps extends Omit<
  ComponentPropsWithRef<"figure">,
  "children"
> {
  label: string;
  description?: string | undefined;
  series: readonly ChartSeries[];
  type?: "line" | "area" | "bar" | undefined;
  /** Maximum displayed samples per series. Source samples remain keyboard inspectable. */
  maxPoints?: number | undefined;
  formatX?: ((value: number) => string) | undefined;
  formatY?: ((value: number) => string) | undefined;
}
