import type { ComponentPropsWithRef } from "react";
export type HeadingProps = ComponentPropsWithRef<"h2"> & {
  /** Document hierarchy, deliberately independent from size. */
  level: 1 | 2 | 3 | 4 | 5 | 6;
  size?: "sm" | "md" | "lg" | "xl" | "display" | undefined;
  align?: "start" | "center" | "end" | undefined;
};
