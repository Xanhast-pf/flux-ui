import { useCallback, useSyncExternalStore } from "react";

const compactViewportWidth = 48 * 16;
const getSnapshot = () => window.innerWidth < compactViewportWidth;
const getServerSnapshot = () => false;

/** Site navigation follows the viewport; component previews follow their canvas. */
export function useCompactNavigation(onBreakpointChange: () => void): boolean {
  const subscribe = useCallback(
    (notify: () => void) => {
      let compact = getSnapshot();

      function change() {
        const next = getSnapshot();
        if (next === compact) return;
        compact = next;
        onBreakpointChange();
        notify();
      }

      window.addEventListener("resize", change);
      return () => window.removeEventListener("resize", change);
    },
    [onBreakpointChange],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
