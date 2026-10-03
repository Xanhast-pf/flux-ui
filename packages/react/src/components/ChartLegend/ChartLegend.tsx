import { useMemo, useState } from "react";
import { ChartHiddenIdsContext } from "../../internal/chartComposition.js";
import { joinClassNames } from "../../internal/joinClassNames.js";
import {
  chartSlot,
  control,
  frame,
  item,
  list,
  mark,
} from "./ChartLegend.css.js";
import type { ChartLegendProps, ChartLegendItem } from "./ChartLegend.types.js";
import type { ChartTone } from "../Chart/Chart.types.js";

const tones: readonly ChartTone[] = [
  "accent",
  "info",
  "success",
  "warning",
  "danger",
];

export function ChartLegend({
  children,
  items,
  direction,
  placement = "bottom",
  legendLabel = "Chart legend",
  toggleVisibility = false,
  hiddenIds: controlledHidden,
  defaultHiddenIds = [],
  onHiddenIdsChange,
  onItemClick,
  className,
  ...props
}: ChartLegendProps) {
  if (
    items.some((entry) => !entry.id || !entry.label) ||
    new Set(items.map((entry) => entry.id)).size !== items.length
  )
    throw new RangeError(
      "ChartLegend items need unique non-empty IDs and labels.",
    );

  const [localHidden, setLocalHidden] =
    useState<readonly string[]>(defaultHiddenIds);
  const hiddenIds = controlledHidden ?? localHidden;
  const hidden = useMemo(() => new Set(hiddenIds), [hiddenIds]);
  const resolvedDirection =
    direction ??
    (placement === "start" || placement === "end" ? "vertical" : "horizontal");
  const interactive = toggleVisibility || onItemClick !== undefined;

  const legend = (
    <ul
      aria-label={legendLabel}
      className={list}
      data-direction={resolvedDirection}
    >
      {items.map((entry, index) => {
        const isHidden = hidden.has(entry.id);
        const tone = entry.tone ?? tones[index % 5]!;
        const content = (
          <>
            <span aria-hidden="true" className={mark} data-tone={tone} />
            <span>{entry.label}</span>
          </>
        );

        return (
          <li className={item} key={entry.id}>
            {interactive ? (
              <button
                type="button"
                className={control}
                data-hidden={isHidden || undefined}
                data-interactive
                aria-pressed={toggleVisibility ? !isHidden : undefined}
                onClick={(event) => {
                  onItemClick?.(entry, event);
                  if (event.defaultPrevented || !toggleVisibility) return;
                  const next = isHidden
                    ? hiddenIds.filter((id) => id !== entry.id)
                    : [...hiddenIds, entry.id];
                  if (controlledHidden === undefined) setLocalHidden(next);
                  onHiddenIdsChange?.(next);
                }}
              >
                {content}
              </button>
            ) : (
              <span className={control} data-hidden={isHidden || undefined}>
                {content}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
  const before = placement === "top" || placement === "start";

  return (
    <ChartHiddenIdsContext.Provider value={hidden}>
      <div
        {...props}
        className={joinClassNames(frame, className)}
        data-placement={placement}
      >
        {before ? legend : null}
        <div className={chartSlot}>{children}</div>
        {before ? null : legend}
      </div>
    </ChartHiddenIdsContext.Provider>
  );
}

export type { ChartLegendItem };
