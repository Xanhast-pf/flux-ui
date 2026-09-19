import type { ComponentPropsWithRef } from "react";

type SparklineBaseProps = Omit<
  ComponentPropsWithRef<"svg">,
  | "values"
  | "children"
  | "role"
  | "viewBox"
  | "aria-label"
  | "aria-labelledby"
  | "aria-hidden"
  | "dangerouslySetInnerHTML"
> & {
  values: readonly (number | null)[];
};

export type SparklineProps = SparklineBaseProps &
  (
    | {
        label: string;
        "aria-hidden"?: false | "false" | undefined;
      }
    | {
        label?: never;
        "aria-hidden": true | "true";
      }
  );
