import type { ChangeEvent, ComponentPropsWithRef } from "react";

export interface CheckboxProps extends Omit<
  ComponentPropsWithRef<"input">,
  "aria-checked" | "children" | "readOnly" | "type"
> {
  /** Controlled mixed presentation, independent of the submitted checked value. */
  indeterminate?: boolean | undefined;
  /** Runs after onChange unless that event was default-prevented. */
  onCheckedChange?:
    | ((checked: boolean, event: ChangeEvent<HTMLInputElement>) => void)
    | undefined;
}
