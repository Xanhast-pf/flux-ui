import {
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import {
  chartSeriesIndexFromTarget,
  useChartHiddenIds,
  useChartTooltipBridge,
} from "../../internal/chartComposition.js";
import { chartTone } from "../../internal/chartTone.css.js";
import { joinClassNames } from "../../internal/joinClassNames.js";
import {
  activeMark,
  axis,
  chart,
  gridLine,
  seriesGroup,
  svg,
  visuallyHidden,
} from "../Chart/Chart.css.js";
import { chartBox } from "../Chart/chartModel.js";
import type { ChartTone } from "../Chart/Chart.types.js";
import type { ChartTooltipData } from "../ChartTooltip/ChartTooltip.types.js";
import { points } from "./ScatterChart.css.js";
import { nearestScatterSourceIndex, scatterModel } from "./scatterModel.js";
import type {
  ScatterChartProps,
  ScatterChartSeries,
} from "./ScatterChart.types.js";

const tones: readonly ChartTone[] = [
  "accent",
  "info",
  "success",
  "warning",
  "danger",
];
const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});
const formatNumber = (value: number): string => numberFormatter.format(value);

function toneFor(series: ScatterChartSeries, index: number): ChartTone {
  return series.tone ?? tones[index % tones.length] ?? "accent";
}

