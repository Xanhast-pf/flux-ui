import { useLayoutEffect, useState, type RefObject } from "react";
import type { OverflowCapability } from "../../internal/overflowCapability.js";

interface OverflowItem {
  id: string;
  node: HTMLElement;
  label: string;
  disabled: boolean;
}

function itemLabel(node: HTMLElement): string {
  const ids = node.getAttribute("aria-labelledby")?.split(/\s+/);
  return (
    ids
      ?.map((id) => node.ownerDocument.getElementById(id)?.textContent ?? "")
      .join(" ") ||
    node.getAttribute("aria-label") ||
    node.textContent
  ).trim();
}

export function useOverflowItems(
  scope: RefObject<HTMLElement | null>,
  capability: OverflowCapability,
  trigger: RefObject<HTMLSelectElement | null>,
): OverflowItem[] {
  const {
    items: getItems,
    selected: selectedSelector = "[aria-selected=true]",
  } = capability;
  const [items, setItems] = useState<OverflowItem[]>([]);
  useLayoutEffect(() => {
    const node = scope.current?.firstElementChild;
    if (!(node instanceof HTMLElement)) return;
    const button = trigger.current;
    const view = node.ownerDocument.defaultView;
    if (
      button === null ||
      view === null ||
      typeof ResizeObserver === "undefined"
    )
      return;
    let frame = 0;
    const owned = new Set<HTMLElement>();
    const observed = new Set<HTMLElement>();
    const restore = (item: HTMLElement) => {
      item.removeAttribute("data-flux-overflowed");
      item.removeAttribute("inert");
      owned.delete(item);
    };
    const measure = () => {
      frame = 0;
      const candidates = getItems(node).filter(
        (item) =>
          !item.closest("[hidden]") &&
          (!item.closest("[inert]") || owned.has(item)) &&
          !item.parentElement?.closest("[inert]"),
      );
      for (const item of observed) {
        if (!candidates.includes(item)) {
          resize.unobserve(item);
          observed.delete(item);
        }
      }
      for (const item of candidates) {
        if (!observed.has(item)) {
          resize.observe(item);
          observed.add(item);
        }
      }
      for (const item of owned) if (!candidates.includes(item)) restore(item);
      const vertical = node.getAttribute("aria-orientation") === "vertical";
      const styles = view.getComputedStyle(node);
      const gap =
        Number.parseFloat(vertical ? styles.rowGap : styles.columnGap) || 0;
      const extent = (item: HTMLElement) =>
        vertical
          ? item.getBoundingClientRect().height
          : item.getBoundingClientRect().width;
      const available =
        (vertical
          ? node.clientHeight
          : (node.parentElement?.clientWidth ?? node.clientWidth)) -
        (Number.parseFloat(vertical ? styles.paddingTop : styles.paddingLeft) ||
          0) -
        (Number.parseFloat(
          vertical ? styles.paddingBottom : styles.paddingRight,
        ) || 0);
      const sizes = candidates.map(extent);
      const total =
        sizes.reduce((sum, size) => sum + size, 0) +
        gap * Math.max(0, sizes.length - 1);
      const hidden = new Set<HTMLElement>();
      // Explicit wrapping remains the collection's own layout policy.
      if (available > 0 && total > available && styles.flexWrap !== "wrap") {
        const controlGap =
          Number.parseFloat(
            view.getComputedStyle(node.parentElement ?? node).columnGap,
          ) || 0;
        let remaining =
          available - (vertical ? 0 : extent(button) + controlGap) + gap;
        const selected = candidates.find((item) =>
          item.matches(selectedSelector),
        );
        if (selected) remaining -= extent(selected) + gap;
        for (const [index, item] of candidates.entries()) {
          if (item === selected) continue;
          const size = sizes[index] ?? 0;
          if (size <= remaining) remaining -= size + gap;
          else hidden.add(item);
        }
      }
      const focused = node.ownerDocument.activeElement;
      for (const item of owned) if (!hidden.has(item)) restore(item);
      for (const item of hidden) {
        if (!item.hasAttribute("data-flux-overflowed")) {
          owned.add(item);
          item.setAttribute("data-flux-overflowed", "");
          item.setAttribute("inert", "");
        }
      }
      const next = [...hidden].map((item) => ({
        id: item.id,
        node: item,
        label: itemLabel(item),
        disabled: item.matches(":disabled, [aria-disabled='true']"),
      }));
      setItems((previous) =>
        previous.length === next.length &&
        previous.every((item, index) => {
          const other = next[index];
          return (
            other &&
            item.id === other.id &&
            item.node === other.node &&
            item.label === other.label &&
            item.disabled === other.disabled
          );
        })
          ? previous
          : next,
      );
      if (focused instanceof HTMLElement && hidden.has(focused))
        button.focus({ preventScroll: true });
      if (next.length === 0 && focused === button)
        candidates
          .find((item) => item.matches(selectedSelector))
          ?.focus({ preventScroll: true });
    };
    const schedule = () => {
      if (!frame) frame = view.requestAnimationFrame(measure);
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
    });
    measure();
    return () => {
      view.cancelAnimationFrame(frame);
      resize.disconnect();
      mutation.disconnect();
      for (const item of owned) restore(item);
    };
  }, [scope, getItems, selectedSelector, trigger]);
  return items;
}
