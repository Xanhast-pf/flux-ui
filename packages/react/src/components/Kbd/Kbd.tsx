import { joinClassNames } from "../../internal/joinClassNames.js";
import { kbd } from "./Kbd.css.js";
import type { KbdProps } from "./Kbd.types.js";
export function Kbd({ className, ...props }: KbdProps) {
  return <kbd {...props} className={joinClassNames(kbd, className)} />;
}
