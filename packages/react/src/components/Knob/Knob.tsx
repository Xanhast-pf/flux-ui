import { useRef, useState, type CSSProperties } from "react";
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
const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 3,
});
const formatNumber = (value: number): string => numberFormatter.format(value);
export function Knob({
  value: controlled,
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
  const [internal, setInternal] = useState(defaultValue);
  const raw = controlled ?? internal;
  if (!Number.isFinite(raw)) throw new RangeError("Knob.value must be finite.");
  const value = Math.max(min, Math.min(max, raw));
  const drag = useRef<{
    id: number;
    y: number;
    fraction: number;
    original: number;
    latest: number;
  } | null>(null);
  const keyboard = useRef(false);
  function change(next: number) {
    if (next === value) return;
    if (controlled === undefined) setInternal(next);
    onValueChange?.(next);
  }
  function cancel() {
    if (drag.current) {
      const original = drag.current.original;
      drag.current = null;
      change(original);
    }
  }
  return (
    <div
      {...props}
      className={joinClassNames(knob, className)}
      role="slider"
      aria-orientation="vertical"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={formatValue(value)}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : (tabIndex ?? 0)}
      style={
        {
          "--f-knob-angle": `${knobFraction(value, min, max, scale) * 270}deg`,
          ...style,
        } as CSSProperties
      }
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (
          event.defaultPrevented ||
          disabled ||
          event.button !== 0 ||
          !event.isPrimary
        )
          return;
        event.preventDefault();
        event.currentTarget.focus();
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = {
          id: event.pointerId,
          y: event.clientY,
          fraction: knobFraction(value, min, max, scale),
          original: value,
          latest: value,
        };
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        const active = drag.current;
        if (!active || event.defaultPrevented || event.pointerId !== active.id)
          return;
        if (disabled) {
          cancel();
          return;
        }
        active.fraction = Math.max(
          0,
          Math.min(
            1,
            active.fraction +
              (active.y - event.clientY) / (event.shiftKey ? 1600 : 160),
          ),
        );
        active.y = event.clientY;
        active.latest = snapKnob(
          knobValue(active.fraction, min, max, scale),
          min,
          max,
          event.shiftKey ? step / 10 : step,
        );
        change(active.latest);
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        if (drag.current?.id !== event.pointerId) return;
        const latest = drag.current.latest;
        if (disabled) cancel();
        else drag.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId))
          event.currentTarget.releasePointerCapture(event.pointerId);
        if (!disabled && !event.defaultPrevented) onValueCommit?.(latest);
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event);
        if (drag.current?.id === event.pointerId) cancel();
      }}
      onLostPointerCapture={(event) => {
        onLostPointerCapture?.(event);
        if (drag.current?.id === event.pointerId) cancel();
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
        const amount = event.shiftKey ? step / 10 : step;
        const next =
          event.key === "Home"
            ? min
            : event.key === "End"
              ? max
              : ["ArrowUp", "ArrowRight", "PageUp"].includes(event.key)
                ? stepKnob(
                    value,
                    min,
                    max,
                    amount,
                    event.key === "PageUp" ? 10 : 1,
                  )
                : ["ArrowDown", "ArrowLeft", "PageDown"].includes(event.key)
                  ? stepKnob(
                      value,
                      min,
                      max,
                      amount,
                      event.key === "PageDown" ? -10 : -1,
                    )
                  : null;
        if (next === null) return;
        event.preventDefault();
        keyboard.current = true;
        change(snapKnob(next, min, max, amount));
      }}
      onKeyUp={(event) => {
        onKeyUp?.(event);
        if (
          keyboard.current &&
          [
            "Home",
            "End",
            "ArrowUp",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight",
            "PageUp",
            "PageDown",
          ].includes(event.key)
        ) {
          keyboard.current = false;
          if (!disabled && !event.defaultPrevented) onValueCommit?.(value);
        }
      }}
      onBlur={(event) => {
        onBlur?.(event);
        if (keyboard.current) {
          keyboard.current = false;
          if (!disabled) onValueCommit?.(value);
        }
      }}
    >
      <span className={dial} aria-hidden="true">
        <span className={indicator} />
      </span>
      <span className={readout} aria-hidden="true">
        {formatValue(value)}
      </span>
    </div>
  );
}
