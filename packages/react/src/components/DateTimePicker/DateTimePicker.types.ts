import type { ComponentPropsWithRef } from "react";

export interface DateTimePickerProps extends Omit<
  ComponentPropsWithRef<"input">,
  "children" | "type" | "value" | "defaultValue"
> {
  /** Local civil datetime string. Native minute precision is YYYY-MM-DDTHH:mm. */
  value?: string | undefined;
  /** Initial local civil datetime string for uncontrolled forms. */
  defaultValue?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
}
