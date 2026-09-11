import { joinClassNames } from "../../internal/joinClassNames.js";
import { code } from "./Code.css.js";
import type { CodeProps } from "./Code.types.js";
export function Code({ className, ...props }: CodeProps) {
  return <code {...props} className={joinClassNames(code, className)} />;
}
