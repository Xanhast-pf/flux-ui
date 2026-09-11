import type { ComponentPropsWithRef } from "react";
export type MeterProps = Omit<
  ComponentPropsWithRef<"meter">,
  "value" | "min" | "max"
> & {
  /** Finite measured value. Render an explicit pending/unknown state outside Meter. */
  value: number;
  min?: number | undefined;
  max?: number | undefined;
};
