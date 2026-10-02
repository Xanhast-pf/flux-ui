import type { ComponentPropsWithRef } from "react";

export type StepperOrientation = "horizontal" | "vertical";
export type StepperStatus = "pending" | "current" | "complete" | "error";

export interface StepperRootProps extends ComponentPropsWithRef<"ol"> {
  orientation?: StepperOrientation | undefined;
}

export interface StepperItemProps extends Omit<
  ComponentPropsWithRef<"li">,
  "aria-current"
> {
  status?: StepperStatus | undefined;
  /**
   * Accessible status text for completed/error steps. Defaults to
   * "Completed" or "Error" and may be localized by the caller.
   */
  statusLabel?: string | undefined;
}

export interface StepperLinkProps extends ComponentPropsWithRef<"a"> {
  href: string;
}

export type StepperButtonProps = ComponentPropsWithRef<"button">;
