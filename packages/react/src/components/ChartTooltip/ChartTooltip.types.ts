import type { ComponentPropsWithRef, ReactNode } from "react";
import type { ChartTone } from "../Chart/Chart.types.js";

export interface ChartTooltipItem {
  id: string;
  label: string;
  value: string;
  tone?: ChartTone | undefined;
}

export interface ChartTooltipData {
  /** Optional axis/category label displayed above the rows. */
  label?: string | undefined;
  items: readonly ChartTooltipItem[];
  /** Anchor position as percentages of the chart surface. */
  x: number;
  y: number;
}

export interface ChartTooltipProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children"
> {
  children: ReactNode;
  trigger?: "hover" | "click" | undefined;
  renderContent?: ((data: ChartTooltipData) => ReactNode) | undefined;
}
