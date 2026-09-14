import type { ComponentPropsWithRef } from "react";
import type {
  PopoverPopupProps,
  PopoverRootProps,
  PopoverTriggerProps,
} from "../Popover/Popover.types.js";
export type DropdownMenuRootProps = PopoverRootProps;
export type DropdownMenuTriggerProps = PopoverTriggerProps;
export type DropdownMenuPopupProps = Omit<PopoverPopupProps, "role">;
export interface DropdownMenuItemProps extends ComponentPropsWithRef<"button"> {
  /** Prevent default on the click event to keep the menu open. */
  onSelect?: () => void;
  tone?: "neutral" | "danger";
}
export type DropdownMenuLabelProps = ComponentPropsWithRef<"div">;
export type DropdownMenuSeparatorProps = ComponentPropsWithRef<"hr">;
