import type { ComponentPropsWithRef, ReactNode } from "react";

export type ButtonTone = "accent" | "neutral" | "danger";
export type ButtonVariant = "solid" | "soft" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<
  ComponentPropsWithRef<"button">,
  "color" | "aria-busy"
> {
  tone?: ButtonTone | undefined;
  variant?: ButtonVariant | undefined;
  size?: ButtonSize | undefined;
  loading?: boolean | undefined;
  startIcon?: ReactNode | undefined;
  endIcon?: ReactNode | undefined;
}
