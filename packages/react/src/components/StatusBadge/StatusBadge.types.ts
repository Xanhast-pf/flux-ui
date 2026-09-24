import type { ComponentPropsWithRef } from "react";
export type StatusBadgeTone =
  "neutral" | "accent" | "success" | "warning" | "danger" | "info";
export interface StatusBadgeProps extends ComponentPropsWithRef<"span"> {
  tone?: StatusBadgeTone | undefined;
}
