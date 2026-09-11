import type { ComponentType } from "react";
import { components } from "../generated/components.js";
export interface ComponentExample {
  Preview: ComponentType;
  /** Controls center naturally; layout examples fill the centered preview canvas. */
  previewLayout?: "center" | "fill";
  code: string;
  notes: readonly string[];
  props: ReadonlyArray<
    readonly [name: string, type: string, description: string]
  >;
}
const modules = import.meta.glob<{ default: ComponentExample }>(
  "../examples/*.example.tsx",
);
/** Filename convention is the registry; no central list of component demos. */
export const catalog = components.map((meta) => {
  const entry = modules[`../examples/${meta.slug}.example.tsx`];
  if (entry === undefined)
    throw new Error(`Missing docs example: ${meta.slug}.example.tsx`);
  return { ...meta, loadExample: entry };
});
