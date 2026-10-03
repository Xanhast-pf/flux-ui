import type { ComponentPropsWithRef, ReactNode } from "react";
import type { AccessibleName } from "../../internal/accessibility.types.js";

export type TreeViewExpandedItemsChangeHandler = (
  expandedItems: readonly string[],
) => void;

type TreeViewRootBaseProps = Omit<
  ComponentPropsWithRef<"ul">,
  "role" | "aria-label" | "aria-labelledby"
> &
  AccessibleName;

export type TreeViewRootProps = TreeViewRootBaseProps &
  (
    | {
        /** Expanded item identifiers for uncontrolled usage. */
        defaultExpandedItems?: readonly string[] | undefined;
        expandedItems?: undefined;
        onExpandedItemsChange?: TreeViewExpandedItemsChangeHandler | undefined;
      }
    | {
        /** Controlled expanded item identifiers. */
        expandedItems: readonly string[];
        defaultExpandedItems?: never;
        onExpandedItemsChange?: TreeViewExpandedItemsChangeHandler | undefined;
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
  /** Stable identifier used by Root expandedItems/defaultExpandedItems state. */
  value: string;
  /** Visible label and accessible name for the tree item. */
  label: ReactNode;
  /** Nested TreeView.Item nodes. Presence makes this item expandable. */
  children?: ReactNode;
}
