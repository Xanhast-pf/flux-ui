import type { ComponentPropsWithRef } from "react";
/** Native details semantics: open, name and onToggle are passed through. */
export type CollapsibleRootProps = ComponentPropsWithRef<"details"> & {
  appearance?: "surface" | "plain" | undefined;
  density?: "comfortable" | "compact" | undefined;
};
export type CollapsibleTriggerProps = ComponentPropsWithRef<"summary">;
export type CollapsibleContentProps = ComponentPropsWithRef<"div"> & {
  padding?: "md" | "none" | undefined;
};
