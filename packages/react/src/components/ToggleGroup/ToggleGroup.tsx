import { createContext, useContext, useState, type MouseEvent } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { RovingFocus, useRovingItem } from "../../internal/RovingFocus.js";
import { root, item } from "./ToggleGroup.css.js";
import type {
  ToggleGroupRootProps,
  ToggleGroupItemProps,
} from "./ToggleGroup.types.js";
type Selection = string | null | readonly string[];
const ToggleGroupContext = createContext<{
  selected: Selection;
  disabled: boolean;
  toggle: (value: string) => void;
} | null>(null);
function includes(selected: Selection, value: string): boolean {
  return typeof selected === "string"
    ? selected === value
    : selected !== null && selected.includes(value);
}
function ToggleGroupRoot({
  className,
  children,
  defaultValue,
  disabled = false,
  loopFocus = true,
  onValueChange,
  orientation = "horizontal",
  type,
  value,
  ...props
}: ToggleGroupRootProps) {
  const [uncontrolled, setUncontrolled] = useState<Selection>(
    defaultValue ?? (type === "single" ? null : []),
  );
  const selected = value === undefined ? uncontrolled : value;
  function toggle(nextValue: string): void {
    if (disabled) return;
    if (type === "single") {
      const next = includes(selected, nextValue) ? null : nextValue;
      if (value === undefined) setUncontrolled(next);
      onValueChange?.(next);
    } else {
      const current =
        typeof selected === "string" || selected === null ? [] : selected;
      const next = current.includes(nextValue)
        ? current.filter((entry) => entry !== nextValue)
        : [...current, nextValue];
      if (value === undefined) setUncontrolled(next);
      onValueChange?.(next);
    }
  }
  return (
    <ToggleGroupContext value={{ selected, disabled, toggle }}>
      <RovingFocus orientation={orientation} loopFocus={loopFocus}>
        <div
          {...props}
          data-flux-roving-root=""
          role="group"
          className={joinClassNames(root, className)}
          data-orientation={orientation}
          data-disabled={disabled || undefined}
        >
          {children}
        </div>
      </RovingFocus>
    </ToggleGroupContext>
  );
}
function ToggleGroupItem({
  className,
  disabled,
  onClick,
  onFocus,
  onKeyDown,
  ref,
  type = "button",
  value,
  ...props
}: ToggleGroupItemProps) {
  const context = useContext(ToggleGroupContext);
  const isDisabled =
    disabled ||
    context?.disabled ||
    props["aria-disabled"] === true ||
    props["aria-disabled"] === "true";
  const roving = useRovingItem({
    ref,
    onFocus,
    onKeyDown,
    disabled: isDisabled,
    hidden: props.hidden,
  });
  if (context === null)
    throw new Error(
      "ToggleGroup.Item must be rendered inside ToggleGroup.Root.",
    );
  const { toggle } = context;
  const pressed = includes(context.selected, value);
  function handleClick(event: MouseEvent<HTMLButtonElement>): void {
    onClick?.(event);
    if (!event.defaultPrevented && !isDisabled) toggle(value);
  }
  return (
    <button
      {...props}
      {...roving}
      className={joinClassNames(item, className)}
      type={type}
      disabled={isDisabled}
      aria-pressed={pressed}
      data-pressed={pressed || undefined}
      data-flux-roving-preferred={pressed || undefined}
      onClick={handleClick}
    />
  );
}
export const ToggleGroup = {
  Root: ToggleGroupRoot,
  Item: ToggleGroupItem,
} as const;
