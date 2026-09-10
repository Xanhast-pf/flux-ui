import { joinClassNames } from "../../internal/joinClassNames.js";
import { badge } from "./Badge.css.js";
import type { BadgeProps } from "./Badge.types.js";
export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      {...props}
      className={joinClassNames(badge, className)}
      data-tone={tone}
    />
  );
}
