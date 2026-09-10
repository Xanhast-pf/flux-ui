import type { ChangeEvent } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { switchControl } from "./Switch.css.js";
import type { SwitchProps } from "./Switch.types.js";
/** Two-state native form control. Its label must stay constant when toggled. */
export function Switch({
  className,
  onChange,
  onCheckedChange,
  ...props
}: SwitchProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const checked = event.currentTarget.checked;
    onChange?.(event);
    if (!event.defaultPrevented) onCheckedChange?.(checked, event);
  }
  return (
    <input
      {...props}
      className={joinClassNames(switchControl, className)}
      onChange={onCheckedChange ? handleChange : onChange}
      role="switch"
      type="checkbox"
    />
  );
}
