import type { ComponentPropsWithRef } from "react";
export type ColorSwatchProps = Omit<
  ComponentPropsWithRef<"span">,
  | "children"
  | "color"
  | "role"
  | "tabIndex"
  | "aria-hidden"
  | "aria-label"
  | "aria-labelledby"
  | "dangerouslySetInnerHTML"
> & {
  color: string;
  selected?: boolean | undefined;
  size?: "sm" | "md" | "lg" | undefined;
};
