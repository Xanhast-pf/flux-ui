import { useCallback } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { scrollArea } from "./ScrollArea.css.js";
import type { ScrollAreaProps } from "./ScrollArea.types.js";
/** Native scrollbars. Only an overflowing region enters the tab order by default. */
export function ScrollArea({
  axis = "both",
  className,
  ref,
  tabIndex,
  ...props
}: ScrollAreaProps) {
  const attach = useCallback(
    (node: HTMLDivElement | null) => {
      if (node === null) return undefined;
      const refCleanup = typeof ref === "function" ? ref(node) : undefined;
      if (ref && typeof ref !== "function") ref.current = node;
      const update = () => {
        if (tabIndex !== undefined) return;
        const horizontal =
          axis !== "vertical" && node.scrollWidth > node.clientWidth;
        const vertical =
          axis !== "horizontal" && node.scrollHeight > node.clientHeight;
        node.tabIndex = horizontal || vertical ? 0 : -1;
      };
      const resize =
        typeof ResizeObserver === "undefined"
          ? undefined
          : new ResizeObserver(update);
      const observe = () => {
        resize?.disconnect();
        resize?.observe(node);
        for (const child of node.children) resize?.observe(child);
        update();
      };
      const mutation =
        typeof MutationObserver === "undefined"
          ? undefined
          : new MutationObserver(observe);
      mutation?.observe(node, {
        childList: true,
        subtree: true,
        characterData: true,
      });
      window.addEventListener("resize", update);
      observe();
      return () => {
        resize?.disconnect();
        mutation?.disconnect();
        window.removeEventListener("resize", update);
        if (typeof refCleanup === "function") refCleanup();
        else if (typeof ref === "function") ref(null);
        else if (ref) ref.current = null;
      };
    },
    [axis, ref, tabIndex],
  );
  return (
    <div
      {...props}
      ref={attach}
      role="region"
      tabIndex={tabIndex}
      data-axis={axis}
      className={joinClassNames(scrollArea, className)}
    />
  );
}
