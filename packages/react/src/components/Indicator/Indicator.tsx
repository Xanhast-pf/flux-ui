import { joinClassNames } from "../../internal/joinClassNames.js";
import { marker, root } from "./Indicator.css.js";
import type { IndicatorProps } from "./Indicator.types.js";

export function Indicator({
  children,
  className,
  content,
  max = 99,
  placement = "top-end",
  tone = "danger",
  ...props
}: IndicatorProps) {
  if (!Number.isInteger(max) || max < 1)
    throw new RangeError("Indicator.max must be a positive integer.");
  if (typeof content === "number" && (!Number.isFinite(content) || content < 0))
    throw new RangeError(
      "Indicator numeric content must be finite and non-negative.",
    );

  const displayed =
    typeof content === "number" && content > max ? `${max}+` : content;
  const dot = content === undefined;

  return (
    <span
      {...props}
      className={joinClassNames(root, className)}
      data-placement={placement}
    >
      {children}
      <span
        aria-hidden="true"
        className={marker}
        data-dot={dot || undefined}
        data-tone={tone}
      >
        {dot ? null : displayed}
      </span>
    </span>
  );
}
