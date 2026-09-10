import { joinClassNames } from "../../internal/joinClassNames.js";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden.js";
import { spinner } from "./Spinner.css.js";
import type { SpinnerProps } from "./Spinner.types.js";
export function Spinner({
  className,
  label = "Loading",
  size = "md",
  ...props
}: SpinnerProps) {
  return (
    <span
      {...props}
      className={joinClassNames(spinner, className)}
      data-size={size}
      role={label === null ? undefined : "status"}
      aria-hidden={label === null ? true : undefined}
    >
      {label === null ? null : <VisuallyHidden>{label}</VisuallyHidden>}
    </span>
  );
}
