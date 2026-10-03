import { useState, type MouseEvent } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { toggle } from "./Toggle.css.js";
import type { ToggleProps } from "./Toggle.types.js";
export function Toggle({
  size,
  variant = "outline",
  className,
  defaultPressed = false,
  disabled,
  onClick,
  onPressedChange,
  pressed: controlled,
  type = "button",
  ...props
}: ToggleProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultPressed);
  const pressed = controlled ?? uncontrolled;
  function handleClick(event: MouseEvent<HTMLButtonElement>): void {
    onClick?.(event);
    if (event.defaultPrevented || disabled) return;
    if (controlled === undefined) setUncontrolled(!pressed);
    onPressedChange?.(!pressed);
  }
  return (
    <button
      {...props}
      className={joinClassNames(toggle, className)}
      type={type}
      disabled={disabled}
      aria-pressed={pressed}
      data-s={size}
      data-a={variant === "outline" ? undefined : variant}
      onClick={handleClick}
    />
  );
}
