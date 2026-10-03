import { useCallback, useId, useRef, useState, type ChangeEvent } from "react";
import { attachRef } from "../../internal/attachRef.js";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { slider } from "./Slider.css.js";
import type { SliderMark, SliderProps } from "./Slider.types.js";

function markValue(mark: SliderMark): number {
  return typeof mark === "number" ? mark : mark.value;
}

function controlledNumber(value: SliderProps["value"]): number | undefined {
  if (typeof value !== "number" && typeof value !== "string") return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

/** One native range control, with optional orientation and a custom static skin. */
export function Slider({
  className,
  ref,
  id,
  list,
  marks,
  showValue = false,
  formatValue,
  orientation = "horizontal",
  appearance = "native",
  resetValue,
  value,
  onDoubleClick,
  onChange,
  onValueChange,
  ...props
}: SliderProps) {
  if (marks !== undefined && list !== undefined)
    throw new TypeError(
      "Slider marks cannot be combined with the native list prop.",
    );
  if (marks !== undefined)
    for (const mark of marks)
      if (!Number.isFinite(markValue(mark)))
        throw new RangeError("Slider marks require finite numeric values.");

  const generatedId = useId();
  const inputId = id ?? (showValue ? `${generatedId}-input` : undefined);
  const markListId = marks === undefined ? list : `${generatedId}-marks`;
  const controlled = value !== undefined;
  const formatter = formatValue ?? String;
  const initial = useRef<number | undefined>(undefined);
  const [uncontrolledOutput, setUncontrolledOutput] = useState<
    number | undefined
  >(undefined);

  const setInput = useCallback(
    (node: HTMLInputElement | null) => {
      if (node === null) return;
      initial.current ??= node.valueAsNumber;
      if (showValue && !controlled) setUncontrolledOutput(node.valueAsNumber);

      const form = node.form;
      const handleReset = () => {
        queueMicrotask(() => {
          setUncontrolledOutput(node.valueAsNumber);
        });
      };
      if (showValue && !controlled)
        form?.addEventListener("reset", handleReset);

      const cleanup = attachRef(ref, node);
      return () => {
        if (showValue && !controlled)
          form?.removeEventListener("reset", handleReset);
        cleanup?.();
      };
    },
    [controlled, ref, showValue],
  );

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const next = event.currentTarget.valueAsNumber;
    if (showValue && !controlled) setUncontrolledOutput(next);
    onChange?.(event);
    if (!event.defaultPrevented) onValueChange?.(next, event);
  }

  const controlledOutput = controlledNumber(value);
  const displayedValue = controlled ? controlledOutput : uncontrolledOutput;

  return (
    <>
      <input
        {...props}
        ref={setInput}
        id={inputId}
        list={markListId}
        value={value}
        aria-orientation={orientation}
        data-orientation={orientation}
        data-appearance={appearance}
        className={joinClassNames(slider, className)}
        onChange={onValueChange || showValue ? handleChange : onChange}
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
          input.valueAsNumber = target;
          if (input.value !== previous)
            input.dispatchEvent(new view.Event("input", { bubbles: true }));
        }}
        type="range"
      />
      {marks === undefined ? null : (
        <datalist id={markListId}>
          {marks.map((mark) => {
            const markNumber = markValue(mark);
            const label = typeof mark === "number" ? undefined : mark.label;
            return (
              <option
                key={markNumber}
                value={markNumber}
                {...(label === undefined ? {} : { label })}
              />
            );
          })}
        </datalist>
      )}
      {showValue ? (
        <output aria-hidden="true" htmlFor={inputId}>
          {displayedValue === undefined ? undefined : formatter(displayedValue)}
        </output>
      ) : null}
    </>
  );
}
