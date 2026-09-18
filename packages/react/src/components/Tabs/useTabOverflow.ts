import { useLayoutEffect, useRef, useState, type RefObject } from "react";

interface HiddenTab {
  id: string;
  node: HTMLButtonElement;
  label: string;
  disabled: boolean;
}
const marker = "data-flux-tab-overflowed";
function label(node: HTMLElement): string {
  return (
    node
      .getAttribute("aria-labelledby")
      ?.split(/\s+/)
      .map((id) => node.ownerDocument.getElementById(id)?.textContent ?? "")
      .join(" ")
      .trim() ||
    node.getAttribute("aria-label")?.trim() ||
    node.textContent.trim()
  );
}

/** One list-level controller; original buttons remain the activation authority. */
export function useTabOverflow(
  scope: RefObject<HTMLDivElement | null>,
  trigger: RefObject<HTMLButtonElement | null>,
  enabled: boolean,
  value: string,
) {
  const [items, setItems] = useState<HiddenTab[]>([]);
  const [managed, setManaged] = useState(false);
  const refresh = useRef<(() => void) | null>(null);
  const pendingFocus = useRef<HTMLButtonElement | null>(null);
  useLayoutEffect(() => {
    const node = scope.current;
    const button = trigger.current;
    const view = node?.ownerDocument.defaultView;
    if (
      !enabled ||
      !node ||
      !button ||
      !view ||
      typeof ResizeObserver === "undefined"
    )
      return;
    const owned = new Set<HTMLButtonElement>();
    const observed = new Set<HTMLButtonElement>();
    let frame = 0;
    const restore = (tab: HTMLButtonElement) => {
      tab.removeAttribute(marker);
      tab.removeAttribute("inert");
      owned.delete(tab);
    };
    const measure = () => {
      const candidates = [
        ...node.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
      ].filter(
        (tab) =>
          tab.closest('[role="tablist"]') === node &&
          !tab.closest("[hidden]") &&
          !tab.parentElement?.closest("[inert]") &&
          (!tab.hasAttribute("inert") || owned.has(tab)) &&
          (!tab.hasAttribute(marker) || owned.has(tab)),
      );
      const membership = new Set(candidates);
      for (const tab of observed)
        if (!membership.has(tab)) {
          resize.unobserve(tab);
          observed.delete(tab);
        }
      for (const tab of candidates)
        if (!observed.has(tab)) {
          resize.observe(tab);
          observed.add(tab);
        }
      for (const tab of owned) if (!membership.has(tab)) restore(tab);
      const styles = view.getComputedStyle(node);
      const gap = Number.parseFloat(styles.columnGap) || 0;
      const available =
        (node.parentElement?.clientWidth ?? node.clientWidth) -
        (Number.parseFloat(styles.paddingLeft) || 0) -
        (Number.parseFloat(styles.paddingRight) || 0) -
        (Number.parseFloat(styles.borderLeftWidth) || 0) -
        (Number.parseFloat(styles.borderRightWidth) || 0);
      if (
        available <= 0 ||
        candidates.some((tab) => tab.getBoundingClientRect().width <= 0)
      )
        return;
      // max-content is retained for overflowed buttons. scrollWidth retains an
      // oversized selected tab's intrinsic label width after its visible box clips.
      const widths = candidates.map((tab) =>
        Math.max(tab.getBoundingClientRect().width, tab.scrollWidth),
      );
      const total =
        widths.reduce((sum, width) => sum + width, 0) +
        gap * Math.max(0, candidates.length - 1);
      const selected = candidates.find(
        (tab) => tab.getAttribute("aria-selected") === "true",
      );
      const hidden = new Set<HTMLButtonElement>();
      if (total > available) {
        const controlGap =
          Number.parseFloat(
            view.getComputedStyle(node.parentElement ?? node).columnGap,
          ) || 0;
        let remaining =
          available - button.getBoundingClientRect().width - controlGap + gap;
        if (selected)
          remaining -= (widths[candidates.indexOf(selected)] ?? 0) + gap;
        candidates.forEach((tab, index) => {
          if (tab === selected) return;
          const width = widths[index] ?? 0;
          if (width + gap <= remaining) remaining -= width + gap;
          else hidden.add(tab);
        });
      }
      const focused = node.ownerDocument.activeElement;
      for (const tab of owned) if (!hidden.has(tab)) restore(tab);
      for (const tab of hidden)
        if (!owned.has(tab)) {
          owned.add(tab);
          tab.setAttribute(marker, "");
          tab.setAttribute("inert", "");
        }
      const next = [...hidden].map((tab) => ({
        id: tab.id,
        node: tab,
        label: label(tab),
        disabled: tab.matches(":disabled, [aria-disabled='true']"),
      }));
      setManaged(true);
      setItems((previous) =>
        previous.length === next.length &&
        previous.every((tab, index) => {
          const other = next[index];
          return (
            other &&
            tab.node === other.node &&
            tab.id === other.id &&
            tab.label === other.label &&
            tab.disabled === other.disabled
          );
        })
          ? previous
          : next,
      );
      // Make the trigger focusable before React commits the new membership.
      if (focused instanceof HTMLButtonElement && hidden.has(focused)) {
        node.parentElement?.setAttribute("data-active", "");
        button.removeAttribute("aria-hidden");
        button.focus({ preventScroll: true });
      }
      if (
        !next.length &&
        (focused === button ||
          node.parentElement?.querySelector('[role="menu"]')?.contains(focused))
      )
        selected?.focus({ preventScroll: true });
      const pending = pendingFocus.current;
      if (pending) {
        pendingFocus.current = null;
        if (pending === selected && !hidden.has(pending))
          pending.focus({ preventScroll: true });
      }
    };
    const schedule = () => {
      if (!frame)
        frame = view.requestAnimationFrame(() => {
          frame = 0;
          measure();
        });
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(node);
    if (node.parentElement) resize.observe(node.parentElement);
    resize.observe(button);
    const mutation = new MutationObserver(schedule);
    mutation.observe(node, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: [
        "id",
        "aria-selected",
        "aria-label",
        "aria-labelledby",
        "disabled",
        "aria-disabled",
        "hidden",
        "inert",
        "class",
        "style",
        "dir",
        "data-flux-tab-value",
      ],
    });
    refresh.current = () => {
      // Restore a newly selected tab before the roving-focus reconciler runs,
      // without forcing layout for every list during a React update.
      for (const tab of owned)
        if (tab.getAttribute("aria-selected") === "true") restore(tab);
      schedule();
    };
    measure();
    return () => {
      refresh.current = null;
      view.cancelAnimationFrame(frame);
      resize.disconnect();
      mutation.disconnect();
      for (const tab of owned) restore(tab);
      setManaged(false);
      setItems([]);
    };
  }, [scope, trigger, enabled]);
  useLayoutEffect(() => {
    refresh.current?.();
  }, [value]);
  function activate(tab: HTMLButtonElement) {
    if (tab.matches(":disabled, [aria-disabled='true']") || !tab.isConnected)
      return;
    pendingFocus.current = tab;
    // Keep ownership and geometry intact; only lift inert for native activation.
    tab.removeAttribute("inert");
    tab.click();
    if (tab.hasAttribute(marker)) tab.setAttribute("inert", "");
    // Let React commit selection and the menu perform its normal close first.
    queueMicrotask(() => refresh.current?.());
  }
  return { items, managed: enabled && managed, activate };
}
