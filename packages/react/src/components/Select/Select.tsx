import { joinClassNames } from "../../internal/joinClassNames.js";
import { select } from "./Select.css.js";
import type { SelectProps } from "./Select.types.js";
export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select {...props} className={joinClassNames(select, className)}>
      {children}
    </select>
  );
}
