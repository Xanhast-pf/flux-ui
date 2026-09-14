import {
  createContext,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { attachRef } from "../../internal/attachRef.js";
import { joinClassNames } from "../../internal/joinClassNames.js";
import {
  isRovingItemAvailable,
  nextRovingIndex,
  type RovingOptions,
} from "../../internal/rovingFocus.js";
import { list, panel, root, tab } from "./Tabs.css.js";
import type {
  TabsListProps,
  TabsPanelProps,
  TabsRootProps,
  TabsTabProps,
} from "./Tabs.types.js";

type TabsContextValue = {
  controlled: boolean;
  id: string;
  size: "sm" | "md" | "lg";
  appearance: "underline" | "pill";
  orientation: "horizontal" | "vertical";
  setValue: (value: string) => void;
  value: string;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(part: string): TabsContextValue {
  const context = useContext(TabsContext);
  if (context === null) {
    throw new Error(`Tabs.${part} must be rendered inside Tabs.Root.`);
  }
  return context;
}

function scopedTabs(scope: Element): HTMLButtonElement[] {
  return Array.from(
    scope.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
  ).filter((tab) => tab.closest('[role="tablist"]') === scope);
}

function TabsRoot({
  size = "md",
  appearance = "underline",
  className,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  value: controlledValue,
  ...props
}: TabsRootProps) {
  const generatedId = useId();
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? "",
  );
  const value = controlledValue ?? uncontrolledValue;

  function setValue(nextValue: string): void {
    if (nextValue === value) return;
    if (controlledValue === undefined) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue);
  }

  return (
    <TabsContext
      value={{
        controlled: controlledValue !== undefined,
        id: generatedId,
        size,
        appearance,
        orientation,
        setValue,
        value,
      }}
    >
      <div {...props} className={joinClassNames(root, className)} />
    </TabsContext>
  );
}

function TabsList({
  wrap = false,
  activateOnFocus = false,
  className,
  loopFocus = true,
  onKeyDown,
  onFocusCapture,
  onBlurCapture,
  ref,
  tabIndex = -1,
  ...props
}: TabsListProps) {
  const context = useTabsContext("List");
  const previousIndex = useRef(0);
  const focusedTab = useRef<HTMLButtonElement | null>(null);
  // Inspect the rendered collection, not opaque JSX children. A controlled
  // invalid value retains its owner; the first available tab remains reachable.
  const setRef = useCallback(
    (element: HTMLDivElement | null) => {
      if (element === null) return;
      const node = element;
      const cleanup = attachRef(ref, node);
      function reconcile() {
        const all = scopedTabs(node);
        const available = all.filter((tab) => isRovingItemAvailable(tab, node));
        const selected = available.find(
          (tab) => tab.dataset.fluxTabValue === context.value,
        );
        const replacement =
          selected ??
          available[Math.min(previousIndex.current, available.length - 1)];
        for (const tab of all) tab.tabIndex = tab === replacement ? 0 : -1;
        if (replacement === undefined) return;
        previousIndex.current = available.indexOf(replacement);
        if (selected === undefined && !context.controlled) {
          const next = replacement.dataset.fluxTabValue;
          if (next !== undefined) context.setValue(next);
        }
        const focused = focusedTab.current;
        if (
          focused !== null &&
          (!focused.isConnected || !available.includes(focused)) &&
          (node.ownerDocument.activeElement === node.ownerDocument.body ||
            node.contains(node.ownerDocument.activeElement))
        ) {
          replacement.focus();
          focusedTab.current = replacement;
        }
      }
      reconcile();
      const Observer = node.ownerDocument.defaultView?.MutationObserver;
      if (Observer === undefined) return cleanup;
      const observer = new Observer(reconcile);
      observer.observe(node, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: [
          "disabled",
          "aria-disabled",
          "hidden",
          "inert",
          "data-flux-tab-value",
        ],
      });
      return () => {
        observer.disconnect();
        cleanup?.();
      };
    },
    [ref, context],
  );

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    onKeyDown?.(event);
    const options: RovingOptions = {
      orientation: context.orientation,
      direction: "ltr",
      loopFocus,
    };
    if (
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      nextRovingIndex(event.key, 0, 1, options) === null
    )
      return;

    const scope = event.currentTarget;
    if (
      !(event.target instanceof Element) ||
      event.target.closest('[role="tablist"]') !== scope
    )
      return;
    const tabs = scopedTabs(scope).filter((element) =>
      isRovingItemAvailable(element, scope),
    );
    options.direction =
      scope.ownerDocument.defaultView?.getComputedStyle(scope).direction ===
      "rtl"
        ? "rtl"
        : "ltr";
    const nextIndex = nextRovingIndex(
      event.key,
      tabs.findIndex((element) => element === event.target),
      tabs.length,
      options,
    );
    if (nextIndex === null) return;
    event.preventDefault();

    const nextTab = tabs[nextIndex];
    nextTab?.focus();
    if (activateOnFocus) {
      const nextValue = nextTab?.dataset.fluxTabValue;
      if (nextValue !== undefined) context.setValue(nextValue);
    }
  }

  return (
    <div
      {...props}
      data-a={context.appearance}
      data-w={wrap || undefined}
      aria-orientation={context.orientation}
      className={joinClassNames(list, className)}
      onKeyDown={handleKeyDown}
      onFocusCapture={(event) => {
        onFocusCapture?.(event);
        if (
          event.target instanceof HTMLButtonElement &&
          event.target.closest('[role="tablist"]') === event.currentTarget
        )
          focusedTab.current = event.target;
      }}
      onBlurCapture={(event) => {
        onBlurCapture?.(event);
        if (
          event.relatedTarget instanceof Node &&
          !event.currentTarget.contains(event.relatedTarget)
        )
          focusedTab.current = null;
      }}
      ref={setRef}
      role="tablist"
      tabIndex={tabIndex}
    />
  );
}

function TabsTab({
  className,
  disabled,
  onClick,
  type = "button",
  value,
  ...props
}: TabsTabProps) {
  const context = useTabsContext("Tab");
  const selected = context.value === value;
  const unavailable =
    disabled ||
    props["aria-disabled"] === true ||
    props["aria-disabled"] === "true";
  const suffix = encodeURIComponent(value);

  function handleClick(event: MouseEvent<HTMLButtonElement>): void {
    onClick?.(event);
    if (!event.defaultPrevented && !unavailable) context.setValue(value);
  }

  return (
    <button
      {...props}
      aria-controls={`${context.id}-panel-${suffix}`}
      aria-selected={selected}
      className={joinClassNames(tab, className)}
      data-a={context.appearance}
      data-o={context.orientation}
      data-s={context.size}
      data-flux-tab-value={value}
      disabled={unavailable}
      id={`${context.id}-tab-${suffix}`}
      onClick={handleClick}
      role="tab"
      tabIndex={selected && !unavailable && !props.hidden ? 0 : -1}
      type={type}
    />
  );
}

function TabsPanel({
  padding = "md",
  className,
  value,
  ...props
}: TabsPanelProps) {
  const context = useTabsContext("Panel");
  const selected = context.value === value;
  const suffix = encodeURIComponent(value);

  return (
    <div
      {...props}
      aria-labelledby={`${context.id}-tab-${suffix}`}
      className={joinClassNames(panel, className)}
      data-p={padding === "md" ? undefined : padding}
      hidden={!selected}
      id={`${context.id}-panel-${suffix}`}
      role="tabpanel"
    />
  );
}

export const Tabs = {
  List: TabsList,
  Panel: TabsPanel,
  Root: TabsRoot,
  Tab: TabsTab,
} as const;
