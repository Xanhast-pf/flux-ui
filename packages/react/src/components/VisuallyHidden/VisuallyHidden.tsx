import { joinClassNames } from "../../internal/joinClassNames.js";
import { hidden } from "./VisuallyHidden.css.js";
import type { VisuallyHiddenProps } from "./VisuallyHidden.types.js";
export function VisuallyHidden({ className, ...props }: VisuallyHiddenProps) {
  return <span {...props} className={joinClassNames(hidden, className)} />;
}
