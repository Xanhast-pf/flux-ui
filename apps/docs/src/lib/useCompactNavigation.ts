import { useCallback, useSyncExternalStore } from "react";
const query = "(width < 48rem)";
const getSnapshot = () => window.matchMedia(query).matches;
const getServerSnapshot = () => false;
/** Site navigation follows the viewport; component previews follow their canvas. */
export function useCompactNavigation(onBreakpointChange: () => void): boolean {
  const subscribe = useCallback(
    (notify: () => void) => {
      const media = window.matchMedia(query);
      function change() {
        onBreakpointChange();
        notify();
      }
      media.addEventListener("change", change);
      return () => media.removeEventListener("change", change);
    },
    [onBreakpointChange],
  );
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
