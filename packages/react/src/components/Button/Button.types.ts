import type { ComponentPropsWithRef, ReactNode } from "react";

export type ButtonIntent = "accent" | "neutral" | "danger";
export type ButtonVariant = "solid" | "soft" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<
  ComponentPropsWithRef<"button">,
  "color"
> {
  intent?: ButtonIntent;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}
