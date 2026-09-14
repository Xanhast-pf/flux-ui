import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { attachRef } from "../../internal/attachRef.js";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { isRovingItemAvailable } from "../../internal/rovingFocus.js";
import {
  nativePopoverOpen,
  useFloatingSurface,
} from "../../internal/useFloatingSurface.js";
import { Button } from "../Button/Button.js";
import { popup } from "./Popover.css.js";
import type {
  PopoverCloseProps,
  PopoverPopupProps,
  PopoverRootProps,
  PopoverTriggerProps,
} from "./Popover.types.js";
interface PopoverState {
  id: string;
  open: boolean;
  revision: number;
  trigger: HTMLButtonElement | null;
  setTrigger: (node: HTMLButtonElement | null) => void;
  request: (
    open: boolean,
    origin?: HTMLElement,
    edge?: "first" | "last",
  ) => void;
  focusEdge: () => "first" | "last";
  restoreFocus: () => void;
  nativeDismiss: () => void;
}
const Context = createContext<PopoverState | null>(null);
/** Package-private behavior shared by the menu family; not a public entrypoint. */
export function usePopover(part: string): PopoverState {
  const value = useContext(Context);
  if (value === null)
    throw new Error(
      `${part} must be rendered inside Popover.Root or DropdownMenu.Root.`,
    );
  return value;
}
function PopoverRoot({
  children,
  defaultOpen = false,
  open: controlled,
  onOpenChange,
}: PopoverRootProps) {
  const id = useId();
  const [local, setLocal] = useState(defaultOpen);
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null);
  const [revision, setRevision] = useState(0);
  const origin = useRef<HTMLElement | null>(null);
  const edge = useRef<"first" | "last">("first");
  const open = controlled ?? local;
  const request = useCallback(
    (
      next: boolean,
      target?: HTMLElement,
      nextEdge: "first" | "last" = "first",
    ) => {
      if (target !== undefined) origin.current = target;
      edge.current = nextEdge;
      if (next === open) return;
      if (controlled === undefined) setLocal(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange, open],
  );
  const restoreFocus = useCallback(() => {
    if (origin.current?.isConnected)
      origin.current.focus({ preventScroll: true });
  }, []);
  function nativeDismiss() {
    request(false);
    if (controlled === true) setRevision((value) => value + 1);
  }
  return (
    <Context
      value={{
        id,
        open,
        revision,
        trigger,
        setTrigger,
        request,
        restoreFocus,
        nativeDismiss,
        focusEdge: () => edge.current,
      }}
    >
      {children}
    </Context>
  );
}
function PopoverTrigger({
  ref,
  onClick,
  "aria-haspopup": hasPopup = "dialog",
  ...props
}: PopoverTriggerProps) {
  const context = usePopover("Popover.Trigger");
  const { setTrigger } = context;
  const setRef = useCallback(
    (node: HTMLButtonElement | null) => {
      setTrigger(node);
      if (node === null) return;
      const cleanup = attachRef(ref, node);
      return () => {
        cleanup?.();
        setTrigger(null);
      };
    },
    [ref, setTrigger],
  );
  return (
    <Button
      {...props}
      ref={setRef}
      aria-haspopup={hasPopup}
      aria-expanded={context.open}
      aria-controls={context.id}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented)
          context.request(!context.open, event.currentTarget);
      }}
    />
  );
}
function PopoverClose({
  onClick,
  variant = "outline",
  tone = "neutral",
  ...props
}: PopoverCloseProps) {
  const context = usePopover("Popover.Close");
  return (
    <Button
      {...props}
      variant={variant}
      tone={tone}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) context.request(false);
      }}
    />
  );
}
function PopoverPopup({
  side = "bottom",
  align = "start",
  offset = 8,
  initialFocus,
  ref,
  className,
  role = "dialog",
  tabIndex = -1,
  onToggle,
  ...props
}: PopoverPopupProps) {
  const context = usePopover("Popover.Popup");
  const { open, trigger, request, restoreFocus } = context;
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const setRef = useCallback(
    (element: HTMLDivElement | null) => {
      setNode(element);
      if (element === null) return;
      const cleanup = attachRef(ref, element);
      return () => {
        const focused = element.contains(element.ownerDocument.activeElement);
        cleanup?.();
        setNode(null);
        if (focused)
          queueMicrotask(() => {
            if (
              element.ownerDocument.activeElement === element.ownerDocument.body
            )
              restoreFocus();
          });
      };
    },
    [ref, restoreFocus],
  );
  useFloatingSurface(
    trigger,
    node,
    open,
    side,
    align,
    offset,
    context.revision,
  );
  const wasOpen = useRef(false);
  useLayoutEffect(() => {
    if (node === null) return;
    if (open && !wasOpen.current) {
      const targets = Array.from(
        node.querySelectorAll<HTMLElement>(
          "button, a[href], input, select, textarea, [tabindex='0']",
        ),
      ).filter(
        (item) =>
          isRovingItemAvailable(item, node) &&
          !item.matches("input[type=hidden]") &&
          item.closest("[data-state='closed']") === null,
      );
      const target =
        initialFocus?.current ??
        (context.focusEdge() === "last" ? targets.at(-1) : targets[0]);
      (target ?? node).focus({ preventScroll: true });
    } else if (
      !open &&
      wasOpen.current &&
      (node.ownerDocument.activeElement === node.ownerDocument.body ||
        node.contains(node.ownerDocument.activeElement))
    )
      restoreFocus();
    wasOpen.current = open;
  }, [node, open, initialFocus, context, restoreFocus]);
  useEffect(() => {
    if (!open || node === null) return;
    const doc = node.ownerDocument;
    function outside(event: Event) {
      const target = event.target;
      if (
        target instanceof Node &&
        !node?.contains(target) &&
        !trigger?.contains(target)
      )
        request(false);
    }
    function escape(event: KeyboardEvent) {
      if (
        event.target instanceof Element &&
        event.target.closest("[data-flux-popover]") !== node
      )
        return;
      if (event.key === "Escape" && !event.defaultPrevented) {
        event.preventDefault();
        request(false);
      }
    }
    // Native auto popovers own the dismiss stack. This is a progressive fallback,
    // not a second competing Escape listener in supporting browsers.
    const native = typeof node.showPopover === "function";
    if (!native) {
      doc.addEventListener("pointerdown", outside);
      doc.addEventListener("keydown", escape);
    }
    doc.addEventListener("focusin", outside);
    return () => {
      if (!native) {
        doc.removeEventListener("pointerdown", outside);
        doc.removeEventListener("keydown", escape);
      }
      doc.removeEventListener("focusin", outside);
    };
  }, [node, open, request, trigger]);
  return (
    <div
      {...props}
      data-flux-popover=""
      hidden={!open}
      id={context.id}
      role={role}
      tabIndex={tabIndex}
      popover="auto"
      ref={setRef}
      className={joinClassNames(popup, className)}
      data-state={open ? "open" : "closed"}
      onToggle={(event) => {
        onToggle?.(event);
        if (
          event.target === event.currentTarget &&
          context.open &&
          !nativePopoverOpen(event.currentTarget)
        )
          context.nativeDismiss();
      }}
    />
  );
}
export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Popup: PopoverPopup,
  Close: PopoverClose,
} as const;
