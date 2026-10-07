import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { Input } from "../Input/Input.js";
import { colorInput, colorPicker, hexInput } from "./ColorPicker.css.js";
import type { ColorPickerProps } from "./ColorPicker.types.js";

const FALLBACK_COLOR = "#6366f1";

function normalizeHex(value: string): string | null {
  const trimmed = value.trim();
  const short = /^#([\da-f])([\da-f])([\da-f])$/iu.exec(trimmed);
  if (short) {
    const [, red = "0", green = "0", blue = "0"] = short;
    return `#${red}${red}${green}${green}${blue}${blue}`.toLowerCase();
  }
  return /^#[\da-f]{6}$/iu.test(trimmed) ? trimmed.toLowerCase() : null;
}

export function ColorPicker({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  className,
  defaultValue = FALLBACK_COLOR,
  disabled = false,
  form,
  name,
  onValueChange,
  ref,
  value,
  ...props
}: ColorPickerProps) {
  const controlled = value !== undefined;
  const normalizedDefault = normalizeHex(defaultValue) ?? FALLBACK_COLOR;
  const normalizedControlled =
    value === undefined ? undefined : (normalizeHex(value) ?? FALLBACK_COLOR);
  const [localValue, setLocalValue] = useState(normalizedDefault);
  const resolvedValue = normalizedControlled ?? localValue;
  const [draft, setDraft] = useState<string | null>(null);
  const displayedValue = draft ?? resolvedValue;
  const validDraft = normalizeHex(displayedValue);

  function commit(next: string): void {
    if (!controlled) setLocalValue(next);
    onValueChange?.(next);
  }

  function handleNativeChange(event: ChangeEvent<HTMLInputElement>): void {
    const next = normalizeHex(event.currentTarget.value);
    if (next === null) return;
    setDraft(null);
    commit(next);
  }

  function handleTextChange(event: ChangeEvent<HTMLInputElement>): void {
    const nextDraft = event.currentTarget.value;
    if (/^#[\da-f]{6}$/iu.test(nextDraft.trim())) {
      commit(nextDraft.trim().toLowerCase());
      setDraft(null);
    } else setDraft(nextDraft);
  }

  function commitDraft(): void {
    if (draft !== null) {
      const next = normalizeHex(draft);
      if (next !== null) commit(next);
    }
    setDraft(null);
  }

  function restoreDraft(): void {
    setDraft(null);
  }

  function handleTextKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Escape") {
      event.preventDefault();
      restoreDraft();
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
        type="color"
        value={resolvedValue}
      />
      <Input
        aria-invalid={validDraft === null || undefined}
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
