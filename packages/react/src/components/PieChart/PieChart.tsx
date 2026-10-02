import {
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import type { ChartTone } from "../Chart/Chart.types.js";
import {
  caption,
  chart,
  detail,
  inspector,
  legend,
  legendButton,
  seriesStyle,
  slice,
  svg,
} from "./PieChart.css.js";
import { pieBox, pieIndexAtAngle, pieModel } from "./pieModel.js";
import type { PieChartProps } from "./PieChart.types.js";

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
export function PieChart({
  label,
  description,
  data,
  maxSlices = 64,
  formatValue = (value) => numberFormatter.format(value),
  className,
  ...props
}: PieChartProps) {
  const id = useId();
  const model = useMemo(() => pieModel(data, maxSlices), [data, maxSlices]);
  const [index, setIndex] = useState(0);
  const active = Math.max(0, Math.min(index, data.length - 1));
  const datum = data[active];
  const valueText = datum
    ? `${datum.label}: ${formatValue(datum.value)}, ${Math.round((datum.value / model.total) * 1_000) / 10}%`
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
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next -= 1;
    else if (event.key === "ArrowRight" || event.key === "ArrowDown") next += 1;
    else return;

    event.preventDefault();
    setIndex((next + data.length) % data.length);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (model.slices.length === 0) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) return;
    const x =
      ((event.clientX - bounds.left) / bounds.width) * pieBox.width -
      pieBox.centerX;
    const y =
      ((event.clientY - bounds.top) / bounds.height) * pieBox.height -
      pieBox.centerY;
    const angle = Math.atan2(y, x) + Math.PI / 2;
    const next = pieIndexAtAngle(model.slices, angle);
    if (next !== active) setIndex(next);
  }

  return (
    <figure {...props} className={joinClassNames(chart, className)}>
      <figcaption className={caption}>{label}</figcaption>
      {description ? <p className={detail}>{description}</p> : null}

      <div className={legend}>
        {data.map((item, itemIndex) => (
          <button
            key={item.id}
            type="button"
            className={legendButton}
            aria-pressed={active === itemIndex}
            onClick={() => setIndex(itemIndex)}
          >
            <span aria-hidden="true">{itemIndex + 1}.</span> {item.label}
          </button>
        ))}
      </div>

      <p className={detail} id={`${id}-help`}>
        Arrow keys inspect slices; Home and End reach the endpoints.
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
          viewBox={`0 0 ${pieBox.width} ${pieBox.height}`}
          aria-hidden="true"
          focusable="false"
        >
          {data.map((item, itemIndex) => {
            const path = model.slices[itemIndex]?.path;
            return (
              <g
                key={item.id}
                className={seriesStyle}
                data-tone={item.tone ?? tones[itemIndex % tones.length]}
              >
                {path ? (
                  <path
                    className={slice}
                    d={path}
                    fill="currentColor"
                    data-active={active === itemIndex}
                  />
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}
