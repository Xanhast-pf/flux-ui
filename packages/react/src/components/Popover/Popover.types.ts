import type { ComponentPropsWithRef, ReactNode, RefObject } from "react";
import type { ButtonProps } from "../Button/Button.types.js";
import type {
  FloatingAlign,
  FloatingSide,
} from "../../internal/floatingPosition.js";
export type PopoverRootProps = {
  children?: ReactNode;
  onOpenChange?: (open: boolean) => void;
} & (
  | {
      defaultOpen?: boolean;
      open?: never;
    }
  | {
      defaultOpen?: never;
      open: boolean;
    }
);
export type PopoverTriggerProps = ButtonProps;
export type PopoverCloseProps = ButtonProps;
export interface PopoverPopupProps extends Omit<
  ComponentPropsWithRef<"div">,
  "popover"
> {
  side?: FloatingSide;
  align?: FloatingAlign;
  offset?: number;
  /** Explicit focus target; otherwise the first available control receives focus. */
  initialFocus?: RefObject<HTMLElement | null>;
}
