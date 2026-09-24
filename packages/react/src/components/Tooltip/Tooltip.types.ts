import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";
import type {
  FloatingAlign,
  FloatingSide,
} from "../../internal/floatingPosition.js";

type TooltipStateProps = {
  onOpenChange?: ((open: boolean) => void) | undefined;
} & (
  | {
      defaultOpen?: boolean | undefined;
      open?: never;
    }
  | {
      defaultOpen?: never;
      open: boolean;
    }
);

export type TooltipProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "content"
> &
  TooltipStateProps & {
    /** One control that forwards DOM props and its ref. Its accessible name is still required. */
    children: ReactElement;
    /** Non-interactive supplemental text, not a replacement for the control's label. */
    content: ReactNode;
    side?: FloatingSide;
    align?: FloatingAlign;
    delay?: number | undefined;
  };
