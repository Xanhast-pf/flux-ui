import type { ComponentType } from "react";
import { components } from "../generated/components.js";

export interface ComponentPreviewVariation {
  title: string;
  description?: string;
  Preview: ComponentType;
  /** Override the primary preview layout for this variation. */
  previewLayout?: "center" | "fill";
  /** Override the primary preview width for this variation. */
  previewWidth?: "standard" | "wide";
}

export interface ComponentExample {
  Preview: ComponentType;
  /** Optional label for the primary preview when variations are shown. */
  previewTitle?: string;
  /** Optional guidance for the primary preview when variations are shown. */
  previewDescription?: string;
  /** Additional curated previews for components with meaningful variations. */
  variations?: readonly ComponentPreviewVariation[];
  /** Controls center naturally; layout examples fill the centered preview canvas. */
  previewLayout?: "center" | "fill";
  /** A layout canvas large enough to demonstrate desktop container behavior. */
  previewWidth?: "standard" | "wide";
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
