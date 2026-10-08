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
import { chartBox, chartModel, nearestChartIndex } from "./chartModel.js";
import {
  activeMark,
  axis,
  chart,
  cursor,
  gridLine,
  seriesGroup,
  svg,
  visuallyHidden,
} from "./Chart.css.js";
import type { ChartTooltipData } from "../ChartTooltip/ChartTooltip.types.js";
import type { ChartProps, ChartSeries, ChartTone } from "./Chart.types.js";

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

function toneFor(series: ChartSeries, index: number): ChartTone {
  return series.tone ?? tones[index % tones.length] ?? "accent";
}

export function Chart({
  label,
  description,
  series,
  type = "line",
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
}: ChartProps) {
  const descriptionId = useId();
  const hiddenIds = useChartHiddenIds();
  const tooltip = useChartTooltipBridge();
  const visibleSeries = useMemo(
    () => series.filter((item) => !hiddenIds.has(item.id)),
    [series, hiddenIds],
  );
  const toneForSeries = (item: ChartSeries): ChartTone =>
    toneFor(item, series.indexOf(item));
  const model = useMemo(
    () => chartModel(visibleSeries, maxPoints, type),
    [visibleSeries, maxPoints, type],
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
  const directX =
    point && directSeriesIndex !== null
      ? model.x(point.x) +
        (type === "bar"
          ? (activeSeriesIndex - visibleSeries.length / 2 + 0.5) *
            model.barWidth
          : 0)
      : 0;
  const valueText = point
    ? `${selected?.label}: ${formatX(point.x)}, ${point.y === null ? "No value" : formatY(point.y)}`
    : "No chart data";
  const accessibleDescription = [
    ariaDescription,
    description,
    "Left/right inspect samples; up/down change series; Home/End reach endpoints.",
  ]
    .filter(Boolean)
    .join(" ");

  function pointerPosition(
    clientX: number,
    clientY: number,
    node: HTMLDivElement,
  ): { py: number; value: number } | null {
    if (visibleSeries.length === 0) return null;
    const bounds = node.getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) return null;
    const px = ((clientX - bounds.left) / bounds.width) * chartBox.width;
    const py = ((clientY - bounds.top) / bounds.height) * chartBox.height;
    const plotX = Math.max(
      chartBox.left,
      Math.min(chartBox.width - chartBox.right, px),
    );
    return {
      py,
      value:
        model.minX +
        ((plotX - chartBox.left) /
          (chartBox.width - chartBox.left - chartBox.right)) *
          (model.maxX - model.minX),
    };
  }

  function nearestXPoint(value: number): readonly [number, number] | null {
    let bestSeries = 0;
    let bestIndex = 0;
    let bestDistance = Infinity;
    for (
      let nextSeriesIndex = 0;
      nextSeriesIndex < visibleSeries.length;
      nextSeriesIndex += 1
    ) {
      const nextSeries = visibleSeries[nextSeriesIndex];
      if (!nextSeries || nextSeries.data.length === 0) continue;
      const nextIndex = nearestChartIndex(nextSeries.data, value);
      const nextPoint = nextSeries.data[nextIndex];
      if (!nextPoint) continue;
      const distance = Math.abs(nextPoint.x - value);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestSeries = nextSeriesIndex;
        bestIndex = nextIndex;
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

    const hitSeriesIndex = chartSeriesIndexFromTarget(target, node);
    if (
      hitSeriesIndex !== null &&
      hitSeriesIndex >= 0 &&
      hitSeriesIndex < visibleSeries.length
    ) {
      const hitSeries = visibleSeries[hitSeriesIndex];
      if (hitSeries && hitSeries.data.length > 0) {
        const hitIndex = nearestChartIndex(hitSeries.data, position.value);
        const hitPoint = hitSeries.data[hitIndex];
        if (hitPoint && hitPoint.y !== null) {
          setCursor([hitSeriesIndex, hitIndex]);
          setDirectSeriesIndex(hitSeriesIndex);
          return {
            label: formatX(hitPoint.x),
            items: [
              {
                id: hitSeries.id,
                label: hitSeries.label,
                value: formatY(hitPoint.y),
                tone: toneForSeries(hitSeries),
              },
            ],
            x: (model.x(hitPoint.x) / chartBox.width) * 100,
            y: (model.y(hitPoint.y) / chartBox.height) * 100,
          };
        }
      }
    }

    setDirectSeriesIndex(null);
    const next = nearestXPoint(position.value);
    if (!next) return null;
    setCursor(next);
    const bucketPoint = visibleSeries[next[0]]?.data[next[1]];
    if (!bucketPoint) return null;
    const bucketX = bucketPoint.x;
    const items = visibleSeries.flatMap((item) => {
      if (item.data.length === 0) return [];
      const itemPoint = item.data[nearestChartIndex(item.data, bucketX)];
      if (!itemPoint) return [];
      return [
        {
          id: item.id,
          label: item.label,
          value: itemPoint.y === null ? "No value" : formatY(itemPoint.y),
          tone: toneForSeries(item),
        },
      ];
    });
    if (items.length === 0) return null;
    return {
      label: formatX(bucketX),
      items,
      x: (model.x(bucketX) / chartBox.width) * 100,
      y: (position.py / chartBox.height) * 100,
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
      data-chart-type={type}
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
        {model.paths.map((paths, nextSeriesIndex) => (
          <g
            key={paths.id}
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
                ? toneForSeries(visibleSeries[nextSeriesIndex])
                : "accent"
            }
          >
            {type === "area" ? (
              <path d={paths.area} fill="currentColor" opacity={0.15} />
            ) : null}
            <path
              d={type === "bar" ? paths.bars : paths.line}
              fill={type === "bar" ? "currentColor" : "none"}
              stroke={type === "bar" ? "none" : "currentColor"}
              strokeWidth={2}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              strokeDasharray={
                type !== "bar" && nextSeriesIndex > 0
                  ? `${nextSeriesIndex * 3} 3`
                  : undefined
              }
            />
          </g>
        ))}
        {point ? (
          <path
            className={cursor}
            d={`M${model.x(point.x)},${chartBox.top}V${chartBox.height - chartBox.bottom}`}
          />
        ) : null}
        {directSeriesIndex !== null &&
        selected &&
        point?.y !== null &&
        point ? (
          <g className={chartTone} data-tone={toneForSeries(selected)}>
            <circle
              className={activeMark}
              cx={directX}
              cy={model.y(point.y)}
              r={4.5}
            />
          </g>
        ) : null}
        <g className={axis}>
          <text x={chartBox.left} y={chartBox.height - 8}>
            {formatX(model.minX)}
          </text>
          <text
            x={chartBox.width - chartBox.right}
            y={chartBox.height - 8}
            textAnchor="end"
          >
            {formatX(model.maxX)}
          </text>
        </g>
      </svg>
      <span className={visuallyHidden} id={descriptionId}>
        {accessibleDescription}
      </span>
    </div>
  );
}
