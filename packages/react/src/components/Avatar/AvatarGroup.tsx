import type { ComponentPropsWithRef } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { group } from "./Avatar.css.js";
/** Decorative avatars can overlap; name the group only when adjacent copy does not. */
export function AvatarGroup({
  className,
  ...props
}: ComponentPropsWithRef<"div">) {
  return <div {...props} className={joinClassNames(group, className)} />;
}
