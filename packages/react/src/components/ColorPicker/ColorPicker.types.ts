import type { ComponentPropsWithRef } from "react";
import type { AccessibleName } from "../../internal/accessibility.types.js";

type ColorPickerBaseProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "defaultValue" | "aria-label" | "aria-labelledby"
> &
  AccessibleName & {
    disabled?: boolean | undefined;
    form?: string | undefined;
    name?: string | undefined;
    onValueChange?: ((value: string) => void) | undefined;
  };

type ColorPickerControlledProps = {
  value: string;
  defaultValue?: never;
};

type ColorPickerUncontrolledProps = {
  value?: undefined;
  defaultValue?: string | undefined;
};

export type ColorPickerProps = ColorPickerBaseProps &
  (ColorPickerControlledProps | ColorPickerUncontrolledProps);
