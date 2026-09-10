import { createContext, useContext, useId } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { root, item, trigger, content } from "./Accordion.css.js";
import type {
  AccordionRootProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from "./Accordion.types.js";
const AccordionContext = createContext<{ name: string | undefined } | null>(
  null,
);
function AccordionRoot({
  className,
  type = "single",
  name,
  ...props
}: AccordionRootProps) {
  const id = useId();
  return (
    <AccordionContext
      value={{
        name: type === "single" ? (name ?? `flux-accordion-${id}`) : undefined,
      }}
    >
      <div
        {...props}
        className={joinClassNames(root, className)}
        data-type={type}
      />
    </AccordionContext>
  );
}
function AccordionItem({ className, ...props }: AccordionItemProps) {
  const context = useContext(AccordionContext);
  if (context === null)
    throw new Error("Accordion.Item must be rendered inside Accordion.Root.");
  return (
    <details
      {...props}
      name={context.name}
      className={joinClassNames(item, className)}
    />
  );
}
function AccordionTrigger({
  children,
  className,
  ...props
}: AccordionTriggerProps) {
  return (
    <summary {...props} className={joinClassNames(trigger, className)}>
      {children}
    </summary>
  );
}
function AccordionContent({ className, ...props }: AccordionContentProps) {
  return <div {...props} className={joinClassNames(content, className)} />;
}
export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
} as const;