export function ScatterChart({
  label,
  description,
  series,
  maxPoints = 512,
  formatX = formatNumber,
  formatY = formatNumber,
  className,
  onKeyDown,
  onPointerMove,
  onPointerLeave,
  onClick,
  "aria-label": ariaLabel,
  "aria-description": ariaDescription,
  "aria-describedby": ariaDescribedBy,
  ...props
}: ScatterChartProps) {
  const descriptionId = useId();
  const hiddenIds = useChartHiddenIds();
  const tooltip = useChartTooltipBridge();
  const visibleSeries = useMemo(
    () => series.filter((item) => !hiddenIds.has(item.id)),
    [series, hiddenIds],
  );
  const model = useMemo(
    () => scatterModel(visibleSeries, maxPoints),
    [visibleSeries, maxPoints],
  );
  const [[seriesIndex, index], setCursor] = useState<readonly [number, number]>(
    [0, 0],
  );
  const [directSeriesIndex, setDirectSeriesIndex] = useState<number | null>(
    null,
  );
  const activeSeriesIndex = Math.max(
    0,
    Math.min(seriesIndex, visibleSeries.length - 1),
  );
  const selected = visibleSeries[activeSeriesIndex];
  const data = selected?.data ?? [];
  const active = Math.max(0, Math.min(index, data.length - 1));
  const point = data[active];
  const valueText =
    selected && point
      ? `${selected.label}: ${formatX(point.x)}, ${formatY(point.y)}`
      : "No chart data";
  const accessibleDescription = [
    ariaDescription,
    description,
    "Left/right inspect points; up/down change series; Home/End reach endpoints.",
  ]
    .filter(Boolean)
    .join(" ");

  function pointerPosition(
    clientX: number,
    clientY: number,
    node: HTMLDivElement,
  ): { x: number; y: number } | null {
    if (visibleSeries.length === 0) return null;
    const bounds = node.getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) return null;
    return {
      x: ((clientX - bounds.left) / bounds.width) * chartBox.width,
      y: ((clientY - bounds.top) / bounds.height) * chartBox.height,
    };
  }

  function nearestRenderedPointByX(
    nextSeriesIndex: number,
    x: number,
  ): number | null {
    const nextSeries = visibleSeries[nextSeriesIndex];
    const nextModel = model.series[nextSeriesIndex];
    if (!nextSeries || !nextModel || nextModel.indexes.length === 0)
      return null;
    let best = nextModel.indexes[0] ?? 0;
    let distance = Infinity;
    for (const sourceIndex of nextModel.indexes) {
      const nextPoint = nextSeries.data[sourceIndex];
      if (!nextPoint) continue;
      const nextDistance = Math.abs(model.x(nextPoint.x) - x);
      if (nextDistance < distance) {
        distance = nextDistance;
        best = sourceIndex;
      }
    }
    return distance === Infinity ? null : best;
  }

  function nearestXPoint(x: number): readonly [number, number] | null {
    let bestSeries = 0;
    let bestIndex = 0;
    let bestDistance = Infinity;
    for (
      let nextSeriesIndex = 0;
      nextSeriesIndex < visibleSeries.length;
      nextSeriesIndex += 1
    ) {
      const sourceIndex = nearestRenderedPointByX(nextSeriesIndex, x);
      if (sourceIndex === null) continue;
      const nextPoint = visibleSeries[nextSeriesIndex]?.data[sourceIndex];
      if (!nextPoint) continue;
      const distance = Math.abs(model.x(nextPoint.x) - x);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestSeries = nextSeriesIndex;
        bestIndex = sourceIndex;
      }
    }
    return bestDistance === Infinity ? null : [bestSeries, bestIndex];
  }

  function applyPointerSelection(
    clientX: number,
    clientY: number,
    node: HTMLDivElement,
    target: EventTarget | null,
  ): ChartTooltipData | null {
    const position = pointerPosition(clientX, clientY, node);
    if (!position) return null;

    const hitSeriesIndex = chartSeriesIndexFromTarget(target);
    if (
      hitSeriesIndex !== null &&
      hitSeriesIndex >= 0 &&
      hitSeriesIndex < visibleSeries.length
    ) {
      const hitSeries = visibleSeries[hitSeriesIndex];
      const hitModel = model.series[hitSeriesIndex];
      if (hitSeries && hitModel && hitModel.indexes.length > 0) {
        const hitIndex = nearestScatterSourceIndex(
          hitModel.indexes,
          hitSeries.data,
          position.x,
          position.y,
          model.x,
          model.y,
        );
        const hitPoint = hitSeries.data[hitIndex];
        if (hitPoint) {
          setCursor([hitSeriesIndex, hitIndex]);
          setDirectSeriesIndex(hitSeriesIndex);
          return {
            label: formatX(hitPoint.x),
            items: [
              {
                id: hitSeries.id,
                label: hitSeries.label,
                value: formatY(hitPoint.y),
                tone: toneFor(hitSeries, hitSeriesIndex),
              },
            ],
            x: (model.x(hitPoint.x) / chartBox.width) * 100,
            y: (model.y(hitPoint.y) / chartBox.height) * 100,
          };
        }
      }
    }

    setDirectSeriesIndex(null);
    const next = nearestXPoint(position.x);
    if (!next) return null;
    setCursor(next);
    const bucketPoint = visibleSeries[next[0]]?.data[next[1]];
    if (!bucketPoint) return null;
    const bucketX = model.x(bucketPoint.x);
    const items = visibleSeries.flatMap((item, itemIndex) => {
      const itemPointIndex = nearestRenderedPointByX(itemIndex, bucketX);
      const itemPoint =
        itemPointIndex === null ? undefined : item.data[itemPointIndex];
      return itemPoint
        ? [
            {
              id: item.id,
              label: item.label,
              value: formatY(itemPoint.y),
              tone: toneFor(item, itemIndex),
            },
          ]
        : [];
    });
    if (items.length === 0) return null;
    return {
      label: formatX(bucketPoint.x),
      items,
      x: (bucketX / chartBox.width) * 100,
      y: (position.y / chartBox.height) * 100,
    };
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      visibleSeries.length === 0
    )
      return;

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const delta = event.key === "ArrowDown" ? 1 : -1;
      const nextSeries = Math.max(
        0,
        Math.min(visibleSeries.length - 1, activeSeriesIndex + delta),
      );
      const nextData = visibleSeries[nextSeries]?.data ?? [];
      setCursor([
        nextSeries,
        Math.max(0, Math.min(active, nextData.length - 1)),
      ]);
      return;
    }

    let next = active;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = data.length - 1;
    else if (event.key === "ArrowLeft") next -= 1;
    else if (event.key === "ArrowRight") next += 1;
    else return;
    event.preventDefault();
    setCursor([
      activeSeriesIndex,
      Math.max(0, Math.min(data.length - 1, next)),
    ]);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    onPointerMove?.(event);
    if (event.defaultPrevented) return;
    const next = applyPointerSelection(
      event.clientX,
      event.clientY,
      event.currentTarget,
      event.target,
    );
    if (next) tooltip?.show("hover", next);
  }

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    const next = applyPointerSelection(
      event.clientX,
      event.clientY,
      event.currentTarget,
      event.target,
    );
    if (next) tooltip?.show("click", next);
  }

  return (
    <div
      {...props}
      className={joinClassNames(chart, className)}
      role="slider"
      aria-label={ariaLabel ?? `${label} data cursor`}
      aria-describedby={
        ariaDescribedBy ? `${ariaDescribedBy} ${descriptionId}` : descriptionId
      }
      aria-valuemax={Math.max(0, data.length - 1)}
      aria-valuenow={active}
      aria-valuetext={valueText}
      aria-disabled={data.length === 0}
      data-chart-type="scatter"
      tabIndex={data.length ? 0 : -1}
      onKeyDown={handleKeyDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        if (!event.defaultPrevented) {
          setDirectSeriesIndex(null);
          tooltip?.hide("hover");
        }
      }}
      onClick={handleClick}
    >
      <svg
        className={svg}
        viewBox={`0 0 ${chartBox.width} ${chartBox.height}`}
        aria-hidden="true"
        focusable="false"
      >
        {[
          model.minY,
          model.minY + (model.maxY - model.minY) / 2,
          model.maxY,
        ].map((value) => (
          <g key={value} className={axis}>
            <path
              className={gridLine}
              d={`M${chartBox.left},${model.y(value)}H${chartBox.width - chartBox.right}`}
            />
            <text
              x={chartBox.left - 4}
              y={model.y(value)}
              dominantBaseline="middle"
              textAnchor="end"
            >
              {formatY(value)}
            </text>
          </g>
        ))}

        {model.series.map((entry, nextSeriesIndex) => (
          <g
            key={entry.id}
            className={joinClassNames(chartTone, seriesGroup)}
            data-chart-series={nextSeriesIndex}
            data-muted={
              directSeriesIndex !== null &&
              directSeriesIndex !== nextSeriesIndex
                ? "true"
                : undefined
            }
            data-tone={
              visibleSeries[nextSeriesIndex]
                ? toneFor(visibleSeries[nextSeriesIndex], nextSeriesIndex)
                : "accent"
            }
          >
            <path className={points} d={entry.path} />
          </g>
        ))}

        {selected && point ? (
          <g
            className={chartTone}
            data-tone={toneFor(selected, activeSeriesIndex)}
          >
            <circle
              className={activeMark}
              cx={model.x(point.x)}
              cy={model.y(point.y)}
              r={5}
            />
          </g>
        ) : null}
      </svg>
      <span className={visuallyHidden} id={descriptionId}>
        {accessibleDescription}
      </span>
    </div>
  );
}
