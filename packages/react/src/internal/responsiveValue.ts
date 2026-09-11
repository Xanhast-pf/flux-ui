import type { CSSVariableStyle } from "./spacing.js";

const responsiveEntries = [
  ["base", "b"],
  ["sm", "s"],
  ["md", "m"],
  ["lg", "l"],
  ["xl", "x"],
  ["2xl", "2"],
] as const;

type ResponsiveKey = (typeof responsiveEntries)[number][0];
export type ResponsiveValue<T> = T | Partial<Record<ResponsiveKey, T>>;

export function setResponsiveCssVariable<T extends string | number>(
  target: CSSVariableStyle,
  prefix: string,
  value: ResponsiveValue<T> | undefined,
  serialize: (value: T) => string | number,
): void {
  if (value === undefined) return;

  if (typeof value !== "object") {
    target[`--${prefix}-b`] = serialize(value);
    return;
  }
  for (const [key, suffix] of responsiveEntries) {
    const entry = value[key];
    if (entry !== undefined) target[`--${prefix}-${suffix}`] = serialize(entry);
  }
}

export type ResponsiveScope = "viewport" | "container";
