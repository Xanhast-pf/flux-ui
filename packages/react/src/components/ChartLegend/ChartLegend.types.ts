import type { ComponentPropsWithRef, MouseEvent, ReactNode } from "react";
import type { ChartTone } from "../Chart/Chart.types.js";

export interface ChartLegendItem {
  id: string;
  label: string;
  tone?: ChartTone | undefined;
}

type LegendHiddenState =
  | {
      hiddenIds: readonly string[];
      defaultHiddenIds?: never;
    }
  | {
      hiddenIds?: never;
      defaultHiddenIds?: readonly string[] | undefined;
    };

export type ChartLegendProps = Omit<ComponentPropsWithRef<"div">, "children"> &
  LegendHiddenState & {
    children: ReactNode;
    items: readonly ChartLegendItem[];
    direction?: "horizontal" | "vertical" | undefined;
    placement?: "top" | "bottom" | "start" | "end" | undefined;
    legendLabel?: string | undefined;
    toggleVisibility?: boolean | undefined;
    onHiddenIdsChange?: ((hiddenIds: readonly string[]) => void) | undefined;
    onItemClick?:
      | ((item: ChartLegendItem, event: MouseEvent<HTMLButtonElement>) => void)
      | undefined;
  };
