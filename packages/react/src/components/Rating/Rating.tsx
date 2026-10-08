import { StarEmptyIcon, StarFilledIcon, StarHalfIcon } from "@flux-ui/icons";
import {
  useId,
  type ChangeEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { hidden } from "../../internal/visuallyHidden.css.js";
import { item, readOnlyValue, root, star, target } from "./Rating.css.js";
import type { RatingProps, RatingValue } from "./Rating.types.js";

const DEFAULT_MAX = 5;
const MAX_OPTIONS = 10;

function defaultItemLabel(value: number, max: number): string {
  return `${value} of ${max} stars`;
}

function validateValue(
  value: RatingValue | undefined,
  max: number,
  step: 1 | 0.5,
  name: string,
): void {
  if (
    value !== undefined &&
    value !== null &&
    (value < step || value > max || !Number.isInteger(value / step))
  ) {
    throw new RangeError(
      `Rating ${name} must be null or a valid ${step}-step value between ${step} and max.`,
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
  step = 1,
  value,
  ...fieldsetProps
}: RatingProps) {
  if (!Number.isSafeInteger(max) || max < 1 || max > MAX_OPTIONS) {
    throw new RangeError(
      `Rating max must be an integer between 1 and ${MAX_OPTIONS}.`,
    );
  }
  validateValue(value, max, step, "value");
  validateValue(defaultValue, max, step, "defaultValue");

  const generatedName = useId();
  const controlled = value !== undefined;
  const readOnlyValueSelected = controlled ? value : (defaultValue ?? null);
  const groupName = name ?? `${generatedName}-rating`;
  const stars = Array.from({ length: max }, (_, index) => index + 1);

  function handleScrub(event: ReactPointerEvent<HTMLSpanElement>): void {
    if (event.buttons !== 1) return;
    const input = event.currentTarget.ownerDocument
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest("label")
      ?.querySelector<HTMLInputElement>("input");
    if (
      input &&
      !input.checked &&
      event.currentTarget.parentElement?.contains(input)
    ) {
      input.click();
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    onChange?.(event);
    if (event.defaultPrevented || !event.currentTarget.checked) return;
    onValueChange?.(Number(event.currentTarget.value));
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
            {stars.map((option) =>
              readOnlyValueSelected === option - 0.5 ? (
                <StarHalfIcon key={option} className={star} data-fill="" />
              ) : readOnlyValueSelected !== null &&
                option <= readOnlyValueSelected ? (
                <StarFilledIcon key={option} className={star} data-fill="" />
              ) : (
                <StarEmptyIcon key={option} className={star} />
              ),
            )}
          </span>
        </>
      ) : (
        stars.map((option) => (
          <span
            key={option}
            className={item}
            data-half={step === 0.5 || undefined}
            onPointerMove={handleScrub}
          >
            <StarEmptyIcon className={star} />
            <StarHalfIcon className={star} data-fill="half" />
            <StarFilledIcon className={star} data-fill="full" />
            {Array.from({ length: 1 / step }, (_, index) => {
              const optionValue = option - 1 + (index + 1) * step;
              return (
                <label key={optionValue} className={target}>
                  <input
                    aria-label={getItemLabel(optionValue, max)}
                    checked={controlled ? value === optionValue : undefined}
                    className={hidden}
                    defaultChecked={
                      !controlled ? defaultValue === optionValue : undefined
                    }
                    form={form}
                    name={groupName}
                    onChange={handleChange}
                    required={required}
                    type="radio"
                    value={optionValue}
                  />
                </label>
              );
            })}
          </span>
        ))
      )}
    </fieldset>
  );
}
