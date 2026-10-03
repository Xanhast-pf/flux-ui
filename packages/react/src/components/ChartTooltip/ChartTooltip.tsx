import { useMemo, useState } from "react";
import {
  ChartTooltipContext,
  type ChartTooltipEvent,
} from "../../internal/chartComposition.js";
import { joinClassNames } from "../../internal/joinClassNames.js";
import {
  frame,
  label,
  mark,
  popup,
  row,
  rows,
  value,
} from "./ChartTooltip.css.js";
import type {
  ChartTooltipData,
  ChartTooltipProps,
} from "./ChartTooltip.types.js";

type TooltipState = readonly [ChartTooltipEvent, ChartTooltipData];

function clampPercent(next: number): number {
  return Math.max(4, Math.min(96, next));
}

function tooltipPlacement(data: ChartTooltipData) {
  const align = data.x < 24 ? "start" : data.x > 76 ? "end" : "center";
  const side = data.y < 24 ? "bottom" : "top";
  return {
    align,
    side,
    transform: `translate(${align === "start" ? "0" : align === "end" ? "-100%" : "-50%"}, ${side === "bottom" ? "0.5rem" : "calc(-100% - 0.5rem)"})`,
  } as const;
}

export function ChartTooltip({
  children,
  trigger = "hover",
  renderContent,
  className,
  onKeyDownCapture,
  ...props
}: ChartTooltipProps) {
  const [state, setState] = useState<TooltipState | null>(null);
  const data = state?.[0] === trigger ? state[1] : null;
  const placement = data === null ? null : tooltipPlacement(data);

  const bridge = useMemo(
    () => ({
      trigger,
      show(event: ChartTooltipEvent, next: ChartTooltipData) {
        if (event === trigger) setState([event, next]);
      },
      hide(event: ChartTooltipEvent) {
        if (event === trigger)
          setState((current) => (current?.[0] === event ? null : current));
      },
    }),
    [trigger],
  );

  return (
    <ChartTooltipContext.Provider value={bridge}>
      <div
        {...props}
        className={joinClassNames(frame, className)}
        onKeyDownCapture={(event) => {
          onKeyDownCapture?.(event);
          if (!event.defaultPrevented && event.key === "Escape") setState(null);
        }}
      >
        {children}
        {data === null ? null : (
          <div
            aria-hidden="true"
            className={popup}
            data-chart-tooltip="true"
            data-align={placement?.align}
            data-side={placement?.side}
            style={{
              left: `${clampPercent(data.x)}%`,
              top: `${clampPercent(data.y)}%`,
              transform: placement?.transform,
            }}
          >
            {renderContent ? (
              renderContent(data)
            ) : (
              <>
                {data.label ? (
                  <span className={label}>{data.label}</span>
                ) : null}
                <span className={rows}>
                  {data.items.map((entry) => (
                    <span className={row} key={entry.id}>
                      <span
                        aria-hidden="true"
                        className={mark}
                        data-tone={entry.tone ?? "accent"}
                      />
                      <span>{entry.label}</span>
                      <span className={value}>{entry.value}</span>
                    </span>
                  ))}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </ChartTooltipContext.Provider>
  );
}
