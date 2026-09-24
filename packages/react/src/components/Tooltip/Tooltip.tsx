import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type PointerEvent,
  type FocusEvent,
  type ReactElement,
  type Ref,
} from "react";
import { attachRef } from "../../internal/attachRef.js";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { useFloatingSurface } from "../../internal/useFloatingSurface.js";
import { tooltip } from "./Tooltip.css.js";
import type { TooltipProps } from "./Tooltip.types.js";
type TriggerProps = HTMLAttributes<HTMLElement> & {
  ref?: Ref<HTMLElement>;
};
export function Tooltip({
  children,
  content,
  side = "top",
  align = "center",
  delay = 300,
  defaultOpen = false,
  open: controlled,
  onOpenChange,
  id,
  ref,
  className,
  onPointerEnter,
  onPointerLeave,
  ...props
}: TooltipProps) {
  const generated = useId();
  const tooltipId = id ?? generated;
  const child = children as ReactElement<TriggerProps>;
  const childProps = child.props;
  const Trigger = child.type;
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const open = controlled ?? localOpen;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activity = useRef({
    hover: false,
    focus: false,
    popup: false,
    dismissed: false,
  });
  const {
    ref: childRef,
    onPointerEnter: childEnter,
    onPointerLeave: childLeave,
    onFocus: childFocus,
    onBlur: childBlur,
  } = childProps;
  const setTriggerRef = useCallback(
    (element: HTMLElement | null) => {
      setAnchor(element);
      if (element === null) return;
      const cleanup = attachRef(childRef, element);
      return () => {
        cleanup?.();
        setAnchor(null);
      };
    },
    [childRef],
  );
  const setPopupRef = useCallback(
    (element: HTMLDivElement | null) => {
      setNode(element);
      if (element === null) return;
      const cleanup = attachRef(ref, element);
      return () => {
        cleanup?.();
        setNode(null);
      };
    },
    [ref],
  );
  const cancelTimer = useCallback(() => {
    clearTimeout(timer.current!);
  }, []);
  useEffect(() => cancelTimer, [cancelTimer]);
  function requestOpen(next: boolean) {
    if (next === open) return;
    if (controlled === undefined) setLocalOpen(next);
    onOpenChange?.(next);
  }
  function schedule(show: boolean, wait: number) {
    cancelTimer();
    timer.current = setTimeout(() => {
      const current = activity.current;
      if (show && !current.dismissed) requestOpen(true);
      else if (!show && !current.hover && !current.focus && !current.popup)
        requestOpen(false);
    }, wait);
  }
  useEffect(() => {
    if (!open || anchor === null) return;
    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      event.preventDefault();
      cancelTimer();
      activity.current.dismissed = true;
      if (controlled === undefined) setLocalOpen(false);
      onOpenChange?.(false);
    }
    const doc = anchor.ownerDocument;
    doc.addEventListener("keydown", escape);
    return () => doc.removeEventListener("keydown", escape);
  }, [anchor, open, cancelTimer, controlled, onOpenChange]);
  useFloatingSurface(anchor, node, open, side, align);
  const describedBy = childProps["aria-describedby"]
    ? `${childProps["aria-describedby"]} ${tooltipId}`
    : tooltipId;
  return (
    <>
      <Trigger
        {...childProps}
        key={child.key}
        ref={setTriggerRef}
        aria-describedby={describedBy}
        onPointerEnter={(event: PointerEvent<HTMLElement>) => {
          childEnter?.(event);
          if (event.defaultPrevented || event.pointerType === "touch") return;
          activity.current.hover = true;
          activity.current.dismissed = false;
          schedule(true, Number.isFinite(delay) ? Math.max(0, delay) : 300);
        }}
        onPointerLeave={(event: PointerEvent<HTMLElement>) => {
          childLeave?.(event);
          activity.current.hover = false;
          schedule(false, 100);
        }}
        onFocus={(event: FocusEvent<HTMLElement>) => {
          childFocus?.(event);
          if (event.defaultPrevented) return;
          activity.current.focus = true;
          activity.current.dismissed = false;
          cancelTimer();
          requestOpen(true);
        }}
        onBlur={(event: FocusEvent<HTMLElement>) => {
          childBlur?.(event);
          activity.current.focus = false;
          schedule(false, 100);
        }}
      />
      <div
        {...props}
        ref={setPopupRef}
        id={tooltipId}
        role="tooltip"
        popover="manual"
        hidden={!open}
        data-state={open ? "open" : "closed"}
        className={joinClassNames(tooltip, className)}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);
          activity.current.popup = true;
          cancelTimer();
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          activity.current.popup = false;
          schedule(false, 100);
        }}
      >
        {content}
      </div>
    </>
  );
}
