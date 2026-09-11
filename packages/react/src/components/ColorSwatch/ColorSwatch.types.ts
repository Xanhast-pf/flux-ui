import type { ComponentPropsWithRef } from "react";
export type ColorSwatchProps = Omit<
  ComponentPropsWithRef<"span">,
  "children" | "color"
> & {
  color: string;
  selected?: boolean | undefined;
  size?: "sm" | "md" | "lg" | undefined;
};
