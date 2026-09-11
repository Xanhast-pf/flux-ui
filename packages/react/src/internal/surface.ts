import type { CSSProperties } from "react";
import {
  setSpacing,
  type CSSVariableStyle,
  type LayoutGap,
} from "./spacing.js";

export type SurfaceOptions = {
  padding?: LayoutGap | undefined;
  paddingBlock?: LayoutGap | undefined;
  paddingInline?: LayoutGap | undefined;
  surface?:
    "transparent" | "canvas" | "default" | "subtle" | "elevated" | undefined;
  border?: "none" | "all" | "block" | "bottom" | undefined;
  radius?: "none" | "sm" | "md" | "lg" | undefined;
};

export function surfaceStyle(
  padding: LayoutGap | undefined,
  block: LayoutGap | undefined,
  inline: LayoutGap | undefined,
  style: CSSProperties | undefined,
): CSSProperties | undefined {
  if (padding === undefined && block === undefined && inline === undefined)
    return style;
  const variables: CSSVariableStyle = {};
  setSpacing(variables, padding, block, inline, style);
  return { ...variables, ...style };
}
