import type { ChangeEvent, ComponentPropsWithRef } from "react";

export interface TimePickerProps extends Omit<
  ComponentPropsWithRef<"input">,
  "children" | "type" | "value" | "defaultValue"
> {
  /** Local civil time string. Native minute precision is HH:mm. */
  value?: string | undefined;
  /** Initial local civil time string for uncontrolled forms. */
  defaultValue?: string | undefined;
  onValueChange?:
    ((value: string, event: ChangeEvent<HTMLInputElement>) => void) | undefined;
}
