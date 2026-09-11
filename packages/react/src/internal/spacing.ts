import type { CSSProperties } from "react";

export type LayoutGap =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 8
  | 10
  | 12
  | 16;

export type CSSVariableStyle = CSSProperties &
  Record<`--${string}`, string | number>;

const gapSteps = { xs: 1, sm: 2, md: 4, lg: 6, xl: 8 } as const;

export function gapToCssValue(gap: LayoutGap): string {
  if (gap === "none") return "0rem";
  return `var(--flux-space-${typeof gap === "number" ? gap : gapSteps[gap]})`;
}

export type LayoutSpacing = {
  padding?: LayoutGap | undefined;
  paddingBlock?: LayoutGap | undefined;
  paddingInline?: LayoutGap | undefined;
};

export function setSpacing(
  target: CSSProperties,
  padding: LayoutGap | undefined,
  block: LayoutGap | undefined,
  inline: LayoutGap | undefined,
  overrides?: CSSProperties,
): void {
  // A consumer shorthand overrides every prop-provided axis. Do not reapply
  // paddingInline/paddingBlock after React has set that shorthand.
  if (overrides?.padding !== undefined) return;
  if (padding !== undefined) target.padding = gapToCssValue(padding);
  if (block !== undefined) target.paddingBlock = gapToCssValue(block);
  if (inline !== undefined) target.paddingInline = gapToCssValue(inline);
}
