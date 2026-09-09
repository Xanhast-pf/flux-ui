import type { CSSProperties } from "react";

export const responsiveKeys = ["base", "sm", "md", "lg", "xl", "2xl"] as const;
export type ResponsiveKey = (typeof responsiveKeys)[number];
export type ResponsiveValue<T> = T | Partial<Record<ResponsiveKey, T>>;

export type LayoutGap = "none" | "xs" | "sm" | "md" | "lg" | "xl";

export type CSSVariableStyle = CSSProperties &
  Record<`--${string}`, string | number>;

const gapValues: Record<LayoutGap, string> = {
  none: "0rem",
  xs: "var(--flux-space-1)",
  sm: "var(--flux-space-2)",
  md: "var(--flux-space-4)",
  lg: "var(--flux-space-6)",
  xl: "var(--flux-space-8)",
};

export function gapToCssValue(gap: LayoutGap): string {
  return gapValues[gap];
}

export function setResponsiveCssVariable<T extends string | number>(
  target: CSSVariableStyle,
  prefix: string,
  value: ResponsiveValue<T> | undefined,
  serialize: (value: T) => string | number,
): void {
  if (value === undefined) return;

  if (typeof value !== "object" || Array.isArray(value)) {
    target[`--${prefix}-base`] = serialize(value as T);
    return;
  }

  for (const key of responsiveKeys) {
    const responsiveValue = value[key];
    if (responsiveValue !== undefined) {
      target[`--${prefix}-${key}`] = serialize(responsiveValue);
    }
  }
}
