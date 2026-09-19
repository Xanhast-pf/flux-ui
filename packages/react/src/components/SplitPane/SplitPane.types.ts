import type { ComponentPropsWithRef, ReactNode } from "react";

type SplitPaneBaseProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "dangerouslySetInnerHTML"
> & {
  label: string;
  first: ReactNode;
  second: ReactNode;
  orientation?: "horizontal" | "vertical" | undefined;
  min?: number | undefined;
  max?: number | undefined;
  onValueCommit?: ((value: number) => void) | undefined;
};

export type SplitPaneProps = SplitPaneBaseProps &
  (
    | {
        value: number;
        defaultValue?: never;
        onValueChange: (value: number) => void;
      }
    | {
        value?: undefined;
        defaultValue?: number | undefined;
        onValueChange?: ((value: number) => void) | undefined;
      }
  );
