import { useId, useRef, useState, type CSSProperties } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { content, handle, splitPane } from "./SplitPane.css.js";
import type { SplitPaneProps } from "./SplitPane.types.js";
export function SplitPane({
  label,
  first,
  second,
  orientation = "horizontal",
  value,
  defaultValue = 50,
  min = 10,
  max = 90,
  onValueChange,
  onValueCommit,
  className,
  style,
  ...props
}: SplitPaneProps) {
  const id = useId();
  const [local, setLocal] = useState(defaultValue);
  const current = value ?? local;
  if (
    ![current, min, max].every(Number.isFinite) ||
    min < 0 ||
    max > 100 ||
    min >= max
  )
    throw new RangeError(
      "SplitPane uses finite percentages with 0 <= min < max <= 100.",
    );
  const resolved = Math.max(min, Math.min(max, current));
  const drag = useRef<{
    id: number;
    start: number;
    size: number;
    value: number;
    latest: number;
    direction: number;
  } | null>(null);
  const keyboard = useRef(false);
  const horizontal = orientation === "horizontal";
  function change(next: number) {
    const clamped = Math.max(min, Math.min(max, next));
    if (value === undefined) setLocal(clamped);
    onValueChange?.(clamped);
    return clamped;
  }
  function cancel() {
    const previous = drag.current;
    drag.current = null;
    if (previous) change(previous.value);
  }
  return (
    <div
      {...props}
      className={joinClassNames(splitPane, className)}
      data-orientation={orientation}
      style={
        {
          "--f-pane-first": `${resolved}fr`,
          "--f-pane-second": `${100 - resolved}fr`,
          ...style,
        } as CSSProperties
      }
    >
      <div className={content} id={`${id}-first`}>
        {first}
      </div>
      {/* A focusable separator follows the ARIA splitter pattern. */}
      {/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
      <div
        className={handle}
        role="separator"
        tabIndex={0}
        aria-label={label}
        aria-controls={`${id}-first ${id}-second`}
        aria-orientation={horizontal ? "vertical" : "horizontal"}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={resolved}
        aria-valuetext={`${Math.round(resolved)} percent for first pane`}
        onKeyDown={(event) => {
          const direction =
            horizontal &&
            getComputedStyle(event.currentTarget).direction === "rtl"
              ? -1
              : 1;
          const step = event.shiftKey ? 1 : 5;
          let next = resolved;
          if (event.key === "Home") next = min;
          else if (event.key === "End") next = max;
          else if (event.key === (horizontal ? "ArrowLeft" : "ArrowUp"))
            next -= step * direction;
          else if (event.key === (horizontal ? "ArrowRight" : "ArrowDown"))
            next += step * direction;
          else return;
          event.preventDefault();
          keyboard.current = true;
          change(next);
        }}
        onKeyUp={(event) => {
          if (
            keyboard.current &&
            [
              "Home",
              "End",
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
            ].includes(event.key)
          ) {
            keyboard.current = false;
            onValueCommit?.(resolved);
          }
        }}
        onBlur={() => {
          if (keyboard.current) {
            keyboard.current = false;
            onValueCommit?.(resolved);
          }
        }}
        onPointerDown={(event) => {
          if (event.button !== 0 || !event.isPrimary) return;
          const parent = event.currentTarget.parentElement;
          const bounds = parent?.getBoundingClientRect();
          if (!bounds) return;
          const divider = event.currentTarget.getBoundingClientRect();
          const size = horizontal
            ? bounds.width - divider.width
            : bounds.height - divider.height;
          if (size <= 0) return;
          event.preventDefault();
          event.currentTarget.focus();
          drag.current = {
            id: event.pointerId,
            start: horizontal ? event.clientX : event.clientY,
            size,
            value: resolved,
            latest: resolved,
            direction:
              horizontal &&
              getComputedStyle(event.currentTarget).direction === "rtl"
                ? -1
                : 1,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const active = drag.current;
          if (!active || active.id !== event.pointerId) return;
          const position = horizontal ? event.clientX : event.clientY;
          active.latest = change(
            active.value +
              ((position - active.start) / active.size) *
                100 *
                active.direction,
          );
        }}
        onPointerUp={(event) => {
          const active = drag.current;
          if (!active || active.id !== event.pointerId) return;
          drag.current = null;
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
          onValueCommit?.(active.latest);
        }}
        onPointerCancel={cancel}
        onLostPointerCapture={cancel}
      />
      {/* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
      <div className={content} id={`${id}-second`}>
        {second}
      </div>
    </div>
  );
}
