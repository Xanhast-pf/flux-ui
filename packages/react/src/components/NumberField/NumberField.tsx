import type { ChangeEvent } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { numberField } from "./NumberField.css.js";
import type { NumberFieldProps } from "./NumberField.types.js";
/** Native parsing, form reset, validation and keyboard stepping are kept intact. */
export function NumberField({
  className,
  onChange,
  onValueChange,
  ...props
}: NumberFieldProps) {
  function change(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event);
    if (!event.defaultPrevented) {
      const value = event.currentTarget.valueAsNumber;
      onValueChange?.(Number.isFinite(value) ? value : null, event);
    }
  }
  return (
    <input
      {...props}
      type="number"
      className={joinClassNames(numberField, className)}
      onChange={onValueChange ? change : onChange}
    />
  );
}
