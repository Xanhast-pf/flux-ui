import { joinClassNames } from "../../internal/joinClassNames.js";
import { progress } from "./Progress.css.js";
import type { ProgressProps } from "./Progress.types.js";
export function Progress({
  className,
  max = 100,
  value,
  ...props
}: ProgressProps) {
  // x * 0 !== 0 flags NaN/±Infinity; finite numbers produce zero.
  if (max <= 0 || max * 0 !== 0 || (value ?? 0) * 0 !== 0) {
    throw new RangeError();
  }
  return (
    <progress
      {...props}
      className={joinClassNames(progress, className)}
      max={max}
      value={value}
    />
  );
}
