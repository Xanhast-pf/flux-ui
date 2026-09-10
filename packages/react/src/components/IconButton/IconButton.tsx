import { joinClassNames } from "../../internal/joinClassNames.js";
import { iconButton, content } from "./IconButton.css.js";
import type { IconButtonProps } from "./IconButton.types.js";

export function IconButton({
  children,
  className,
  disabled,
  loading = false,
  size = "md",
  tone = "accent",
  type = "button",
  variant = "solid",
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      data-size={size}
      data-tone={tone}
      data-variant={variant}
      className={joinClassNames(iconButton, className)}
    >
      <span className={content}>{children}</span>
    </button>
  );
}
