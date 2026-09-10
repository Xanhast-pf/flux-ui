import { joinClassNames } from "../../internal/joinClassNames.js";
import { root, trigger, content } from "./Collapsible.css.js";
import type {
  CollapsibleRootProps,
  CollapsibleTriggerProps,
  CollapsibleContentProps,
} from "./Collapsible.types.js";
function CollapsibleRoot({ className, ...props }: CollapsibleRootProps) {
  return <details {...props} className={joinClassNames(root, className)} />;
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
function CollapsibleContent({ className, ...props }: CollapsibleContentProps) {
  return <div {...props} className={joinClassNames(content, className)} />;
}
export const Collapsible = {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
} as const;
