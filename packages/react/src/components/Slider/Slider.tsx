import type { ChangeEvent } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { slider } from "./Slider.css.js";
import type { SliderProps } from "./Slider.types.js";
/** A single native range control; not a multi-thumb selection widget. */
export function Slider({
  className,
  onChange,
  onValueChange,
  ...props
}: SliderProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const value = event.currentTarget.valueAsNumber;
    onChange?.(event);
    if (!event.defaultPrevented) onValueChange?.(value, event);
  }
  return (
    <input
      {...props}
      className={joinClassNames(slider, className)}
      onChange={onValueChange ? handleChange : onChange}
      type="range"
    />
  );
}
