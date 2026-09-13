import type { ComponentPropsWithRef, ChangeEvent } from "react";
export interface NumberFieldProps extends Omit<
  ComponentPropsWithRef<"input">,
  "type" | "children"
> {
  /** null denotes an empty or incomplete numeric edit, never NaN. */
  onValueChange?:
    | ((value: number | null, event: ChangeEvent<HTMLInputElement>) => void)
    | undefined;
}
