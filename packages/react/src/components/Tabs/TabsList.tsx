import { useCallback, useLayoutEffect, useRef } from "react";
import { DropdownMenu } from "../DropdownMenu/DropdownMenu.js";
import { useTabOverflow } from "./useTabOverflow.js";
import { attachRef } from "../../internal/attachRef.js";
import { joinClassNames } from "../../internal/joinClassNames.js";
import {
  isRovingItemAvailable,
  nextRovingIndex,
} from "../../internal/rovingFocus.js";
import { list, strip, more } from "./Tabs.css.js";
import { useTabsContext } from "./TabsContext.js";
import type { TabsListProps } from "./Tabs.types.js";
const tabs = (node: HTMLElement) =>
  [...node.querySelectorAll<HTMLButtonElement>('[role="tab"]')].filter(
    (tab) => tab.closest('[role="tablist"]') === node,
  );
export function TabsList({
  wrap = false,
  activateOnFocus = false,
  loopFocus = true,
  onKeyDown,
  className,
  ref,
  tabIndex = -1,
  ...props
}: TabsListProps) {
  const context = useTabsContext("List");
  const trigger = useRef<HTMLButtonElement>(null);
  const previous = useRef(0);
  const focused = useRef<HTMLButtonElement | null>(null);
  const scope = useRef<HTMLDivElement | null>(null);
  const horizontal = context.orientation === "horizontal" && !wrap;
  const overflow = useTabOverflow(scope, trigger, horizontal, context.value);
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      scope.current = node;
      if (!node) return;
      const cleanup = attachRef(ref, node);
      return () => {
        scope.current = null;
        cleanup?.();
      };
    },
    [ref],
  );
  useLayoutEffect(() => {
    const node = scope.current;
    if (!node) return;
    const reconcile = () => {
      const candidates = tabs(node);
      const all = candidates.filter((tab) => isRovingItemAvailable(tab, node));
      const selected =
        all.find((tab) => tab.dataset.fluxTabValue === context.value) ??
        all[Math.min(previous.current, all.length - 1)];
      for (const tab of candidates) tab.tabIndex = tab === selected ? 0 : -1;
      if (!selected) return;
      previous.current = all.indexOf(selected);
      const value = selected.dataset.fluxTabValue;
      if (!context.controlled && value !== undefined) context.setValue(value);
      if (
        focused.current &&
        !all.includes(focused.current) &&
        (node.ownerDocument.activeElement === node.ownerDocument.body ||
          node.contains(node.ownerDocument.activeElement))
      ) {
        selected.focus();
        focused.current = selected;
      }
    };
    const focus = (event: FocusEvent) => {
      if (
        event.target instanceof HTMLButtonElement &&
        event.target.closest('[role="tablist"]') === node
      )
        focused.current = event.target;
    };
    const blur = (event: FocusEvent) => {
      if (
        event.relatedTarget instanceof Node &&
        !node.contains(event.relatedTarget)
      )
        focused.current = null;
    };
    reconcile();
    const observer = new MutationObserver(reconcile);
    observer.observe(node, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: [
        "disabled",
        "aria-disabled",
        "hidden",
        "inert",
        "data-flux-tab-value",
      ],
    });
    node.addEventListener("focusin", focus);
    node.addEventListener("focusout", blur);
    return () => {
      observer.disconnect();
      node.removeEventListener("focusin", focus);
      node.removeEventListener("focusout", blur);
    };
  }, [context]);
  const element = (
    <div
      {...props}
      data-flux-tabs-managed={overflow.managed || undefined}
      data-a={context.appearance}
      data-w={wrap || undefined}
      aria-orientation={context.orientation}
      className={joinClassNames(list, className)}
      ref={setRef}
      role="tablist"
      tabIndex={tabIndex}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        const node = event.currentTarget;
        if (
          event.defaultPrevented ||
          event.altKey ||
          event.ctrlKey ||
          event.metaKey ||
          event.nativeEvent.isComposing ||
          !(event.target instanceof Element) ||
          event.target.closest('[role="tablist"]') !== node
        )
          return;
        const all = tabs(node).filter((tab) =>
          isRovingItemAvailable(tab, node),
        );
        const index = nextRovingIndex(
          event.key,
          all.findIndex((tab) => tab === event.target),
          all.length,
          {
            orientation: context.orientation,
            direction:
              node.ownerDocument.defaultView?.getComputedStyle(node)
                .direction === "rtl"
                ? "rtl"
                : "ltr",
            loopFocus,
          },
        );
        if (index === null) return;
        const next = all[index];
        if (!next) return;
        event.preventDefault();
        next.focus();
        const value = next.dataset.fluxTabValue;
        if (activateOnFocus && value !== undefined) context.setValue(value);
      }}
    />
  );
  if (!horizontal) return element;
  return (
    <div className={strip} data-active={overflow.items.length > 0 || undefined}>
      {element}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          ref={trigger}
          className={more}
          aria-label="More tabs"
          variant="ghost"
          tone="neutral"
          size={context.size}
          tabIndex={overflow.items.length ? 0 : -1}
          aria-hidden={overflow.items.length ? undefined : true}
        >
          <span aria-hidden="true">···</span>
        </DropdownMenu.Trigger>
        {overflow.items.length > 0 && (
          <DropdownMenu.Popup aria-label="More tabs" align="end">
            {overflow.items.map((item) => (
              <DropdownMenu.Item
                key={item.id}
                disabled={item.disabled}
                onSelect={() => overflow.activate(item.node)}
              >
                {item.label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Popup>
        )}
      </DropdownMenu.Root>
    </div>
  );
}
