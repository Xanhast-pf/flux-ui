import type { ChangeEvent } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { timePicker } from "./TimePicker.css.js";
import type { TimePickerProps } from "./TimePicker.types.js";

/** Native time semantics own parsing, validation, forms and picker UI. */
export function TimePicker({
  className,
  onChange,
  onValueChange,
  ...props
}: TimePickerProps) {
  function change(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event);
    if (!event.defaultPrevented) onValueChange?.(event.currentTarget.value);
  }

  return (
    <input
      {...props}
      data-invalid={props["aria-invalid"]}
      type="time"
      className={joinClassNames(timePicker, className)}
      onChange={onValueChange ? change : onChange}
    />
  );
}
