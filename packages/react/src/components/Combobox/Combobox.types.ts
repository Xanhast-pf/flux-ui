import type { ComponentPropsWithRef } from "react";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean | undefined;
  /** Optional semantic group label. Keep options from the same group contiguous. */
  group?: string | undefined;
}

type Base = Omit<
  ComponentPropsWithRef<"input">,
  "value" | "defaultValue" | "children" | "type" | "size" | "list"
> & {
  options: readonly ComboboxOption[];
  onValueChange?: ((value: string | null) => void) | undefined;
  /** Mirrors the active filter text; null means show the committed option label. */
  onQueryChange?: ((query: string | null) => void) | undefined;
  listLabel?: string | undefined;
  emptyMessage?: string | undefined;
  loading?: boolean | undefined;
  loadingMessage?: string | undefined;
  invalidSelectionMessage?: string | undefined;
};

type ValueState =
  | {
      value: string | null;
      defaultValue?: never;
    }
  | {
      value?: undefined;
      defaultValue?: string | null | undefined;
    };

type QueryState =
  | {
      query: string | null;
      defaultQuery?: never;
    }
  | {
      query?: undefined;
      defaultQuery?: string | null | undefined;
    };

export type ComboboxProps = Base & ValueState & QueryState;
