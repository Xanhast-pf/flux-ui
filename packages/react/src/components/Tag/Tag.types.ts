import type { ComponentPropsWithRef } from "react";
export type TagProps = Omit<
  ComponentPropsWithRef<"span">,
  "dangerouslySetInnerHTML"
> & {
  tone?: "neutral" | "accent" | undefined;
} & (
    | {
        onRemove: () => void;
        removeLabel: string;
      }
    | {
        onRemove?: undefined;
        removeLabel?: undefined;
      }
  );
