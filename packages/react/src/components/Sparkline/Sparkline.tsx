import { joinClassNames } from "../../internal/joinClassNames.js";
import { sparkline } from "./Sparkline.css.js";
import type { SparklineProps } from "./Sparkline.types.js";
export function Sparkline({
  values,
  label,
  className,
  ...props
}: SparklineProps) {
  if (values.length > 2048)
    throw new RangeError(
      "Sparkline supports up to 2048 samples; reduce upstream for dense data.",
    );
  let min = Infinity,
    max = -Infinity;
  for (const value of values) {
    if (value === null) continue;
    if (!Number.isFinite(value))
      throw new RangeError("Sparkline values must be finite or null.");
    min = Math.min(min, value);
    max = Math.max(max, value);
  }
  if (Number.isFinite(min) && !Number.isFinite(max - min))
    throw new RangeError("Sparkline range exceeds numeric precision.");
  let d = "",
    connected = false;
  for (const [index, value] of values.entries()) {
    if (value === null) {
      connected = false;
      continue;
    }
    const x = 2 + (index / Math.max(1, values.length - 1)) * 96;
    const y = max === min ? 16 : 30 - ((value - min) / (max - min)) * 28;
    d += `${connected ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}${connected ? "" : "l0,0"} `;
    connected = true;
  }
  return (
    <svg
      {...props}
      className={joinClassNames(sparkline, className)}
      viewBox="0 0 100 32"
      role="img"
      aria-label={label}
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
