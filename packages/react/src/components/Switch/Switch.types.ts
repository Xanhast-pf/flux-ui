import type { ComponentPropsWithRef } from "react";
export interface SwitchProps extends Omit<
  ComponentPropsWithRef<"input">,
  "type" | "role" | "aria-checked" | "children" | "readOnly"
> {
  onCheckedChange?: ((checked: boolean) => void) | undefined;
}
