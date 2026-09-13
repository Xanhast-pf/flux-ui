import type { ComponentPropsWithRef, CSSProperties, ReactNode } from "react";
import type { AccessibleName } from "../../internal/accessibility.types.js";
import type { ButtonProps } from "../Button/Button.types.js";

export type SidebarRootProps = {
  children?: ReactNode;
  onOpenChange?: ((open: boolean) => void) | undefined;
} & (
  | { open: boolean; defaultOpen?: never }
  | { open?: undefined; defaultOpen?: boolean | undefined }
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
export type SidebarToggleProps = ButtonProps;
export type SidebarCloseProps = ButtonProps;
