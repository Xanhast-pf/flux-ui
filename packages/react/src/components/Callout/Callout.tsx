import { joinClassNames } from "../../internal/joinClassNames.js";
import { callout } from "./Callout.css.js";
import type { CalloutProps } from "./Callout.types.js";
export function Callout({
  className,
  tone = "info",
  role = "note",
  ...props
}: CalloutProps) {
  return (
    <div
      {...props}
      role={role}
      className={joinClassNames(callout, className)}
      data-tone={tone}
    />
  );
}
