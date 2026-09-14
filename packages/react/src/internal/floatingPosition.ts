export type FloatingSide = "top" | "right" | "bottom" | "left";
export type FloatingAlign = "start" | "center" | "end";
export interface FloatingRect {
  left: number;
  top: number;
  width: number;
  height: number;
}
/** Viewport-relative positioning: flip on the main axis, then clamp both axes. */
export function floatingPosition(
  anchor: FloatingRect,
  popup: {
    width: number;
    height: number;
  },
  viewport: {
    width: number;
    height: number;
  },
  {
    side = "bottom",
    align = "start",
    offset = 8,
    rtl = false,
  }: {
    side?: FloatingSide;
    align?: FloatingAlign;
    offset?: number;
    rtl?: boolean;
  } = {},
) {
  const gap = Number.isFinite(offset) ? Math.max(0, offset) : 8;
  const padding = 8;
  const room = {
    top: anchor.top - gap - padding,
    bottom: viewport.height - anchor.top - anchor.height - gap - padding,
    left: anchor.left - gap - padding,
    right: viewport.width - anchor.left - anchor.width - gap - padding,
  };
  const opposite = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  } as const;
  const vertical = side === "top" || side === "bottom";
  const needed = vertical ? popup.height : popup.width;
  const actualSide =
    room[side] < needed && room[opposite[side]] > room[side]
      ? opposite[side]
      : side;
  const fraction = align === "center" ? 0.5 : align === "end" ? 1 : 0;
  const horizontalFraction = rtl ? 1 - fraction : fraction;
  let left = anchor.left + (anchor.width - popup.width) * horizontalFraction;
  let top = anchor.top + (anchor.height - popup.height) * fraction;
  if (actualSide === "top") top = anchor.top - popup.height - gap;
  if (actualSide === "bottom") top = anchor.top + anchor.height + gap;
  if (actualSide === "left") left = anchor.left - popup.width - gap;
  if (actualSide === "right") left = anchor.left + anchor.width + gap;
  return {
    side: actualSide,
    left: Math.max(
      padding,
      Math.min(left, viewport.width - popup.width - padding),
    ),
    top: Math.max(
      padding,
      Math.min(top, viewport.height - popup.height - padding),
    ),
    maxHeight: Math.max(
      0,
      vertical ? room[actualSide] : viewport.height - padding * 2,
    ),
  };
}
