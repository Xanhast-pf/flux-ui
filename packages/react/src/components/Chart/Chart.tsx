import {
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { chartBox, chartModel, nearestChartIndex } from "./chartModel.js";
import {
  gridLine,
  axis,
  chart,
  cursor,
  inspector,
  legend,
  legendButton,
  seriesStyle,
  svg,
  caption,
  detail,
} from "./Chart.css.js";
import type { ChartProps, ChartTone } from "./Chart.types.js";
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
export function Chart({
  label,
  description,
  series,
  type = "line",
  maxPoints = 512,
  formatX = formatNumber,
  formatY = formatNumber,
  className,
  ...props
}: ChartProps) {
  const id = useId();
  const model = useMemo(
    () => chartModel(series, maxPoints, type),
    [series, maxPoints, type],
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const selected = series.find((item) => item.id === selectedId) ?? series[0];
  const data = selected?.data ?? [];
  const active = Math.max(0, Math.min(index, data.length - 1));
  const point = data[active];
  const valueText = point
    ? `${selected?.label}: ${formatX(point.x)}, ${point.y === null ? "No value" : formatY(point.y)}`
    : "No chart data";
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    let next = active;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = data.length - 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowDown") next -= 1;
    else if (event.key === "ArrowRight" || event.key === "ArrowUp") next += 1;
    else return;
    event.preventDefault();
    setIndex(Math.max(0, Math.min(data.length - 1, next)));
  }
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width === 0) return;
    const location =
      (((event.clientX - bounds.left) / bounds.width) * chartBox.width -
        chartBox.left) /
      (chartBox.width - chartBox.left - chartBox.right);
    const value = model.minX + location * (model.maxX - model.minX);
    const next = nearestChartIndex(data, value);
    if (next !== active) setIndex(next);
  }
  return (
    <figure {...props} className={joinClassNames(chart, className)}>
      <figcaption className={caption}>{label}</figcaption>
      {description ? <p className={detail}>{description}</p> : null}
      <div className={legend}>
        {series.map((item, seriesIndex) => (
          <button
            type="button"
            key={item.id}
            className={legendButton}
            aria-pressed={selected?.id === item.id}
            onClick={() => {
              setSelectedId(item.id);
              setIndex(0);
            }}
          >
            <span aria-hidden="true">{seriesIndex + 1}.</span> {item.label}
          </button>
        ))}
      </div>
      <p className={detail} id={`${id}-help`}>
        Select a series. Arrow keys inspect data; Home and End reach the
        endpoints.
      </p>
      <div
        className={inspector}
        role="slider"
        aria-label={`${label} data cursor`}
        aria-describedby={`${id}-help`}
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={Math.max(0, data.length - 1)}
        aria-valuenow={active}
        aria-valuetext={valueText}
        aria-disabled={data.length === 0}
        tabIndex={data.length ? 0 : -1}
        onKeyDown={onKeyDown}
        onPointerMove={onPointerMove}
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
          {model.paths.map((paths, seriesIndex) => (
            <g
              key={paths.id}
              className={seriesStyle}
              data-tone={
                series[seriesIndex]?.tone ?? tones[seriesIndex % tones.length]
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
                  type !== "bar" && seriesIndex > 0
                    ? `${seriesIndex * 3} 3`
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
      </div>
      <p className={detail}>{valueText}</p>
      <p className={detail}>
        {model.sourcePoints.toLocaleString()} source samples ·{" "}
        {model.renderedPoints.toLocaleString()} rendered samples.{" "}
        {type === "bar"
          ? "All categories are shown."
          : "Reduction preserves gaps, endpoints and bucket extrema."}
      </p>
    </figure>
  );
}
