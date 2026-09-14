import {
  createContext,
  useContext,
  useId,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
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

function valueSuffix(value: string): string {
  return encodeURIComponent(value);
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
  tabIndex = -1,
  ...props
}: TabsListProps) {
  const context = useTabsContext("List");

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
    const tabs = Array.from(
      scope.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
    ).filter(
      (element) =>
        element.closest('[role="tablist"]') === scope &&
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
  const suffix = valueSuffix(value);

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
      tabIndex={selected ? 0 : -1}
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
  const suffix = valueSuffix(value);

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
