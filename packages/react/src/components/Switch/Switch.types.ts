import type { ChangeEvent, ComponentPropsWithRef } from "react";
export interface SwitchProps extends Omit<
  ComponentPropsWithRef<"input">,
  "type" | "role" | "aria-checked" | "children"
> {
  onCheckedChange?:
    | ((checked: boolean, event: ChangeEvent<HTMLInputElement>) => void)
    | undefined;
}
