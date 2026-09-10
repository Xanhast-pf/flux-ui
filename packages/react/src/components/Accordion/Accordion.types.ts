import type { ComponentPropsWithRef } from "react";
export interface AccordionRootProps extends ComponentPropsWithRef<"div"> {
  /** Single uses the browser's named-details exclusivity; multiple omits names. */
  type?: "single" | "multiple" | undefined;
  name?: string | undefined;
}
export type AccordionItemProps = Omit<ComponentPropsWithRef<"details">, "name">;
export type AccordionTriggerProps = ComponentPropsWithRef<"summary">;
export type AccordionContentProps = ComponentPropsWithRef<"div">;
