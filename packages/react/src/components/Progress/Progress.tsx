import { joinClassNames } from "../../internal/joinClassNames.js";
import { progress } from "./Progress.css.js";
import type { ProgressProps } from "./Progress.types.js";
export function Progress({
  className,
  max = 100,
  value,
  ...props
}: ProgressProps) {
  return (
    <progress
      {...props}
      className={joinClassNames(progress, className)}
      max={max}
      value={value}
    />
  );
}
