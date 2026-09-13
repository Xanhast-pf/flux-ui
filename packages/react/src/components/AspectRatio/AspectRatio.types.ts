import type { ComponentPropsWithRef } from "react";
export interface AspectRatioProps extends ComponentPropsWithRef<"div"> {
  /** Opt-in alignment for the ratio frame’s content. */
  align?: "start" | "center" | "end" | "stretch" | undefined;
  /** A finite positive width / height ratio. Defaults to 1 (square). */
  ratio?: number | undefined;
}
