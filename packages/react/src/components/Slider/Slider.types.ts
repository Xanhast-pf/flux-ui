import type { ChangeEvent, ComponentPropsWithRef } from "react";
export interface SliderProps extends Omit<
  ComponentPropsWithRef<"input">,
  "type" | "children"
> {
  onValueChange?:
    ((value: number, event: ChangeEvent<HTMLInputElement>) => void) | undefined;
}
