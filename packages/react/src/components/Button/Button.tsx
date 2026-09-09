import { button, content, spinner } from "./Button.css.js";
import type { ButtonProps } from "./Button.types.js";
import { joinClassNames } from "../../internal/joinClassNames.js";

export function Button({
  children,
  className,
  disabled,
  intent = "accent",
  leadingIcon,
  loading = false,
  size = "md",
  trailingIcon,
  variant = "solid",
  ...buttonProps
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...buttonProps}
      aria-busy={loading || undefined}
      className={joinClassNames(button({ intent, size, variant }), className)}
      data-loading={loading || undefined}
      disabled={isDisabled}
    >
      {loading ? <span aria-hidden="true" className={spinner} /> : null}
      <span className={content}>
        {leadingIcon}
        {children}
        {trailingIcon}
      </span>
    </button>
  );
}
