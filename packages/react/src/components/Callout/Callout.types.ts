import type { ComponentPropsWithRef } from "react";
export type CalloutTone =
  "neutral" | "accent" | "success" | "warning" | "danger" | "info";
export interface CalloutProps extends ComponentPropsWithRef<"div"> {
  tone?: CalloutTone | undefined;
}
