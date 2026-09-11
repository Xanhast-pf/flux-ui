import type { ComponentPropsWithRef } from "react";
import type { LayoutGap } from "../../internal/layout.js";
import type { SemanticProps } from "../../internal/semantic.types.js";
export type ListProps = SemanticProps<
  "ul" | "ol",
  "ul",
  {
    variant?: "plain" | "marker" | undefined;
    gap?: LayoutGap | undefined;
  }
>;
export type ListItemProps = ComponentPropsWithRef<"li">;
