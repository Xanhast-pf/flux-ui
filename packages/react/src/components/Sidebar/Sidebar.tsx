import {
  createContext,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { Button } from "../Button/Button.js";
import { content, layout, panel } from "./Sidebar.css.js";
import type {
  SidebarCloseProps,
  SidebarContentProps,
  SidebarLayoutProps,
  SidebarPanelProps,
  SidebarRootProps,
  SidebarToggleProps,
} from "./Sidebar.types.js";

type SidebarState = {
  open: boolean;
  panelId: string;
  setOpen: (open: boolean) => void;
  setPanelFocused: (focused: boolean) => void;
};

const SidebarContext = createContext<SidebarState | null>(null);

function useSidebar(part: string): SidebarState {
  const value = useContext(SidebarContext);
  if (value === null) {
    throw new Error(`Sidebar.${part} must be rendered inside Sidebar.Root.`);
  }
  return value;
}

function SidebarRoot({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: SidebarRootProps) {
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const open = controlledOpen ?? localOpen;
  const panelId = `${useId()}-sidebar`;
  const panelFocused = useRef(false);
  const previousOpen = useRef(open);

  function setOpen(next: boolean): void {
    if (next === open) return;
    if (controlledOpen === undefined) setLocalOpen(next);
    onOpenChange?.(next);
  }

  // A controlled close must not strand focus in hidden content. Opening never
  // moves focus, traps it, locks scrolling, or makes the page inert.
  useLayoutEffect(() => {
    if (previousOpen.current && !open && panelFocused.current) {
      const element = document.getElementById(panelId);
      if (
        document.activeElement === document.body ||
        element?.contains(document.activeElement)
      ) {
        const trigger = Array.from(
          document.querySelectorAll<HTMLButtonElement>("button[aria-controls]"),
        ).find(
          (button) =>
            button.getAttribute("aria-controls") === panelId &&
            !button.disabled &&
            !element?.contains(button),
        );
        trigger?.focus();
      }
      panelFocused.current = false;
    }
    previousOpen.current = open;
  }, [open, panelId]);

  function setPanelFocused(focused: boolean): void {
    panelFocused.current = focused;
  }

  return (
    <SidebarContext value={{ open, panelId, setOpen, setPanelFocused }}>
      {children}
    </SidebarContext>
  );
}

function SidebarLayout({ className, ...props }: SidebarLayoutProps) {
  return <div {...props} className={joinClassNames(layout, className)} />;
}

function SidebarPanel({
  className,
  onFocusCapture,
  onBlurCapture,
  ...props
}: SidebarPanelProps) {
  const state = useSidebar("Panel");
  return (
    <aside
      {...props}
      id={state.panelId}
      hidden={!state.open}
      className={joinClassNames(panel, className)}
      onFocusCapture={(event) => {
        state.setPanelFocused(true);
        onFocusCapture?.(event);
      }}
      onBlurCapture={(event) => {
        // Hiding can move focus to body before the layout effect restores it.
        if (
          event.relatedTarget !== null &&
          event.relatedTarget !== document.body
        ) {
          state.setPanelFocused(
            event.currentTarget.contains(event.relatedTarget),
          );
        }
        onBlurCapture?.(event);
      }}
    />
  );
}

function SidebarContent({ className, ...props }: SidebarContentProps) {
  return <div {...props} className={joinClassNames(content, className)} />;
}

function SidebarToggle({ onClick, ...props }: SidebarToggleProps) {
  const state = useSidebar("Toggle");
  function toggle(event: MouseEvent<HTMLButtonElement>): void {
    onClick?.(event);
    if (!event.defaultPrevented) state.setOpen(!state.open);
  }
  return (
    <Button
      {...props}
      aria-controls={state.panelId}
      aria-expanded={state.open}
      onClick={toggle}
    />
  );
}

function SidebarClose({ onClick, ...props }: SidebarCloseProps) {
  const state = useSidebar("Close");
  return (
    <Button
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) state.setOpen(false);
      }}
    />
  );
}

export const Sidebar = {
  Root: SidebarRoot,
  Layout: SidebarLayout,
  Toggle: SidebarToggle,
  Panel: SidebarPanel,
  Content: SidebarContent,
  Close: SidebarClose,
} as const;
