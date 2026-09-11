import { joinClassNames } from "../../internal/joinClassNames.js";
import { content, root, trigger } from "./Collapsible.css.js";
import type {
  CollapsibleContentProps,
  CollapsibleRootProps,
  CollapsibleTriggerProps,
} from "./Collapsible.types.js";
function CollapsibleRoot({
  appearance = "surface",
  density = "comfortable",
  className,
  ...props
}: CollapsibleRootProps) {
  return (
    <details
      {...props}
      data-a={appearance === "surface" ? undefined : appearance}
      data-d={density === "comfortable" ? undefined : density}
      className={joinClassNames(root, className)}
    />
  );
}
function CollapsibleTrigger({
  className,
  children,
  ...props
}: CollapsibleTriggerProps) {
  return (
    <summary {...props} className={joinClassNames(trigger, className)}>
      {children}
    </summary>
  );
}
function CollapsibleContent({
  padding = "md",
  className,
  ...props
}: CollapsibleContentProps) {
  return (
    <div
      {...props}
      data-p={padding === "md" ? undefined : padding}
      className={joinClassNames(content, className)}
    />
  );
}
export const Collapsible = {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
} as const;
