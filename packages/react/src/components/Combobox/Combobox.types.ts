import type { ComponentPropsWithRef } from "react";
export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}
type Base = Omit<
  ComponentPropsWithRef<"input">,
  "value" | "defaultValue" | "children" | "type" | "size" | "list"
> & {
  options: readonly ComboboxOption[];
  onValueChange?: (value: string | null) => void;
  listLabel?: string;
  emptyMessage?: string;
  invalidSelectionMessage?: string;
};
export type ComboboxProps = Base &
  (
    | {
        value: string | null;
        defaultValue?: never;
      }
    | {
        value?: never;
        defaultValue?: string | null;
      }
  );
