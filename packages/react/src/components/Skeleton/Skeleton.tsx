import { joinClassNames } from "../../internal/joinClassNames.js";
import { skeleton } from "./Skeleton.css.js";
import type { SkeletonProps } from "./Skeleton.types.js";
/** Decorative only: label the containing loading region, not each placeholder. */
export function Skeleton({
  className,
  shape = "line",
  ...props
}: SkeletonProps) {
  return (
    <span
      {...props}
      aria-hidden="true"
      className={joinClassNames(skeleton, className)}
      data-shape={shape}
    />
  );
}
