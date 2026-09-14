import type { ComponentPropsWithRef } from "react";
export type TagProps = ComponentPropsWithRef<"span"> & {
  tone?: "neutral" | "accent";
} & (
    | {
        onRemove: () => void;
        removeLabel: string;
      }
    | {
        onRemove?: never;
        removeLabel?: never;
      }
  );
