import { useCallback, useRef, type ChangeEvent } from "react";
import { attachRef } from "../../internal/attachRef.js";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { slider } from "./Slider.css.js";
import type { SliderProps } from "./Slider.types.js";
/** One native range control, with optional orientation and a custom static skin. */
export function Slider({
  className,
  ref,
  orientation = "horizontal",
  appearance = "native",
  resetValue,
  value,
  onDoubleClick,
  onChange,
  onValueChange,
  ...props
}: SliderProps) {
  const initial = useRef<number | undefined>(undefined);
  const setInput = useCallback(
    (node: HTMLInputElement | null) => {
      if (node === null) return;
      // Capture the actual browser-normalized initial position, including step.
      initial.current ??= node.valueAsNumber;
      return attachRef(ref, node);
    },
    [ref],
  );
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const next = event.currentTarget.valueAsNumber;
    onChange?.(event);
    if (!event.defaultPrevented) onValueChange?.(next, event);
  }
  return (
    <input
      {...props}
      ref={setInput}
      value={value}
      aria-orientation={orientation}
      data-orientation={orientation}
      data-appearance={appearance}
      className={joinClassNames(slider, className)}
      onChange={onValueChange ? handleChange : onChange}
      onDoubleClick={(event) => {
        onDoubleClick?.(event);
        if (event.defaultPrevented || props.disabled) return;
        if (
          value !== undefined &&
          (resetValue === undefined || (!onChange && !onValueChange))
        )
          return;
        const target = resetValue ?? initial.current;
        if (target === undefined || !Number.isFinite(target)) return;
        const input = event.currentTarget;
        if (input.matches(":disabled")) return;
        const view = input.ownerDocument.defaultView;
        if (view === null) return;
        const previous = input.value;
        // The numeric platform setter sanitizes bounds/steps without updating
        // React's string-value tracker, preserving its real change-event path.
        input.valueAsNumber = target;
        if (input.value !== previous)
          input.dispatchEvent(new view.Event("input", { bubbles: true }));
      }}
      type="range"
    />
  );
}
