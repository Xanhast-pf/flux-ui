import { joinClassNames } from "../../internal/joinClassNames.js";
import { statusBadge } from "./StatusBadge.css.js";
import type { StatusBadgeProps } from "./StatusBadge.types.js";
export function StatusBadge({
  className,
  tone = "neutral",
  ...props
}: StatusBadgeProps) {
  return (
    <span
      {...props}
      className={joinClassNames(statusBadge, className)}
      data-tone={tone}
    />
  );
}
