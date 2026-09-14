import type { ComponentPropsWithRef, ReactNode } from "react";
export interface ToastOptions {
  title: string;
  description?: string;
  tone?: "neutral" | "success" | "danger";
  /** Zero disables automatic dismissal. Timers pause while hovered, focused or the document is hidden. */
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}
export interface ToastProviderProps {
  children?: ReactNode;
  duration?: number;
  maxVisible?: number;
  dismissLabel?: string;
}
export interface ToastViewportProps extends Omit<
  ComponentPropsWithRef<"ol">,
  "children"
> {
  placement?: "fixed" | "inline";
}
export interface ToastController {
  notify: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}
