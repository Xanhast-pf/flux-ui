import type { ComponentPropsWithRef } from "react";
import type { AccessibleName } from "../../internal/accessibility.types.js";

export type ToolbarRootProps = Omit<
  ComponentPropsWithRef<"div">,
  "role" | "aria-label" | "aria-labelledby" | "aria-orientation"
> &
  AccessibleName & {
    orientation?: "horizontal" | "vertical" | undefined;
    loopFocus?: boolean | undefined;
  };

export type ToolbarButtonProps = Omit<
  ComponentPropsWithRef<"button">,
  "tabIndex"
> & {
  /** Marks the action busy, disables native activation, and removes it from roving focus. */
  loading?: boolean | undefined;
};

export type ToolbarLinkProps = Omit<ComponentPropsWithRef<"a">, "tabIndex"> & {
  href: string;
};

export type ToolbarSeparatorProps = ComponentPropsWithRef<"hr">;
