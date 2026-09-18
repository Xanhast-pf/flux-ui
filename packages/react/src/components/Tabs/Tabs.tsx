import { useId, useState, type MouseEvent } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { panel, root, tab } from "./Tabs.css.js";
import { TabsContext, useTabsContext } from "./TabsContext.js";
import { TabsList } from "./TabsList.js";
import type {
  TabsPanelProps,
  TabsRootProps,
  TabsTabProps,
} from "./Tabs.types.js";
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
