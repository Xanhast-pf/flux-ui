import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type FocusEvent,
  type FocusEventHandler,
  type KeyboardEvent,
  type KeyboardEventHandler,
  type ReactNode,
  type Ref,
  type RefCallback,
} from "react";
import { nextRovingIndex } from "./rovingFocus.js";

type RovingContextValue = {
  orientation: "horizontal" | "vertical";
  register: (node: HTMLElement) => () => void;
  refresh: () => void;
  onFocus: (event: FocusEvent<HTMLElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
};
const RovingContext = createContext<RovingContextValue | null>(null);

export function useRovingContext(): RovingContextValue {
  const context = useContext(RovingContext);
  if (context === null)
    throw new Error(
      "This item must be inside its Toolbar.Root or ToggleGroup.Root.",
    );
  return context;
}

export function RovingFocus({
  children,
  orientation,
  loopFocus,
}: {
  children: ReactNode;
  orientation: "horizontal" | "vertical";
  loopFocus: boolean;
}) {
  const items = useRef(new Set<HTMLElement>());
  const focused = useRef<HTMLElement | null>(null);
  const ordered = useCallback(
    () =>
      Array.from(items.current).sort((left, right) => {
        if (left === right) return 0;
        // DOCUMENT_POSITION_FOLLOWING is 4. No global DOM access during SSR.
        return left.compareDocumentPosition(right) & 4 ? -1 : 1;
      }),
    [],
  );
  const refresh = useCallback(() => {
    const all = ordered();
    const available = all.filter((node) => {
      if (node.matches(":disabled, [aria-disabled='true']")) return false;
      const scope = node.closest("[data-flux-roving-root]");
      const hidden = node.closest("[hidden], [inert]");
      // Ignore an entirely hidden group/ancestor, but skip locally hidden items.
      return hidden === null || hidden === scope || !scope?.contains(hidden);
    });
    const last = focused.current;
    const active =
      last !== null && available.includes(last)
        ? last
        : (available.find(
            (node) => node.dataset.fluxRovingPreferred === "true",
          ) ?? available[0]);
    for (const node of all) node.tabIndex = node === active ? 0 : -1;
    return available;
  }, [ordered]);
  const register = useCallback(
    (node: HTMLElement) => {
      items.current.add(node);
      refresh();
      return () => {
        items.current.delete(node);
        refresh();
      };
    },
    [refresh],
  );

  // DOM-only reconciliation also handles reordered children and inherited disabled
  // state. No React state updates, document listeners, or observers are required.
  useEffect(() => {
    refresh();
  });

  function onFocus(event: FocusEvent<HTMLElement>): void {
    focused.current = event.currentTarget;
    refresh();
  }
  function onKeyDown(event: KeyboardEvent<HTMLElement>): void {
    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.target !== event.currentTarget
    )
      return;
    const available = refresh();
    const direction =
      event.currentTarget.ownerDocument.defaultView?.getComputedStyle(
        event.currentTarget,
      ).direction === "rtl"
        ? "rtl"
        : "ltr";
    const index = nextRovingIndex(
      event.key,
      available.indexOf(event.currentTarget),
      available.length,
      { orientation, direction, loopFocus },
    );
    if (index === null) return;
    event.preventDefault();
    available[index]?.focus();
  }
  return (
    <RovingContext
      value={{ orientation, register, refresh, onFocus, onKeyDown }}
    >
      {children}
    </RovingContext>
  );
}

function attachRef<Element extends HTMLElement>(
  ref: Ref<Element> | undefined,
  node: Element,
): () => void {
  if (typeof ref === "function") {
    const cleanup = ref(node);
    return () => {
      if (typeof cleanup === "function") cleanup();
      else ref(null);
    };
  }
  if (ref) ref.current = node;
  return () => {
    if (ref) ref.current = null;
  };
}

export function useRovingItem<Element extends HTMLElement>({
  ref: forwardedRef,
  onFocus,
  onKeyDown,
  disabled,
  hidden,
}: {
  ref?: Ref<Element> | undefined;
  disabled?: boolean | undefined;
  hidden?: boolean | undefined;
  onFocus?: FocusEventHandler<Element> | undefined;
  onKeyDown?: KeyboardEventHandler<Element> | undefined;
}) {
  const context = useRovingContext();
  const register = context.register;
  const ref: RefCallback<Element> = useCallback(
    (node) => {
      if (node === null) return;
      const unregister = register(node);
      const detach = attachRef(forwardedRef, node);
      return () => {
        unregister();
        detach();
      };
    },
    [register, forwardedRef],
  );
  const refresh = context.refresh;
  useEffect(() => {
    refresh();
  }, [refresh, disabled, hidden]);
  return {
    ref,
    onFocus(event: FocusEvent<Element>): void {
      onFocus?.(event);
      // Bookkeeping follows real focus even when a consumer cancels an event.
      context.onFocus(event);
    },
    onKeyDown(event: KeyboardEvent<Element>): void {
      onKeyDown?.(event);
      if (!event.defaultPrevented) context.onKeyDown(event);
    },
    // Reachable native buttons in server HTML; the commit-time collection reduces
    // this to exactly one stop on hydration, without a server-only child scan.
    tabIndex: 0,
  };
}
