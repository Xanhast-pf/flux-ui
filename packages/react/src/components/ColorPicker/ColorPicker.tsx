import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { Input } from "../Input/Input.js";
import { colorInput, colorPicker, hexInput } from "./ColorPicker.css.js";
import type { ColorPickerProps } from "./ColorPicker.types.js";

const FALLBACK_COLOR = "#6366f1";

function normalizeHex(value: string): string | null {
  const hex = value.trim().toLowerCase();
  if (/^#[\da-f]{6}$/u.test(hex)) return hex;
  if (!/^#[\da-f]{3}$/u.test(hex)) return null;
  return hex.replace(/[\da-f]/gu, "$&$&");
}

export function ColorPicker({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  className,
  defaultValue = FALLBACK_COLOR,
  disabled,
  form,
  name,
  onValueChange,
  ref,
  value,
  ...props
}: ColorPickerProps) {
  const controlled = value !== undefined;
  const normalizedDefault = normalizeHex(defaultValue) ?? FALLBACK_COLOR;
  const [localValue, setLocalValue] = useState(normalizedDefault);
  const resolvedValue =
    value === undefined ? localValue : (normalizeHex(value) ?? FALLBACK_COLOR);
  const [draft, setDraft] = useState<string | null>(null);
  const displayedValue = draft ?? resolvedValue;
  function setNativeInput(node: HTMLInputElement | null) {
    const ownerForm = node?.form;
    if (!ownerForm) return;
    function reset(event: Event): void {
      queueMicrotask(() => {
        if (event.defaultPrevented) return;
        setDraft(null);
        setLocalValue(normalizedDefault);
      });
    }
    ownerForm.addEventListener("reset", reset);
    return () => ownerForm.removeEventListener("reset", reset);
  }

  function commit(next: string): void {
    if (!controlled) setLocalValue(next);
    onValueChange?.(next);
  }

  function handleNativeChange(event: ChangeEvent<HTMLInputElement>): void {
    const next = normalizeHex(event.currentTarget.value);
    if (!next) return;
    setDraft(null);
    commit(next);
  }

  function handleTextChange(event: ChangeEvent<HTMLInputElement>): void {
    const nextDraft = event.currentTarget.value;
    const next = normalizeHex(nextDraft);
    if (next && nextDraft.trim().length > 4) {
      commit(next);
      setDraft(null);
    } else setDraft(nextDraft);
  }

  function commitDraft(): void {
    const next = normalizeHex(draft ?? "");
    if (next) commit(next);
    setDraft(null);
  }

  function handleTextKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Escape") {
      event.preventDefault();
      setDraft(null);
      event.currentTarget.select();
    }
  }

  return (
    <div
      {...props}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={joinClassNames(colorPicker, className)}
      data-disabled={disabled || undefined}
      ref={ref}
      role="group"
    >
      <input
        aria-label="Choose color"
        className={colorInput}
        disabled={disabled}
        form={form}
        name={name}
        onChange={handleNativeChange}
        ref={setNativeInput}
        type="color"
        value={resolvedValue}
      />
      <Input
        aria-invalid={!normalizeHex(displayedValue) || undefined}
        aria-label="Hex color"
        autoComplete="off"
        className={hexInput}
        disabled={disabled}
        onBlur={commitDraft}
        onChange={handleTextChange}
        onKeyDown={handleTextKeyDown}
        spellCheck={false}
        type="text"
        value={displayedValue}
      />
    </div>
  );
}
