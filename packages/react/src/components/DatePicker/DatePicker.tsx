import type { ChangeEvent } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { datePicker } from "./DatePicker.css.js";
import type { DatePickerProps } from "./DatePicker.types.js";

/** Native date semantics own parsing, validation, forms and picker UI. */
export function DatePicker({
  className,
  onChange,
  onValueChange,
  ...props
}: DatePickerProps) {
  function change(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event);
    if (!event.defaultPrevented) onValueChange?.(event.currentTarget.value);
  }

  return (
    <input
      {...props}
      data-invalid={props["aria-invalid"]}
      type="date"
      className={joinClassNames(datePicker, className)}
      onChange={onValueChange ? change : onChange}
    />
  );
}
