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
  const [open, setOpen] = useState(false);
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
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  }, []);
  useEffect(() => cancelTimer, [cancelTimer]);
  function schedule(show: boolean, wait: number) {
    cancelTimer();
    timer.current = setTimeout(() => {
      timer.current = null;
      const current = activity.current;
      if (show && !current.dismissed) setOpen(true);
      else if (!show && !current.hover && !current.focus && !current.popup)
        setOpen(false);
    }, wait);
  }
  useEffect(() => {
    if (!open || anchor === null) return;
    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      event.preventDefault();
      cancelTimer();
      activity.current.dismissed = true;
      setOpen(false);
    }
    const doc = anchor.ownerDocument;
    doc.addEventListener("keydown", escape);
    return () => doc.removeEventListener("keydown", escape);
  }, [anchor, open, cancelTimer]);
  useFloatingSurface(anchor, node, open, side, align);
  const describedBy = [
    ...new Set(
      [
        ...(childProps["aria-describedby"]?.split(/\s+/) ?? []),
        tooltipId,
      ].filter(Boolean),
    ),
  ].join(" ");
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
          setOpen(true);
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
