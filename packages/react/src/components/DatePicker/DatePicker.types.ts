import type { ComponentPropsWithRef } from "react";

export interface DatePickerProps extends Omit<
  ComponentPropsWithRef<"input">,
  "children" | "type" | "value" | "defaultValue"
> {
  /** ISO civil date (YYYY-MM-DD). */
  value?: string | undefined;
  /** Initial iso civil date (yyyy-mm-dd). for uncontrolled forms. */
  defaultValue?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
}
