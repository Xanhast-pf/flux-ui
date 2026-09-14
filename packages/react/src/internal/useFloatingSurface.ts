import { useLayoutEffect } from "react";
import {
  floatingPosition,
  type FloatingAlign,
  type FloatingSide,
} from "./floatingPosition.js";
export function nativePopoverOpen(node: HTMLElement): boolean {
  return (
    typeof node.showPopover === "function" && node.matches(":popover-open")
  );
}
function positionSurface(
  anchor: HTMLElement,
  popup: HTMLElement,
  view: Window,
  side: FloatingSide,
  align: FloatingAlign,
  offset: number,
) {
  const viewport = { width: view.innerWidth, height: view.innerHeight };
  const result = floatingPosition(
    anchor.getBoundingClientRect(),
    popup.getBoundingClientRect(),
    viewport,
    {
      side,
      align,
      offset,
      rtl: view.getComputedStyle(anchor).direction === "rtl",
    },
  );
  popup.style.setProperty("--f-layer-left", `${result.left}px`);
  popup.style.setProperty("--f-layer-top", `${result.top}px`);
  popup.style.setProperty("--f-layer-height", `${result.maxHeight}px`);
  popup.style.setProperty(
    "--f-layer-anchor-width",
    `${anchor.getBoundingClientRect().width}px`,
  );
  popup.dataset.side = result.side;
}

/** Native top-layer content keeps its DOM ancestry, scoped theme and reading order. */
export function useFloatingSurface(
  anchor: HTMLElement | null,
  popup: HTMLElement | null,
  open: boolean,
  side: FloatingSide = "bottom",
  align: FloatingAlign = "start",
  offset = 8,
  revision = 0,
) {
  useLayoutEffect(() => {
    if (popup === null) return;
    // Unsupported engines must not retain a UA-hidden popover attribute.
    if (typeof popup.showPopover !== "function")
      popup.removeAttribute("popover");
    if (!open) {
      if (nativePopoverOpen(popup)) popup.hidePopover();
      return;
    }
    if (typeof popup.showPopover === "function" && !nativePopoverOpen(popup))
      popup.showPopover();
    const view = popup.ownerDocument.defaultView;
    if (anchor === null || view === null) return;
    const position = () =>
      positionSurface(anchor, popup, view, side, align, offset);
    position();
    view.addEventListener("resize", position);
    view.addEventListener("scroll", position, true);
    const observer =
      typeof view.ResizeObserver === "function"
        ? new view.ResizeObserver(position)
        : null;
    observer?.observe(anchor);
    observer?.observe(popup);
    return () => {
      observer?.disconnect();
      view.removeEventListener("resize", position);
      view.removeEventListener("scroll", position, true);
    };
  }, [anchor, popup, open, side, align, offset, revision]);
}
