import { createContext, useContext } from "react";
type TabsContextValue = {
  controlled: boolean;
  id: string;
  size: "sm" | "md" | "lg";
  appearance: "underline" | "pill";
  orientation: "horizontal" | "vertical";
  setValue: (value: string) => void;
  value: string;
};
export const TabsContext = createContext<TabsContextValue | null>(null);
export function useTabsContext(part: string): TabsContextValue {
  const context = useContext(TabsContext);
  if (context === null) {
    throw new Error(`Tabs.${part} must be rendered inside Tabs.Root.`);
  }
  return context;
}
