import {
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { chartBox } from "../Chart/chartModel.js";
import type { ChartTone } from "../Chart/Chart.types.js";
import {
  activePoint,
  axis,
  caption,
  chart,
  detail,
  gridLine,
  inspector,
  legend,
  legendButton,
  points,
  seriesStyle,
  svg,
} from "./ScatterChart.css.js";
import { nearestRenderedScatterIndex, scatterModel } from "./scatterModel.js";
import type { ScatterChartProps } from "./ScatterChart.types.js";

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

export function ScatterChart({
  label,
  description,
  series,
  maxPoints = 512,
  formatX = formatNumber,
  formatY = formatNumber,
  className,
  ...props
}: ScatterChartProps) {
  const id = useId();
  const model = useMemo(
    () => scatterModel(series, maxPoints),
    [series, maxPoints],
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const selected = series.find((item) => item.id === selectedId) ?? series[0];
  const selectedModel = selected
    ? model.series.find((item) => item.id === selected.id)
    : undefined;
  const data = selected?.data ?? [];
  const active = Math.max(0, Math.min(index, data.length - 1));
  const point = data[active];
  const valueText =
    selected && point
      ? `${selected.label}: ${formatX(point.x)}, ${formatY(point.y)}`
      : "No chart data";

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      data.length === 0
    )
      return;

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
    if (!selectedModel || selectedModel.indexes.length === 0) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) return;
    const x = ((event.clientX - bounds.left) / bounds.width) * chartBox.width;
    const y = ((event.clientY - bounds.top) / bounds.height) * chartBox.height;
    const renderedIndex = nearestRenderedScatterIndex(
      selectedModel.indexes,
      data,
      x,
      y,
      model.x,
      model.y,
    );
    const sourceIndex = selectedModel.indexes[renderedIndex];
    if (sourceIndex !== undefined && sourceIndex !== active)
      setIndex(sourceIndex);
  }

  return (
    <figure {...props} className={joinClassNames(chart, className)}>
      <figcaption className={caption}>{label}</figcaption>
      {description ? <p className={detail}>{description}</p> : null}

      <div className={legend}>
        {series.map((item, seriesIndex) => (
          <button
            key={item.id}
            type="button"
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
        Select a series. Arrow keys inspect source points; Home and End reach
        the endpoints.
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

          {model.series.map((entry, seriesIndex) => (
            <g
              key={entry.id}
              className={seriesStyle}
              data-tone={
                series[seriesIndex]?.tone ?? tones[seriesIndex % tones.length]
              }
            >
              <path
                className={points}
                data-active={selected?.id === entry.id}
                d={entry.path}
              />
            </g>
          ))}

          {selected && point ? (
            <g
              className={seriesStyle}
              data-tone={
                selected.tone ??
                tones[Math.max(0, series.indexOf(selected)) % tones.length]
              }
            >
              <circle
                className={activePoint}
                cx={model.x(point.x)}
                cy={model.y(point.y)}
                r={5}
              />
            </g>
          ) : null}
        </svg>
      </div>
    </figure>
  );
}
