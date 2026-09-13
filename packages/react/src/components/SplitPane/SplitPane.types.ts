import type { ComponentPropsWithRef, ReactNode } from "react";
export interface SplitPaneProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children"
> {
  label: string;
  first: ReactNode;
  second: ReactNode;
  orientation?: "horizontal" | "vertical" | undefined;
  value?: number | undefined;
  defaultValue?: number | undefined;
  min?: number | undefined;
  max?: number | undefined;
  onValueChange?: ((value: number) => void) | undefined;
  onValueCommit?: ((value: number) => void) | undefined;
}
