import type { ComponentPropsWithRef, ReactNode } from "react";
import type { AccessibleName } from "../../internal/accessibility.types.js";

export type TreeViewValueChangeHandler = (value: string[]) => void;

type TreeViewRootBaseProps = Omit<
  ComponentPropsWithRef<"ul">,
  "role" | "aria-label" | "aria-labelledby" | "defaultValue"
> &
  AccessibleName;

export type TreeViewRootProps = TreeViewRootBaseProps &
  (
    | {
        /** Expanded item values for uncontrolled usage. */
        defaultValue?: readonly string[] | undefined;
        value?: undefined;
        onValueChange?: TreeViewValueChangeHandler | undefined;
      }
    | {
        /** Controlled expanded item values. */
        value: readonly string[];
        defaultValue?: never;
        onValueChange: TreeViewValueChangeHandler;
      }
  );

export interface TreeViewItemProps extends Omit<
  ComponentPropsWithRef<"li">,
  | "role"
  | "tabIndex"
  | "aria-expanded"
  | "aria-label"
  | "aria-labelledby"
  | "aria-selected"
  | "children"
  | "value"
> {
  /** Stable identifier used by Root value/defaultValue expansion state. */
  value: string;
  /** Visible label and accessible name for the tree item. */
  label: ReactNode;
  /** Nested TreeView.Item nodes. Presence makes this item expandable. */
  children?: ReactNode;
}
