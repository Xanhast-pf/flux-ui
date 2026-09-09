import { joinClassNames } from "../../internal/joinClassNames.js";
import { button, content, spinner } from "./Button.css.js";
import type { ButtonProps } from "./Button.types.js";

export function Button({
  children,
  className,
  disabled,
  endIcon,
  loading = false,
  size = "md",
  startIcon,
  tone = "accent",
  variant = "solid",
  ...buttonProps
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...buttonProps}
      aria-busy={loading || undefined}
      className={joinClassNames(button({ size, tone, variant }), className)}
      data-loading={loading || undefined}
      disabled={isDisabled}
    >
      {loading ? <span aria-hidden="true" className={spinner} /> : null}
      <span className={content}>
        {startIcon}
        {children}
        {endIcon}
      </span>
    </button>
  );
}
