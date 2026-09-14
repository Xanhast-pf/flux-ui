import { useCallback } from "react";
import { attachRef } from "../../internal/attachRef.js";
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
      const detach = attachRef(ref, node);
      const view = node.ownerDocument.defaultView;
      // Explicit tab order needs no observers, measurements or resize listener.
      if (tabIndex !== undefined || view === null) return detach;
      const update = () => {
        const next =
          (axis !== "vertical" && node.scrollWidth > node.clientWidth) ||
          (axis !== "horizontal" && node.scrollHeight > node.clientHeight)
            ? 0
            : -1;
        if (node.tabIndex !== next || !node.hasAttribute("tabindex"))
          node.tabIndex = next;
      };
      const resize =
        typeof view.ResizeObserver === "undefined"
          ? undefined
          : new view.ResizeObserver(update);
      resize?.observe(node);
      for (const child of node.children) resize?.observe(child);
      const mutation = new view.MutationObserver((records) => {
        // Text/deep mutations only need measurement. Reconnect only the direct
        // children whose membership actually changed, not the entire subtree.
        if (resize)
          for (const record of records) {
            if (record.target !== node) continue;
            for (const child of record.removedNodes)
              if (child instanceof view.Element) resize.unobserve(child);
            for (const child of record.addedNodes)
              if (child instanceof view.Element) resize.observe(child);
          }
        update();
      });
      mutation.observe(node, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["class", "style", "hidden", "inert", "open"],
      });
      view.addEventListener("resize", update);
      update();
      return () => {
        resize?.disconnect();
        mutation.disconnect();
        view.removeEventListener("resize", update);
        detach?.();
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
