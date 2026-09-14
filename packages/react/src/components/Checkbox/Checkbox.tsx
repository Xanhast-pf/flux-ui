import { useCallback, type ChangeEvent } from "react";
import { attachRef } from "../../internal/attachRef.js";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { checkbox } from "./Checkbox.css.js";
import type { CheckboxProps } from "./Checkbox.types.js";

export function Checkbox({
  className,
  indeterminate = false,
  onChange,
  onCheckedChange,
  ref,
  ...inputProps
}: CheckboxProps) {
  // A stable ref avoids detaching consumer refs on unrelated renders. Changing
  // the mixed prop reattaches the ref to synchronize the DOM-only property.
  const setInput = useCallback(
    (node: HTMLInputElement | null) => {
      if (node === null) return undefined;
      node.indeterminate = indeterminate;
      return attachRef(ref, node);
    },
    [indeterminate, ref],
  );

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const nextChecked = event.currentTarget.checked;
    // Native activation clears indeterminate. Keep the prop authoritative and
    // restore it before callbacks, so a consumer's synchronous update wins.
    event.currentTarget.indeterminate = indeterminate;
    onChange?.(event);
    if (!event.defaultPrevented) onCheckedChange?.(nextChecked, event);
  }

  return (
    <input
      {...inputProps}
      className={joinClassNames(checkbox, className)}
      onChange={indeterminate || onCheckedChange ? handleChange : onChange}
      ref={setInput}
      type="checkbox"
    />
  );
}
