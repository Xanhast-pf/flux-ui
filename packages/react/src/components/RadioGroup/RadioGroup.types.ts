import type { ChangeEvent, ComponentPropsWithRef } from "react";

export type RadioGroupValue = string | null;

export type RadioGroupValueChangeHandler = (
  value: string,
  event: ChangeEvent<HTMLInputElement>,
) => void;

type RadioGroupRootBaseProps = Omit<
  ComponentPropsWithRef<"fieldset">,
  "defaultValue" | "name"
> & {
  /** Marks the radio group invalid and exposes visual invalid state to each option. */
  invalid?: boolean | undefined;
  /** Native radio-group name. A stable internal name is generated when omitted. */
  name?: string | undefined;
  /** Applies native required constraint validation to every option. */
  required?: boolean | undefined;
};

export type RadioGroupRootProps = RadioGroupRootBaseProps &
  (
    | {
        defaultValue?: string | undefined;
        onValueChange?: RadioGroupValueChangeHandler | undefined;
        value?: never;
      }
    | {
        defaultValue?: never;
        onValueChange: RadioGroupValueChangeHandler;
        value: RadioGroupValue;
      }
  );

export type RadioGroupLegendProps = ComponentPropsWithRef<"legend">;

export interface RadioGroupItemProps extends Omit<
  ComponentPropsWithRef<"input">,
  | "aria-checked"
  | "checked"
  | "children"
  | "defaultChecked"
  | "name"
  | "readOnly"
  | "type"
> {
  value: string;
}
