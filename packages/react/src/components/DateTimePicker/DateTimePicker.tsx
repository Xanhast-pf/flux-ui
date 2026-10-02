import type { ChangeEvent } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { dateTimePicker } from "./DateTimePicker.css.js";
import type { DateTimePickerProps } from "./DateTimePicker.types.js";

/** Native datetime-local semantics own parsing, validation, forms and picker UI. */
export function DateTimePicker({
  className,
  onChange,
  onValueChange,
  ...props
}: DateTimePickerProps) {
  function change(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event);
    if (!event.defaultPrevented)
      onValueChange?.(event.currentTarget.value, event);
  }

  return (
    <input
      {...props}
      type="datetime-local"
      className={joinClassNames(dateTimePicker, className)}
      onChange={onValueChange ? change : onChange}
    />
  );
}
