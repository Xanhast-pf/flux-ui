import { createContext, useContext } from "react";
import type { ChartTooltipData } from "../components/ChartTooltip/ChartTooltip.types.js";

export type ChartTooltipEvent = "hover" | "click";

export function chartSeriesIndexFromTarget(
  target: EventTarget | null,
  owner: Element,
): number | null {
  const Type = owner.ownerDocument.defaultView?.Element;
  if (!Type || !(target instanceof Type)) return null;
  const value = target
    .closest("[data-chart-series]")
    ?.getAttribute("data-chart-series");
  if (value === null || value === undefined) return null;
  const index = Number(value);
  return Number.isInteger(index) ? index : null;
}

export interface ChartTooltipBridge {
  trigger: ChartTooltipEvent;
  show: (event: ChartTooltipEvent, data: ChartTooltipData) => void;
  hide: (event: ChartTooltipEvent) => void;
}

export const ChartHiddenIdsContext = createContext<ReadonlySet<string> | null>(
  null,
);
export const ChartTooltipContext = createContext<ChartTooltipBridge | null>(
  null,
);

const emptyHiddenIds = new Set<string>();

export function useChartHiddenIds(): ReadonlySet<string> {
  return useContext(ChartHiddenIdsContext) ?? emptyHiddenIds;
}

export function useChartTooltipBridge(): ChartTooltipBridge | null {
  return useContext(ChartTooltipContext);
}
