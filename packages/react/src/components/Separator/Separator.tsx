import { joinClassNames } from "../../internal/joinClassNames.js";
import { separator } from "./Separator.css.js";
import type { SeparatorProps } from "./Separator.types.js";
export function Separator({
  className,
  decorative = false,
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  return (
    <hr
      {...props}
      className={joinClassNames(separator, className)}
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      data-orientation={orientation}
    />
  );
}
