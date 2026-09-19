import type { ComponentPropsWithRef, CSSProperties, ReactNode } from "react";
import type { AccessibleName } from "../../internal/accessibility.types.js";
import type { ButtonProps } from "../Button/Button.types.js";

export type SidebarRootProps = {
  children?: ReactNode;
} & (
  | {
      open: boolean;
      defaultOpen?: never;
      onOpenChange: (open: boolean) => void;
    }
  | {
      open?: undefined;
      defaultOpen?: boolean | undefined;
      onOpenChange?: ((open: boolean) => void) | undefined;
    }
);

/**
 * Layout owns both columns; the panel stacks below 48rem of available layout width.
 * CSS variables are optional integration hooks, not router/storage options.
 */
export interface SidebarLayoutProps extends ComponentPropsWithRef<"div"> {
  style?:
    | (CSSProperties & {
        "--flux-sidebar-width"?: string | undefined;
        "--flux-sidebar-offset"?: string | undefined;
      })
    | undefined;
}

export type SidebarPanelProps = Omit<
  ComponentPropsWithRef<"aside">,
  "id" | "hidden" | "aria-label" | "aria-labelledby"
> &
  AccessibleName;
export type SidebarContentProps = ComponentPropsWithRef<"div">;
export type SidebarToggleProps = Omit<
  ButtonProps,
  "aria-controls" | "aria-expanded"
>;
export type SidebarCloseProps = ButtonProps;
