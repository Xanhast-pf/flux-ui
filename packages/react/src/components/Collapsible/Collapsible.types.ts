import type { ComponentPropsWithRef } from "react";
/** Native details semantics: open, name and onToggle are passed through. */
export type CollapsibleRootProps = ComponentPropsWithRef<"details">;
export type CollapsibleTriggerProps = ComponentPropsWithRef<"summary">;
export type CollapsibleContentProps = ComponentPropsWithRef<"div">;
