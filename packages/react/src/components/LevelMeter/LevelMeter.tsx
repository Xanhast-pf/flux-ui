import type { CSSProperties } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { meter, track, fill, peakStyle, clip } from "./LevelMeter.css.js";
import type { LevelMeterProps } from "./LevelMeter.types.js";
export function LevelMeter({
  value,
  min = -60,
  max = 0,
  peak,
  clipped = value >= max,
  orientation = "vertical",
  className,
  style,
  "aria-valuetext": valueText,
  ...props
}: LevelMeterProps) {
  if (
    ![value, min, max, peak ?? value].every(Number.isFinite) ||
    max <= min ||
    !Number.isFinite(max - min)
  )
    throw new RangeError(
      "LevelMeter needs a finite value and increasing domain.",
    );
  const fraction = (input: number) =>
    Math.max(0, Math.min(1, (input - min) / (max - min)));
  return (
    <div
      {...props}
      className={joinClassNames(meter, className)}
      role="meter"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={Math.max(min, Math.min(max, value))}
      aria-valuetext={
        valueText ??
        `${value}${peak === undefined ? "" : `, peak ${peak}`}${clipped ? ", clipping" : ""}`
      }
      data-orientation={orientation}
      style={
        {
          "--f-level": `${fraction(value) * 100}%`,
          "--f-peak": `${fraction(peak ?? value) * 100}%`,
          ...style,
        } as CSSProperties
      }
    >
      <span className={track} aria-hidden="true">
        <span className={fill} />
        <span className={peakStyle} />
      </span>
      <span className={clip} aria-hidden="true">
        {clipped ? "CLIP" : "—"}
      </span>
    </div>
  );
}
