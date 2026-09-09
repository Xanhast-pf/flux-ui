import type { ComponentPropsWithRef } from "react";

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ContainerProps extends ComponentPropsWithRef<"div"> {
  size?: ContainerSize;
}
