import type { ComponentPropsWithRef } from "react";

export type TabsOrientation = "horizontal" | "vertical";

type TabsRootBaseProps = Omit<ComponentPropsWithRef<"div">, "defaultValue"> & {
  onValueChange?: (value: string) => void;
  orientation?: TabsOrientation;
};

export type TabsRootProps = TabsRootBaseProps &
  (
    | { defaultValue: string; value?: never }
    | { defaultValue?: never; value: string }
  );

export interface TabsListProps extends ComponentPropsWithRef<"div"> {
  activateOnFocus?: boolean;
  loopFocus?: boolean;
}

export interface TabsTabProps extends ComponentPropsWithRef<"button"> {
  value: string;
}

export interface TabsPanelProps extends ComponentPropsWithRef<"div"> {
  value: string;
}
