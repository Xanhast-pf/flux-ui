import type { ComponentPropsWithRef } from "react";
export interface SparklineProps extends Omit<
  ComponentPropsWithRef<"svg">,
  "values" | "children"
> {
  values: readonly (number | null)[];
  label: string;
}
