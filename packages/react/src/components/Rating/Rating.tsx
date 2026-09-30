import { useId, type ChangeEvent } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { hidden } from "../../internal/visuallyHidden.css.js";
import { item, readOnlyValue, root, star } from "./Rating.css.js";
import type { RatingProps, RatingValue } from "./Rating.types.js";

const DEFAULT_MAX = 5;
const MAX_OPTIONS = 10;

function defaultItemLabel(value: number, max: number): string {
  return `${value} of ${max} stars`;
}

function validateValue(
  value: RatingValue | undefined,
  max: number,
  name: string,
): void {
  if (
    value !== undefined &&
    value !== null &&
    (!Number.isSafeInteger(value) || value < 1 || value > max)
  ) {
    throw new RangeError(
      `Rating ${name} must be null or an integer between 1 and max.`,
    );
  }
}

/**
 * Native-radio rating control with form semantics and a non-interactive
 * read-only presentation.
 */
export function Rating({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  className,
  defaultValue,
  disabled = false,
  form,
  getItemLabel = defaultItemLabel,
  max = DEFAULT_MAX,
  name,
  onChange,
  onValueChange,
  readOnly = false,
  ref,
  required = false,
  value,
  ...fieldsetProps
}: RatingProps) {
  if (!Number.isSafeInteger(max) || max < 1 || max > MAX_OPTIONS) {
    throw new RangeError(
      `Rating max must be an integer between 1 and ${MAX_OPTIONS}.`,
    );
  }
  validateValue(value, max, "value");
  validateValue(defaultValue, max, "defaultValue");

  const generatedName = useId();
  const controlled = value !== undefined;
  const readOnlyValueSelected = controlled ? value : (defaultValue ?? null);
  const groupName = name ?? `${generatedName}-rating`;
  const values = Array.from({ length: max }, (_, index) => index + 1);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    onChange?.(event);
    if (event.defaultPrevented || !event.currentTarget.checked) return;
    onValueChange?.(Number(event.currentTarget.value), event);
  }

  return (
    <fieldset
      {...fieldsetProps}
      ref={ref}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={joinClassNames(root, className)}
      data-readonly={readOnly || undefined}
      disabled={disabled}
      form={form}
    >
      {readOnly ? (
        <>
          {name !== undefined && readOnlyValueSelected !== null ? (
            <input
              form={form}
              name={name}
              type="hidden"
              value={readOnlyValueSelected}
            />
          ) : null}
          <span
            className={readOnlyValue}
            role="img"
            aria-label={
              readOnlyValueSelected === null
                ? `No rating selected; maximum ${max}`
                : getItemLabel(readOnlyValueSelected, max)
            }
          >
            {values.map((option) => (
              <span
                key={option}
                aria-hidden="true"
                className={star}
                data-filled={
                  readOnlyValueSelected !== null &&
                  option <= readOnlyValueSelected
                    ? ""
                    : undefined
                }
              >
                ★
              </span>
            ))}
          </span>
        </>
      ) : (
        values.map((option) => (
          <label key={option} className={item}>
            <input
              aria-label={getItemLabel(option, max)}
              checked={controlled ? value === option : undefined}
              className={hidden}
              defaultChecked={!controlled ? defaultValue === option : undefined}
              disabled={disabled || undefined}
              form={form}
              name={groupName}
              onChange={handleChange}
              required={required || undefined}
              type="radio"
              value={option}
            />
            <span aria-hidden="true" className={star}>
              ★
            </span>
          </label>
        ))
      )}
    </fieldset>
  );
}
