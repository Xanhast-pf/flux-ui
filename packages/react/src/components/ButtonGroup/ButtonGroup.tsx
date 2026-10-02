import { joinClassNames } from "../../internal/joinClassNames.js";
import { root } from "./ButtonGroup.css.js";
import type { ButtonGroupProps } from "./ButtonGroup.types.js";

/**
 * Semantic attached-edge grouping only. Children own appearance and state;
 * selectable button collections belong to ToggleGroup.
 */
export function ButtonGroup({
  className,
  orientation = "horizontal",
  ...props
}: ButtonGroupProps) {
  return (
    <div
      {...props}
      role="group"
      className={joinClassNames(root, className)}
      data-orientation={orientation}
    />
  );
}
