import type { ComponentPropsWithRef } from "react";
export type LinkProps = ComponentPropsWithRef<"a"> & {
  variant?:
    "text" | "navigation" | "solid" | "soft" | "outline" | "ghost" | undefined;
  tone?: "accent" | "neutral" | "danger" | undefined;
  size?: "sm" | "md" | "lg" | undefined;
};
