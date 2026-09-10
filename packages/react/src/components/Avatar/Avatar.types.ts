import type { ComponentPropsWithRef, ReactNode } from "react";
export interface AvatarProps extends Omit<
  ComponentPropsWithRef<"span">,
  "children" | "role" | "aria-label" | "aria-labelledby"
> {
  /** Accessible identity. Use an empty string when adjacent text already names it. */
  alt: string;
  src?: string | undefined;
  fallback?: ReactNode;
  size?: "sm" | "md" | "lg" | undefined;
}
