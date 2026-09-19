import type { ComponentPropsWithRef } from "react";

type AccordionRootBaseProps = ComponentPropsWithRef<"div">;

export type AccordionRootProps = AccordionRootBaseProps &
  (
    | {
        /** Single uses the browser's named-details exclusivity. */
        type?: "single" | undefined;
        name?: string | undefined;
      }
    | {
        /** Multiple disclosures are independent and therefore have no group name. */
        type: "multiple";
        name?: never;
      }
  );
export type AccordionItemProps = Omit<ComponentPropsWithRef<"details">, "name">;
export type AccordionTriggerProps = ComponentPropsWithRef<"summary">;
export type AccordionContentProps = ComponentPropsWithRef<"div">;
