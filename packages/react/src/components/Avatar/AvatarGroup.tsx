import { joinClassNames } from "../../internal/joinClassNames.js";
import { group } from "./Avatar.css.js";
import type { AvatarGroupProps } from "./Avatar.types.js";
/** Decorative avatars can overlap; name the group only when adjacent copy does not. */
export function AvatarGroup({ className, ...props }: AvatarGroupProps) {
  return <div {...props} className={joinClassNames(group, className)} />;
}
