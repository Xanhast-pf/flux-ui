import { createContext, type ReactNode } from "react";
/** Internal semantics: items have stable IDs and native click activation. */
export interface OverflowCapability {
  items: (scope: HTMLElement) => HTMLElement[];
  selected?: string;
  label?: string;
}
/** Children is the native collection root, rendered unchanged as the slot's first child. */
export interface OverflowCollectionProps extends OverflowCapability {
  children: ReactNode;
}
/** Optional render slot, supplied only by Overflow. No enhancement runtime here. */
export const OverflowCapabilityContext = createContext<
  ((children: ReactNode, capability: OverflowCapability) => ReactNode) | null
>(null);
