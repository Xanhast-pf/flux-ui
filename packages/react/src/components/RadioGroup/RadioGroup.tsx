import { createContext, useContext, useId, type ChangeEvent } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { item, legend, requiredIndicator, root } from "./RadioGroup.css.js";
import type {
  RadioGroupItemProps,
  RadioGroupLegendProps,
  RadioGroupRootProps,
  RadioGroupValue,
  RadioGroupValueChangeHandler,
} from "./RadioGroup.types.js";

type RadioGroupContextValue = {
  defaultValue: string | undefined;
  disabled: boolean;
  form: string | undefined;
  invalid: boolean;
  name: string;
  onValueChange: RadioGroupValueChangeHandler | undefined;
  required: boolean;
  value: RadioGroupValue | undefined;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroupContext(part: string): RadioGroupContextValue {
  const context = useContext(RadioGroupContext);
  if (context === null) {
    throw new Error(
      `RadioGroup.${part} must be rendered inside RadioGroup.Root.`,
    );
  }
  return context;
}

function RadioGroupRoot({
  children,
  className,
  defaultValue,
  disabled = false,
  form,
  invalid = false,
  name,
  onValueChange,
  required = false,
  value,
  ...fieldsetProps
}: RadioGroupRootProps) {
  const generatedName = useId();
  const context: RadioGroupContextValue = {
    defaultValue,
    disabled,
    form,
    invalid,
    name: name ?? `${generatedName}-radio-group`,
    onValueChange,
    required,
    value,
  };

  return (
    <RadioGroupContext value={context}>
      <fieldset
        {...fieldsetProps}
        {...(invalid ? { "aria-invalid": "true", "data-invalid": "true" } : {})}
        className={joinClassNames(root, className)}
        disabled={disabled}
        form={form}
      >
        {children}
      </fieldset>
    </RadioGroupContext>
  );
}

function RadioGroupLegend({
  children,
  className,
  ...legendProps
}: RadioGroupLegendProps) {
  const context = useRadioGroupContext("Legend");

  return (
    <legend {...legendProps} className={joinClassNames(legend, className)}>
      {children}
      {context.required ? (
        <span aria-hidden="true" className={requiredIndicator}>
          {" *"}
        </span>
      ) : null}
    </legend>
  );
}

function RadioGroupItem({
  "aria-invalid": ariaInvalid,
  className,
  disabled,
  form,
  onChange,
  required,
  value,
  ...inputProps
}: RadioGroupItemProps) {
  const context = useRadioGroupContext("Item");
  const controlled = context.value !== undefined;

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    onChange?.(event);
    if (
      !event.defaultPrevented &&
      event.currentTarget.checked &&
      context.onValueChange !== undefined
    ) {
      context.onValueChange(value, event);
    }
  }

  return (
    <input
      {...inputProps}
      checked={controlled ? context.value === value : undefined}
      className={joinClassNames(item, className)}
      {...(context.invalid || ariaInvalid === true || ariaInvalid === "true"
        ? { "data-invalid": "true" }
        : {})}
      defaultChecked={
        !controlled && context.defaultValue === value ? true : undefined
      }
      disabled={context.disabled || disabled || undefined}
      form={form ?? context.form}
      name={context.name}
      onChange={context.onValueChange !== undefined ? handleChange : onChange}
      required={context.required || required || undefined}
      type="radio"
      value={value}
    />
  );
}

export const RadioGroup = {
  Item: RadioGroupItem,
  Legend: RadioGroupLegend,
  Root: RadioGroupRoot,
} as const;
