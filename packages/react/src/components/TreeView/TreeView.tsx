import {
  Children,
  createContext,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { attachRef } from "../../internal/attachRef.js";
import { isRovingItemAvailable } from "../../internal/rovingFocusPolicy.js";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { group, item, label, root } from "./TreeView.css.js";
import type { TreeViewItemProps, TreeViewRootProps } from "./TreeView.types.js";

type TreeContextValue = {
  expanded: readonly string[];
  setOpen: (value: string, open: boolean) => void;
};

const TreeContext = createContext<TreeContextValue | null>(null);

function useTree(): TreeContextValue {
  const context = useContext(TreeContext);
  if (context === null) {
    throw new Error("TreeView.Item must be rendered inside TreeView.Root.");
  }
  return context;
}

function allTreeItems(tree: HTMLElement): HTMLElement[] {
  return [...tree.querySelectorAll<HTMLElement>('[role="treeitem"]')].filter(
    (node) => node.closest('[role="tree"]') === tree,
  );
}

function visibleTreeItems(tree: HTMLElement): HTMLElement[] {
  return allTreeItems(tree).filter((node) => isRovingItemAvailable(node, tree));
}

function parentTreeItem(node: HTMLElement): HTMLElement | null {
  const parent = node.parentElement?.closest('[role="treeitem"]');
  return parent instanceof HTMLElement ? parent : null;
}

function firstChildTreeItem(node: HTMLElement): HTMLElement | null {
  const nestedGroup = [...node.children].find(
    (child) => child.getAttribute("role") === "group",
  );
  if (!(nestedGroup instanceof HTMLElement)) return null;
  const first = [...nestedGroup.children].find(
    (child) => child.getAttribute("role") === "treeitem",
  );
  return first instanceof HTMLElement ? first : null;
}

function setTabStop(
  tree: HTMLElement,
  preferred: HTMLElement | null,
): HTMLElement | null {
  const all = allTreeItems(tree);
  const visible = all.filter((node) => isRovingItemAvailable(node, tree));
  const active =
    preferred !== null && visible.includes(preferred)
      ? preferred
      : (visible[0] ?? null);
  for (const node of all) node.tabIndex = node === active ? 0 : -1;
  return active;
}

function validateValues(values: readonly string[], name: string): void {
  if (new Set(values).size !== values.length) {
    throw new RangeError(`TreeView ${name} must contain unique item values.`);
  }
}

function TreeViewRoot({
  className,
  defaultExpandedItems,
  expandedItems: controlledExpandedItems,
  onExpandedItemsChange,
  onFocus,
  onKeyDown,
  ref,
  ...props
}: TreeViewRootProps) {
  validateValues(controlledExpandedItems ?? [], "expandedItems");
  validateValues(defaultExpandedItems ?? [], "defaultExpandedItems");

  const controlled = controlledExpandedItems !== undefined;
  const [uncontrolledExpandedItems, setUncontrolledExpandedItems] = useState<
    string[]
  >(() => [...(defaultExpandedItems ?? [])]);
  const expanded = controlled
    ? controlledExpandedItems
    : uncontrolledExpandedItems;
  const scope = useRef<HTMLUListElement | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const setRef = useCallback(
    (node: HTMLUListElement | null) => {
      scope.current = node;
      if (node === null) return;
      const detach = attachRef(ref, node);
      return () => {
        scope.current = null;
        detach?.();
      };
    },
    [ref],
  );

  function setOpen(itemValue: string, open: boolean): void {
    const alreadyOpen = expanded.includes(itemValue);
    if (alreadyOpen === open) return;
    const next = open
      ? [...expanded, itemValue]
      : expanded.filter((candidate) => candidate !== itemValue);
    if (!controlled) setUncontrolledExpandedItems(next);
    onExpandedItemsChange?.(next);
  }

  useLayoutEffect(() => {
    const tree = scope.current;
    if (tree === null) return;
    const visible = visibleTreeItems(tree);
    const active = tree.ownerDocument.activeElement;

    if (
      active instanceof HTMLElement &&
      active.getAttribute("role") === "treeitem" &&
      active.closest('[role="tree"]') === tree
    ) {
      if (visible.includes(active)) {
        lastFocused.current = active;
        setTabStop(tree, active);
        return;
      }
      let parent = parentTreeItem(active);
      while (parent !== null && !visible.includes(parent)) {
        parent = parentTreeItem(parent);
      }
      if (parent !== null && tree.contains(active)) {
        lastFocused.current = parent;
        setTabStop(tree, parent);
        parent.focus();
        return;
      }
    }

    const remembered = lastFocused.current;
    setTabStop(
      tree,
      remembered !== null && visible.includes(remembered)
        ? remembered
        : (visible[0] ?? null),
    );
  });

  function handleFocus(event: FocusEvent<HTMLUListElement>): void {
    onFocus?.(event);
    const tree = event.currentTarget;
    const target = event.target;
    if (
      target instanceof HTMLElement &&
      target.getAttribute("role") === "treeitem" &&
      target.closest('[role="tree"]') === tree
    ) {
      lastFocused.current = target;
      setTabStop(tree, target);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLUListElement>): void {
    onKeyDown?.(event);
    if (
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.nativeEvent.isComposing
    ) {
      return;
    }

    const tree = event.currentTarget;
    const target = event.target;
    if (
      !(target instanceof HTMLElement) ||
      target.getAttribute("role") !== "treeitem" ||
      target.closest('[role="tree"]') !== tree
    ) {
      return;
    }

    const visible = visibleTreeItems(tree);
    const index = visible.indexOf(target);

    function focusAt(nextIndex: number): void {
      const next = visible[nextIndex];
      if (next === undefined) return;
      event.preventDefault();
      next.focus();
    }

    if (event.key === "ArrowDown") {
      focusAt(Math.min(index + 1, visible.length - 1));
      return;
    }
    if (event.key === "ArrowUp") {
      focusAt(Math.max(index - 1, 0));
      return;
    }
    if (event.key === "Home") {
      focusAt(0);
      return;
    }
    if (event.key === "End") {
      focusAt(visible.length - 1);
      return;
    }

    const expandedState = target.getAttribute("aria-expanded");
    const itemValue = target.dataset.fluxTreeValue;

    if (event.key === "ArrowRight") {
      if (expandedState === "false" && itemValue !== undefined) {
        event.preventDefault();
        setOpen(itemValue, true);
        return;
      }
      if (expandedState === "true") {
        const child = firstChildTreeItem(target);
        if (child !== null) {
          event.preventDefault();
          child.focus();
        }
      }
      return;
    }

    if (event.key === "ArrowLeft") {
      if (expandedState === "true" && itemValue !== undefined) {
        event.preventDefault();
        setOpen(itemValue, false);
        return;
      }
      const parent = parentTreeItem(target);
      if (parent !== null) {
        event.preventDefault();
        parent.focus();
      }
    }
  }

  return (
    <TreeContext value={{ expanded, setOpen }}>
      <ul
        {...props}
        ref={setRef}
        className={joinClassNames(root, className)}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        role="tree"
      />
    </TreeContext>
  );
}

function TreeViewItem({
  "aria-disabled": ariaDisabled,
  children,
  className,
  label: labelContent,
  onClick,
  onKeyDown,
  value,
  ...props
}: TreeViewItemProps) {
  const context = useTree();
  const labelId = useId();
  const nested = Children.toArray(children);
  const expandable = nested.length > 0;
  const open = expandable && context.expanded.includes(value);
  const disabled = ariaDisabled === true || ariaDisabled === "true";

  function handleClick(event: MouseEvent<HTMLLIElement>): void {
    onClick?.(event);
    if (event.defaultPrevented || disabled) return;
    const target = event.target;
    if (
      !(target instanceof Element) ||
      target.closest("[data-flux-tree-label]")?.closest('[role="treeitem"]') !==
        event.currentTarget
    ) {
      return;
    }
    event.currentTarget.focus();
    if (expandable) context.setOpen(value, !open);
  }

  function handleItemKeyDown(event: KeyboardEvent<HTMLLIElement>): void {
    onKeyDown?.(event);
    if (
      event.defaultPrevented ||
      disabled ||
      !expandable ||
      event.key !== "Enter" ||
      event.target !== event.currentTarget
    ) {
      return;
    }
    event.preventDefault();
    context.setOpen(value, !open);
  }

  return (
    <li
      {...props}
      aria-disabled={ariaDisabled}
      aria-expanded={expandable ? open : undefined}
      aria-labelledby={labelId}
      aria-selected={undefined}
      className={joinClassNames(item, className)}
      data-expandable={expandable || undefined}
      data-expanded={open || undefined}
      data-flux-tree-value={value}
      onClick={handleClick}
      onKeyDown={handleItemKeyDown}
      role="treeitem"
      tabIndex={0}
    >
      <span data-flux-tree-label="" id={labelId} className={label}>
        {labelContent}
      </span>
      {expandable ? (
        <ul className={group} hidden={!open} role="group">
          {children}
        </ul>
      ) : null}
    </li>
  );
}

/**
 * Hierarchical navigation with WAI-ARIA tree semantics, expansion state, and
 * roving focus. Selection, editing, drag/drop, and async loading are intentionally
 * outside the initial contract.
 */
export const TreeView = {
  Root: TreeViewRoot,
  Item: TreeViewItem,
} as const;
