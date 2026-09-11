import { action } from "../../internal/action.css.js";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { link } from "./Link.css.js";
import type { LinkProps } from "./Link.types.js";

/**
 * Navigation stays a native anchor.
 * For unavailable navigation omit href; aria-disabled alone does not disable links.
 */
export function Link({
  variant = "text",
  tone = "accent",
  size = "md",
  className,
  children,
  ...props
}: LinkProps) {
  const actionLike = variant !== "text" && variant !== "navigation";

  return (
    <a
      {...props}
      className={joinClassNames(link, actionLike && action, className)}
      data-size={actionLike ? size : undefined}
      data-tone={actionLike ? tone : undefined}
      data-variant={variant === "text" ? undefined : variant}
    >
      {children}
    </a>
  );
}
