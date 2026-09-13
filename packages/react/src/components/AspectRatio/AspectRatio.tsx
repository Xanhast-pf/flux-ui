import { joinClassNames } from "../../internal/joinClassNames.js";
import { frame } from "./AspectRatio.css.js";
import type { AspectRatioProps } from "./AspectRatio.types.js";
export function AspectRatio({
  className,
  ratio = 1,
  align,
  style,
  ...props
}: AspectRatioProps) {
  if (!Number.isFinite(ratio) || ratio <= 0)
    throw new RangeError(
      "AspectRatio.ratio must be finite and greater than zero.",
    );
  return (
    <div
      {...props}
      className={joinClassNames(frame, className)}
      style={{
        aspectRatio: ratio,
        display: align === undefined ? undefined : "grid",
        placeItems: align,
        ...style,
      }}
    />
  );
}
