import type { ComponentPropsWithRef } from "react";
export type TabsOrientation = "horizontal" | "vertical";
type TabsRootBaseProps = Omit<ComponentPropsWithRef<"div">, "defaultValue"> & {
  size?: "sm" | "md" | "lg" | undefined;
  appearance?: "underline" | "pill" | undefined;
  orientation?: TabsOrientation | undefined;
};
export type TabsRootProps = TabsRootBaseProps &
  (
    | {
        defaultValue: string;
        value?: undefined;
        onValueChange?: ((value: string) => void) | undefined;
      }
    | {
        defaultValue?: never;
        value: string;
        onValueChange: (value: string) => void;
      }
  );
export interface TabsListProps extends Omit<
  ComponentPropsWithRef<"div">,
  "role" | "aria-orientation"
> {
  /** Wrap tabs instead of using the automatic horizontal overflow menu. */
  wrap?: boolean | undefined;
  activateOnFocus?: boolean | undefined;
  loopFocus?: boolean | undefined;
}
export interface TabsTabProps extends Omit<
  ComponentPropsWithRef<"button">,
  "role" | "tabIndex" | "id" | "aria-controls" | "aria-selected"
> {
  value: string;
}
export interface TabsPanelProps extends Omit<
  ComponentPropsWithRef<"div">,
  "role" | "id" | "hidden" | "aria-labelledby"
> {
  padding?: "none" | "md" | undefined;
  value: string;
}
