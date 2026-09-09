import type { ComponentPropsWithRef, ReactNode } from "react";

export type ButtonTone = "accent" | "neutral" | "danger";
export type ButtonVariant = "solid" | "soft" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<
  ComponentPropsWithRef<"button">,
  "color"
> {
  tone?: ButtonTone;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}
