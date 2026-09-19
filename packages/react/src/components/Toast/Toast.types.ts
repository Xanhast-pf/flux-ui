import type { ComponentPropsWithRef, ReactNode } from "react";
export interface ToastOptions {
  title: string;
  description?: string | undefined;
  tone?: "neutral" | "success" | "danger" | undefined;
  /** Zero disables automatic dismissal. Timers pause while hovered, focused or the document is hidden. */
  duration?: number | undefined;
  action?:
    | {
        label: string;
        onClick: () => void;
      }
    | undefined;
}
export interface ToastProviderProps {
  children?: ReactNode;
  duration?: number | undefined;
  maxVisible?: number | undefined;
  dismissLabel?: string | undefined;
}
export interface ToastViewportProps extends Omit<
  ComponentPropsWithRef<"ol">,
  "children" | "dangerouslySetInnerHTML"
> {
  placement?: "fixed" | "inline" | undefined;
}
export interface ToastController {
  notify: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}
