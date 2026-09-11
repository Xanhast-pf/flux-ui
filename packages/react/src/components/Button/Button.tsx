import { action } from "../../internal/action.css.js";
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
  type = "button",
  variant = "solid",
  ...buttonProps
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...buttonProps}
      aria-busy={loading || undefined}
      className={joinClassNames(action, button, className)}
      data-size={size}
      data-tone={tone}
      data-variant={variant}
      data-loading={loading || undefined}
      disabled={isDisabled}
      type={type}
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
