import type { ComponentPropsWithRef } from "react";
export interface AspectRatioProps extends ComponentPropsWithRef<"div"> {
  /** A finite positive width / height ratio. Defaults to 1 (square). */
  ratio?: number | undefined;
}
