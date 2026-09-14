import { joinClassNames } from "../../internal/joinClassNames.js";
import { remove, tag } from "./Tag.css.js";
import type { TagProps } from "./Tag.types.js";
export function Tag({
  children,
  className,
  onRemove,
  removeLabel,
  tone = "neutral",
  ...props
}: TagProps) {
  return (
    <span
      {...props}
      className={joinClassNames(tag, className)}
      data-tone={tone}
    >
      {children}
      {onRemove !== undefined ? (
        <button
          type="button"
          aria-label={removeLabel}
          className={remove}
          onClick={onRemove}
        >
          <span aria-hidden="true">×</span>
        </button>
      ) : null}
    </span>
  );
}
