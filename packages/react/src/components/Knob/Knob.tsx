import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import {
  knobFraction,
  knobValue,
  snapKnob,
  stepKnob,
  validateKnob,
} from "./knobMath.js";
import { knob, dial, indicator, readout } from "./Knob.css.js";
import type { KnobProps } from "./Knob.types.js";
const keySteps: Readonly<Partial<Record<string, number>>> = {
  Home: -Infinity,
  End: Infinity,
  ArrowUp: 1,
  ArrowRight: 1,
  ArrowDown: -1,
  ArrowLeft: -1,
  PageUp: 10,
  PageDown: -10,
};
const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 3,
});
const formatNumber = (value: number): string => numberFormatter.format(value);
export function Knob({
  value: controlled,
  size = "md",
  resetValue,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  scale = "linear",
  disabled = false,
  formatValue = formatNumber,
  onValueChange,
  onValueCommit,
  className,
  style,
  onDoubleClick,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onLostPointerCapture,
  onKeyDown,
  onKeyUp,
  onBlur,
  tabIndex,
  ...props
}: KnobProps) {
  validateKnob(min, max, step, scale);
  const [localValue, setLocalValue] = useState(defaultValue);
  const state = useRef<{
    reset: number;
    key: boolean;
    pointer: null | {
      id: number;
      y: number;
      fraction: number;
      start: number;
      value: number;
    };
  }>({ reset: defaultValue, key: false, pointer: null }).current;
  if (resetValue !== undefined && !Number.isFinite(resetValue))
    throw new RangeError("Knob.resetValue must be finite.");
  const raw = controlled ?? localValue;
  if (!Number.isFinite(raw)) throw new RangeError("Knob.value must be finite.");
  const value = Math.max(min, Math.min(max, raw));
  const text = formatValue(value);

  // Change publication is shared by keyboard, pointer, cancellation and reset.
  function publish(next: number, commit = false) {
    if (next === value) return;
    if (controlled === undefined) setLocalValue(next);
    onValueChange?.(next);
    if (commit) onValueCommit?.(next);
  }
  function finishKey(commit: boolean) {
    if (!state.key) return;
    state.key = false;
    if (commit && !disabled) onValueCommit?.(value);
  }
  function cancelPointer(event: PointerEvent<HTMLDivElement>) {
    const pointer = state.pointer;
    if (!pointer || pointer.id !== event.pointerId) return;
    state.pointer = null;
    publish(pointer.start);
  }

  return (
    <div
      {...props}
      className={joinClassNames(knob, className)}
      role="slider"
      data-size={size}
      aria-orientation="vertical"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={text}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : (tabIndex ?? 0)}
      style={
        {
          "--f-knob-angle": `${knobFraction(value, min, max, scale) * 270}deg`,
          ...style,
        } as CSSProperties
      }
      onDoubleClick={(event) => {
        onDoubleClick?.(event);
        if (
          disabled ||
          event.defaultPrevented ||
          (controlled !== undefined && resetValue === undefined)
        )
          return;
        const pointer = state.pointer;
        state.pointer = null;
        state.key = false;
        if (pointer && event.currentTarget.hasPointerCapture(pointer.id))
          event.currentTarget.releasePointerCapture(pointer.id);
        publish(snapKnob(resetValue ?? state.reset, min, max, step), true);
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (
          disabled ||
          event.defaultPrevented ||
          !event.isPrimary ||
          event.button !== 0
        )
          return;
        event.preventDefault();
        event.currentTarget.focus();
        event.currentTarget.setPointerCapture(event.pointerId);
        state.pointer = {
          id: event.pointerId,
          y: event.clientY,
          fraction: knobFraction(value, min, max, scale),
          start: value,
          value,
        };
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        const pointer = state.pointer;
        if (
          !pointer ||
          event.defaultPrevented ||
          pointer.id !== event.pointerId
        )
          return;
        if (disabled) {
          cancelPointer(event);
          return;
        }
        pointer.fraction = Math.max(
          0,
          Math.min(
            1,
            pointer.fraction +
              (pointer.y - event.clientY) / (event.shiftKey ? 1600 : 160),
          ),
        );
        pointer.y = event.clientY;
        pointer.value = snapKnob(
          knobValue(pointer.fraction, min, max, scale),
          min,
          max,
          event.shiftKey ? step / 10 : step,
        );
        publish(pointer.value);
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        if (state.pointer?.id !== event.pointerId) return;
        // Clear the interaction before releasing capture; a synchronous lost
        // capture event must not cancel a completed transaction.
        const pointer = state.pointer;
        state.pointer = null;
        if (disabled) publish(pointer.start);
        if (event.currentTarget.hasPointerCapture(event.pointerId))
          event.currentTarget.releasePointerCapture(event.pointerId);
        if (
          !disabled &&
          !event.defaultPrevented &&
          pointer.value !== pointer.start
        )
          onValueCommit?.(pointer.value);
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event);
        cancelPointer(event);
      }}
      onLostPointerCapture={(event) => {
        onLostPointerCapture?.(event);
        cancelPointer(event);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (
          disabled ||
          event.defaultPrevented ||
          event.altKey ||
          event.ctrlKey ||
          event.metaKey ||
          event.target !== event.currentTarget
        )
          return;
        const ticks = keySteps[event.key];
        if (typeof ticks !== "number") return;
        event.preventDefault();
        state.key = true;
        publish(
          stepKnob(value, min, max, event.shiftKey ? step / 10 : step, ticks),
        );
      }}
      onKeyUp={(event) => {
        onKeyUp?.(event);
        if (typeof keySteps[event.key] === "number")
          finishKey(!event.defaultPrevented);
      }}
      onBlur={(event) => {
        onBlur?.(event);
        finishKey(true);
      }}
    >
      <span className={dial} aria-hidden="true">
        <span className={indicator} />
      </span>
      <span className={readout} aria-hidden="true">
        {text}
      </span>
    </div>
  );
}
