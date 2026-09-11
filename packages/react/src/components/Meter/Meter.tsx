import { joinClassNames } from "../../internal/joinClassNames.js";
import { meter } from "./Meter.css.js";
import type { MeterProps } from "./Meter.types.js";
export function Meter({
  value,
  min = 0,
  max = 1,
  className,
  ...props
}: MeterProps) {
  if (
    !Number.isFinite(value) ||
    !Number.isFinite(min) ||
    !Number.isFinite(max) ||
    max <= min
  ) {
    throw new RangeError(
      "Meter requires finite values and max greater than min; unknown data is not zero.",
    );
  }
  return (
    <meter
      {...props}
      min={min}
      max={max}
      value={value}
      className={joinClassNames(meter, className)}
    />
  );
}
