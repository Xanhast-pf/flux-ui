import { joinClassNames } from "../../internal/joinClassNames.js";
import { skipLink } from "./SkipLink.css.js";
import type { SkipLinkProps } from "./SkipLink.types.js";

export function SkipLink({
  className,
  children = "Skip to content",
  ...props
}: SkipLinkProps) {
  return (
    <a {...props} className={joinClassNames(skipLink, className)}>
      {children}
    </a>
  );
}
