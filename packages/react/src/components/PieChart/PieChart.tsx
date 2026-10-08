import {
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import {
  useChartHiddenIds,
  useChartTooltipBridge,
} from "../../internal/chartComposition.js";
import { chartTone } from "../../internal/chartTone.css.js";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { chart, svg, visuallyHidden } from "../Chart/Chart.css.js";
import type { ChartTone } from "../Chart/Chart.types.js";
import type { ChartTooltipData } from "../ChartTooltip/ChartTooltip.types.js";
import { slice } from "./PieChart.css.js";
import { pieBox, pieIndexAtAngle, pieModel } from "./pieModel.js";
import type { PieChartDatum, PieChartProps } from "./PieChart.types.js";

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

function toneFor(datum: PieChartDatum, index: number): ChartTone {
  return datum.tone ?? tones[index % tones.length] ?? "accent";
}

export function PieChart({
  label,
  description,
  data,
  maxSlices = 64,
  formatValue = (value) => numberFormatter.format(value),
  className,
  onKeyDown,
  onPointerMove,
  onPointerLeave,
  onClick,
  "aria-label": ariaLabel,
  "aria-description": ariaDescription,
  "aria-describedby": ariaDescribedBy,
  ...props
}: PieChartProps) {
  const descriptionId = useId();
  const hiddenIds = useChartHiddenIds();
  const tooltip = useChartTooltipBridge();
  const visibleData = useMemo(
    () => data.filter((item) => !hiddenIds.has(item.id)),
    [data, hiddenIds],
  );
  const toneForDatum = (item: PieChartDatum): ChartTone =>
    toneFor(item, data.indexOf(item));
  const model = useMemo(
    () => pieModel(visibleData, maxSlices),
    [visibleData, maxSlices],
  );
  const [index, setIndex] = useState(0);
  const active = Math.max(0, Math.min(index, visibleData.length - 1));
  const datum = visibleData[active];
  const percent =
    datum && model.total > 0
      ? Math.round((datum.value / model.total) * 1_000) / 10
      : 0;
  const valueText = datum
    ? `${datum.label}: ${formatValue(datum.value)}, ${percent}%`
    : "No chart data";
  const instructions =
    "Arrow keys inspect slices; Home and End reach the endpoints.";
  const accessibleDescription = [ariaDescription, description, instructions]
    .filter(Boolean)
    .join(" ");

  function dataFor(nextIndex: number): ChartTooltipData | null {
    const nextDatum = visibleData[nextIndex];
    const nextSlice = model.slices[nextIndex];
    if (!nextDatum || !nextSlice || model.total <= 0) return null;
    const start = nextIndex === 0 ? 0 : (model.slices[nextIndex - 1]?.end ?? 0);
    const angle = (start + nextSlice.end) / 2 - Math.PI / 2;
    const x = pieBox.centerX + Math.cos(angle) * pieBox.radius * 0.62;
    const y = pieBox.centerY + Math.sin(angle) * pieBox.radius * 0.62;
    const nextPercent =
      Math.round((nextDatum.value / model.total) * 1_000) / 10;
    return {
      items: [
        {
          id: nextDatum.id,
          label: nextDatum.label,
          value: `${formatValue(nextDatum.value)} · ${nextPercent}%`,
          tone: toneForDatum(nextDatum),
        },
      ],
      x: (x / pieBox.width) * 100,
      y: (y / pieBox.height) * 100,
    };
  }

  function locatePointer(
    clientX: number,
    clientY: number,
    node: HTMLDivElement,
  ): number | null {
    if (model.slices.length === 0) return null;
    const bounds = node.getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) return null;
    const x =
      ((clientX - bounds.left) / bounds.width) * pieBox.width - pieBox.centerX;
    const y =
      ((clientY - bounds.top) / bounds.height) * pieBox.height - pieBox.centerY;
    if (Math.hypot(x, y) > pieBox.radius) return null;
    const angle = Math.atan2(y, x) + Math.PI / 2;
    return pieIndexAtAngle(model.slices, angle);
  }

  function applyPointerSelection(
    clientX: number,
    clientY: number,
    node: HTMLDivElement,
  ) {
    const next = locatePointer(clientX, clientY, node);
    if (next === null) return null;
    setIndex(next);
    return dataFor(next);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      visibleData.length === 0
    )
      return;

    let next = active;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = visibleData.length - 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next -= 1;
    else if (event.key === "ArrowRight" || event.key === "ArrowDown") next += 1;
    else return;

    event.preventDefault();
    setIndex((next + visibleData.length) % visibleData.length);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    onPointerMove?.(event);
    if (event.defaultPrevented) return;
    const next = applyPointerSelection(
      event.clientX,
      event.clientY,
      event.currentTarget,
    );
    if (next) tooltip?.show("hover", next);
    else tooltip?.hide("hover");
  }

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    const next = applyPointerSelection(
      event.clientX,
      event.clientY,
      event.currentTarget,
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
      aria-orientation="horizontal"
      aria-valuemin={0}
      aria-valuemax={Math.max(0, visibleData.length - 1)}
      aria-valuenow={active}
      aria-valuetext={valueText}
      aria-disabled={visibleData.length === 0}
      data-chart-type="pie"
      tabIndex={visibleData.length ? 0 : -1}
      onKeyDown={handleKeyDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        if (!event.defaultPrevented) tooltip?.hide("hover");
      }}
      onClick={handleClick}
    >
      <svg
        className={svg}
        viewBox={`0 0 ${pieBox.width} ${pieBox.height}`}
        aria-hidden="true"
        focusable="false"
      >
        {visibleData.map((item, itemIndex) => {
          const path = model.slices[itemIndex]?.path;
          return (
            <g
              key={item.id}
              className={chartTone}
              data-tone={toneForDatum(item)}
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
      <span className={visuallyHidden} id={descriptionId}>
        {accessibleDescription}
      </span>
    </div>
  );
}
