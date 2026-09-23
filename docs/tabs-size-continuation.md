# Tabs whole-component size investigation

> **Historical report.** This records a prior snapshot, not current behavior or release readiness. Consult current engineering documentation and executed checks.

Current decision and validation: [semantic Tabs cleanup report](./component-ticket-validation.md). Automatic overflow was removed after this investigation.

## Outcome and scope

This continuation has **not completed the requested architecture redesign**. It adds reproducible historical evidence, a separately built semantic-core prototype, a dynamic-membership extension tested against the entire core Tabs suite, exact retained-output attribution, and measured CSS/rendering/feature-removal experiments. It does not establish an architectural floor.

No production change from these experiments was retained. Existing user-owned Tabs changes were restored exactly. No API, baseline, budget, dependency, size accounting, or generated registry was changed. The only retained changes from this continuation are this report and its link from `tabs-size-audit.md`.

The original audit remains the starting evidence baseline. All measurements below use its unchanged production accounting: Vite package output followed by `measureBundledEntry`, all entry exports retained, React peers external, and separately compressed JS and CSS summed. Temporary builds wrote outside the package output, except for the CSS experiment and the final restoration build.

## 1. Historical baseline: reproduced exactly

The baseline was established in commit `aac82d1fbfbc4692ac6220a50c89452aa2e941f0`, dated 2026-09-14, “feat: expand Flux UI primitives and ship production-grade showcase wo… (#34)”. Searching the baseline history for `6452` identifies this commit.

The historical Tabs source was rebuilt using the current package configuration, dependencies, shared helpers and CSS. It reproduced every accepted bundled metric exactly:

| Output           |   Raw |  Gzip | Brotli |
| ---------------- | ----: | ----: | -----: |
| Historical JS    | 4,292 | 1,966 |  1,754 |
| Historical CSS   | 2,160 |   780 |    640 |
| Historical total | 6,452 | 2,746 |  2,394 |

The historical implementation had Root, List, Tab and Panel; controlled/uncontrolled state; ARIA relationships; manual/automatic keyboard activation; RTL and vertical navigation; hidden/inert/disabled filtering; nested-list isolation; mutation-driven membership reconciliation; adjacent-selection and lost-focus recovery; native scrolling; explicit wrapping; and cleanup refs.

It had **no automatic overflow menu**, overflow button, fitting controller, menu typeahead, popup positioning, or resize-driven fitting. The current `OverflowList` compatibility entry was also absent.

There is no diff from that commit in the size tooling or React Vite configuration. Core Tabs CSS is also unchanged. Exact reproduction rules out changed CSS accounting, tree shaking, bundling, and shared-runtime attribution as explanations for this particular overage. The gate is a real pre-overflow implementation measurement, not an unexplained obsolete artifact. This does not authorize changing it.

## 2. Complete retained-byte attribution

The restored current build reproduced **16,268 / 5,916 / 5,282**.

| Output     |    Raw |  Gzip | Brotli |
| ---------- | -----: | ----: | -----: |
| JavaScript | 11,937 | 4,609 |  4,161 |
| CSS        |  4,331 | 1,307 |  1,121 |
| Total      | 16,268 | 5,916 |  5,282 |

Exact esbuild metafile attribution for minified JS:

| Retained production input                                     | Raw bytes in output |
| ------------------------------------------------------------- | ------------------: |
| Tabs chunk                                                    |              11,211 |
| Shared roving-focus chunk                                     |                 512 |
| `attachRef`                                                   |                 142 |
| `joinClassNames`                                              |                  52 |
| Output boundaries/import-export syntax not assigned to inputs |                  20 |
| Total                                                         |              11,937 |

Composed source maps give the following alternative partition of the **same** 11,937 bytes. This assigns each generated span up to the next source mapping; it is not additional code and is not an estimate of removable bytes.

| Source mapping          | Raw span bytes |
| ----------------------- | -------------: |
| `TabsListController.ts` |          7,241 |
| `TabsList.tsx`          |          1,764 |
| `Tabs.tsx`              |          1,228 |
| `rovingFocus.ts`        |            753 |
| `fitTabs.ts`            |            343 |
| `positionTabsMenu.ts`   |            275 |
| `attachRef.ts`          |            142 |
| `TabsContext.ts`        |            139 |
| `joinClassNames.ts`     |             52 |
| Total                   |         11,937 |

Within `Tabs.tsx`, nearest-function source-map spans are Root 362, Tab 524, and Panel plus trailing exports 342 bytes. These include mapped boundaries. The prior audit reported 1,227 for this source because it excluded the final output newline.

Controlled/uncontrolled state and ID generation are inside Root's span. Trigger selection/click cancellation is inside Tab. Keyboard/focus work spans the controller and roving helper. Overflow UI is in List; geometry, observation, menu behavior, active reveal, and cleanup are in the controller. These responsibilities are interleaved, so their independently compressed sizes cannot honestly be summed. The original audit's controller-section attribution remains useful as source-map evidence, not marginal feature cost.

There is one context/provider, no registration collection, generic controllable-state hook, polymorphic runtime, slot/cloning abstraction, or positioning library. Queries discover actual DOM membership. Only React and `react/jsx-runtime` are external. No Vanilla Extract runtime or unrelated component catalog is retained. Generated class-name bindings remain inside the Tabs chunk; the bundler does not assign them a separate source-module total.

## 3. CSS audit

Final esbuild CSS attribution:

| CSS                      | Raw bytes |
| ------------------------ | --------: |
| Core Tabs rules          |     2,159 |
| Automatic-overflow rules |       928 |
| Shared floating surface  |       667 |
| Shared menu items        |       576 |
| Output newline           |         1 |
| Total                    |     4,331 |

The 2,159-byte core fragment plus its own output newline explains the historical 2,160-byte CSS output.

Audit findings:

- Root/list sizing bounds constrain consumer geometry. List owns native scrolling, wrap, orientation and appearance. Overflow overrides scrolling only after fitting succeeds.
- Tab rules cover both sizes, both appearances, selected/hover/disabled states, vertical orientation, focus, forced colors and reduced motion. No entire variant was demonstrated unused.
- The repeated hidden guards apply to different layout-owning elements and preserve `hidden="until-found"`; deleting them without equivalent browser verification would be a semantic change.
- The overflow grid, measurement positioning, priority-tab clipping, and measuring-time width reset have distinct jobs. The `:has()` selector already delegates button-dependent spacing to CSS.
- Shared floating CSS is all relevant to the current popup: fixed positioning, viewport bounds, scrolling, visual treatment, focus and forced colors. Removing fallback behavior was not approved or justified by a browser-support change.
- Shared menu CSS contains declarations not needed by these text-only generated items: flex display, alignment, gap, and the danger-tone selector. This was measured as a specialization experiment below.
- There is no runtime style engine, generated unused variant catalog, or independently retained shared style runtime. No declaration was moved into another entry or hidden from accounting.

### CSS specialization experiment — rejected

Copying the menu rules locally while deleting flex/alignment/gap and danger-tone output produced:

| Output                    |    Raw |  Gzip | Brotli |
| ------------------------- | -----: | ----: | -----: |
| CSS before                |  4,331 | 1,307 |  1,121 |
| CSS after                 |  4,215 | 1,284 |  1,094 |
| Whole component after     | 16,148 | 5,885 |  5,237 |
| Whole-component reduction |    120 |    31 |     45 |

The JS difference comes from class bindings/output ordering, not removed behavior. The saving was too small to justify maintaining a duplicate menu-style definition. The experiment was restored from a pre-edit copy; it was not shipped or claimed behavior-verified. This is not an independently minimized CSS floor.

## 4. Minimal semantic prototype

A new internal List implementation used native scrolling, an event-time scoped DOM query, the existing small roving helper, one layout effect for selection/tab-stop reconciliation, native focus, and a composed cleanup ref. Existing Root/Tab/Panel and their complete visual styles were retained. It had no overflow controller, menu shell, geometry observer, or persistent collection registry.

| Architecture                              |   Raw |  Gzip | Brotli |
| ----------------------------------------- | ----: | ----: | -----: |
| Minimal semantic prototype                | 5,719 | 2,468 |  2,146 |
| Add dynamic membership and focus recovery | 6,523 | 2,748 |  2,403 |
| Marginal dynamic/recovery cost            |   804 |   280 |    257 |

Minimal prototype outputs were JS **3,559 / 1,688 / 1,506** and CSS **2,160 / 780 / 640**. Seven selected core tests passed: selection/panels, keyboard activation, nested state, nested event isolation, unavailable items, cancelled/modified keys, and controlled fallback. Seven other core tests were not selected for this deliberately reduced prototype.

The dynamic extension added mutation observation, previous-index recovery, focus tracking and cleanup. It passed **all 14 core Tabs tests**. Its outputs were JS **4,363 / 1,968 / 1,763** and the same CSS. It fits the historical tolerance but leaves only **59 raw / 53 gzip / 39 Brotli bytes** before overflow is added.

This is a measured candidate, not a mathematically proven minimum. It does not preserve the complete overflow contract or localized `OverflowList` behavior and must not replace the production implementation. Its observer lifecycle is also different from the production controller and has not been browser-performance validated.

## 5. Required incremental feature table — unfinished

The requested ordered construction of detection → presentation → active reveal → resize → dynamic membership → positioning has **not** been completed. The dynamic extension above was an independent semantic-core experiment, not that construction. No invented measurements fill the missing stages.

Independent diagnostic removals from the **full restored implementation** establish these exact whole-output results:

| Diagnostic architecture                                    |    Raw |  Gzip | Brotli | Reduction from full |
| ---------------------------------------------------------- | -----: | ----: | -----: | ------------------- |
| Full current implementation                                | 16,268 | 5,916 |  5,282 | —                   |
| Remove positioning and its scroll subscriptions            | 15,576 | 5,699 |  5,062 | 692 / 217 / 220     |
| Remove resize/font observation and per-tab resize tracking | 15,910 | 5,797 |  5,168 | 358 / 119 / 114     |
| Remove mutation subscription/cleanup                       | 15,995 | 5,820 |  5,185 | 273 / 96 / 97       |

Each row is a separate build against the full starting implementation. They are **not additive**, not acceptable implementations, and not costs of complete independent features. For example, removing mutation observation leaves reconciliation on React updates and resize, so 273 bytes is not the cost of all dynamic-membership behavior. CSS remains fully counted in each row.

## 6. Rendering architecture experiment — rejected

With the local-CSS candidate, an experiment moved generated menu-item DOM ownership into the controller, removing React item state and its post-render effect. It measured **16,128 / 5,878 / 5,232**, only **20 / 7 / 5 bytes** smaller than the local-CSS candidate.

Source inspection found that replacing all menu children loses React's keyed-node preservation when labels or membership change. Recovering the first enabled item is not equivalent to retaining the current focused item. This result was rejected without claiming behavior equivalence; it never replaced the production controller. Its negligible saving also did not justify another DOM-ownership model.

## 7. Selected architecture and compatibility

No replacement architecture was selected. The original one-context, List-owned controller and React-rendered menu remain intact. All pre-existing public API and automatic behavior are preserved by restoration, followed by the checks below.

The actual repository API is `Tabs.Root`, `Tabs.List`, `Tabs.Tab`, `Tabs.Panel`, plus `Tabs.OverflowList` compatibility. There are no `Tabs.Trigger` or `Tabs.Content` exports in the inspected source. No aliases were added to reconcile the example wording in the request.

## 8. Before/after and gate status

| Measurement | Before |  After |
| ----------- | -----: | -----: |
| Raw         | 16,268 | 16,268 |
| Gzip        |  5,916 |  5,916 |
| Brotli      |  5,282 |  5,282 |

The real changed-component size command ran and failed both Tabs gates:

| Gate       | Raw limit / overage | Gzip limit / overage | Brotli limit / overage |
| ---------- | ------------------- | -------------------- | ---------------------- |
| Historical | 6,582 / 9,686       | 2,801 / 3,115        | 2,442 / 2,840          |
| Absolute   | 14,336 / 1,932      | 4,096 / 1,820        | 3,072 / 2,210          |

Other pre-existing changed components also fail that command. They were not modified.

## 9. Validation and performance

Completed on the restored implementation:

- Complete Tabs suite: **35 passed in four files**, covering overflow, resizing, dynamic membership, keyboard behavior, controlled/uncontrolled behavior, nested instances, hydration and cleanup.
- Complete React package unit suite: **384 passed in 80 files**.
- React production build including declaration emission: passed.
- React package typecheck: passed.
- ESLint for the Tabs directory: passed.
- Prettier for Tabs TypeScript/TSX: passed.
- Changed-component size gates: failed as reported above.
- Existing Tabs SSR benchmark: **43.6377 ms mean for 1,000 instances**, 22.916 operations/sec, 12 samples, ±2.46% relative margin. No competing builds/tests ran during this measurement.

The SSR result does not measure layout, overflow interaction latency, browser mount/update/unmount ratios, or leaks. No browser performance baseline comparison was run, and no performance baseline was updated. The repository has an existing Tabs SSR benchmark but no Tabs-specific native-relative scenario in the inspected performance scenario registry.

- Four focused built-public-package Chromium tests: passed (overflow selection and keyboard targets, accessible menu/normal focus exit, container-only resize, and fallback without native popovers).
- One Chromium docs test: passed (ordinary Tabs preview automatic overflow and accessibility).

Browser startup initially failed because the sandbox denied listening on `127.0.0.1:4179` with EPERM. The same focused tests passed with local-server access. No test assertions or server configuration were weakened.

Not run: full repository verification, cross-browser coverage, a full-repository unit/tooling suite, or Coding Bible again. The previously documented JS-005 cleanup applicability finding was not changed or silenced. The full **React package** suite above must not be confused with full repository verification.

## 10. Remaining work and risks

A PASS or architectural-floor conclusion is not supported. The remaining concrete avenue is an integrated prototype adding every overflow requirement to the smaller semantic shell, with independently optimized CSS, measured after each feature addition. The minimal prototype and independent removals above cannot substitute for that work.

In particular, fitting and presentation remain coupled in the production architecture; their marginal costs in a smaller integrated architecture are unknown. Active reveal, font changes, arbitrary child wrappers, focus retention during menu updates, fallback popovers, and controlled click cancellation must all survive the redesign. No change to the current gate is justified by this report.

## Appendix: semantic prototype source

These are diagnostic replacements for `packages/react/src/components/Tabs/TabsList.tsx`, not production proposals. All other source remains as in the starting working tree. A temporary Vite pre-load plugin returned the selected replacement at the original file ID; the existing full package build emitted to a temporary directory, and `measureBundledEntry` measured that directory's `tabs.js`. Vitest used the same replacement plugin with the package's existing config. This preserves the original build and CSS identifiers and does not hide required code in another entry.

The compatibility alias below deliberately omits localized overflow behavior, as explained above.

### Minimal semantic List

```tsx
import { useCallback, useLayoutEffect, useRef } from "react";
import { attachRef } from "../../internal/attachRef.js";
import { joinClassNames } from "../../internal/joinClassNames.js";
import {
  isRovingItemAvailable,
  nextRovingIndex,
} from "../../internal/rovingFocus.js";
import { list } from "./Tabs.css.js";
import { useTabsContext } from "./TabsContext.js";
import type { TabsListProps } from "./Tabs.types.js";
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
  const scope = useRef<HTMLDivElement | null>(null);
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      scope.current = node;
      if (node === null) return;
      const cleanup = attachRef(ref, node);
      return () => {
        scope.current = null;
        cleanup?.();
      };
    },
    [ref],
  );
  const tabs = (node: HTMLDivElement) =>
    Array.from(node.querySelectorAll<HTMLButtonElement>('[role="tab"]')).filter(
      (tab) =>
        tab.closest('[role="tablist"]') === node &&
        isRovingItemAvailable(tab, node),
    );
  useLayoutEffect(() => {
    const node = scope.current;
    if (node === null) return;
    const all = tabs(node);
    const selected =
      all.find((tab) => tab.dataset.fluxTabValue === context.value) ?? all[0];
    for (const tab of node.querySelectorAll<HTMLButtonElement>('[role="tab"]'))
      if (tab.closest('[role="tablist"]') === node)
        tab.tabIndex = tab === selected ? 0 : -1;
    const value = selected?.dataset.fluxTabValue;
    if (!context.controlled && value !== undefined) context.setValue(value);
  }, [context]);
  return (
    <div
      {...props}
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
        const all = tabs(node);
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
        if (next === undefined) return;
        event.preventDefault();
        next.focus();
        const value = next.dataset.fluxTabValue;
        if (activateOnFocus && value !== undefined) context.setValue(value);
      }}
    />
  );
}
export const TabsOverflowList = TabsList;
```

### Semantic List with dynamic membership and focus recovery

```tsx
import { useCallback, useLayoutEffect, useRef } from "react";
import { attachRef } from "../../internal/attachRef.js";
import { joinClassNames } from "../../internal/joinClassNames.js";
import {
  isRovingItemAvailable,
  nextRovingIndex,
} from "../../internal/rovingFocus.js";
import { list } from "./Tabs.css.js";
import { useTabsContext } from "./TabsContext.js";
import type { TabsListProps } from "./Tabs.types.js";
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
  const previous = useRef(0);
  const focused = useRef<HTMLButtonElement | null>(null);
  const scope = useRef<HTMLDivElement | null>(null);
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      scope.current = node;
      if (node === null) return;
      const cleanup = attachRef(ref, node);
      return () => {
        scope.current = null;
        cleanup?.();
      };
    },
    [ref],
  );
  const tabs = (node: HTMLDivElement) =>
    Array.from(node.querySelectorAll<HTMLButtonElement>('[role="tab"]')).filter(
      (tab) =>
        tab.closest('[role="tablist"]') === node &&
        isRovingItemAvailable(tab, node),
    );
  useLayoutEffect(() => {
    const node = scope.current;
    if (node === null) return;
    function reconcile() {
      const all = tabs(node);
      const selected =
        all.find((tab) => tab.dataset.fluxTabValue === context.value) ??
        all[Math.min(previous.current, all.length - 1)];
      for (const tab of node.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]',
      ))
        if (tab.closest('[role="tablist"]') === node)
          tab.tabIndex = tab === selected ? 0 : -1;
      if (!selected) return;
      previous.current = all.indexOf(selected);
      const value = selected.dataset.fluxTabValue;
      if (!context.controlled && value !== undefined) context.setValue(value);
      if (
        focused.current !== null &&
        !all.includes(focused.current) &&
        (node.ownerDocument.activeElement === node.ownerDocument.body ||
          node.contains(node.ownerDocument.activeElement))
      ) {
        selected.focus();
        focused.current = selected;
      }
    }
    function focus(event: FocusEvent) {
      if (
        event.target instanceof HTMLButtonElement &&
        event.target.closest('[role="tablist"]') === node
      )
        focused.current = event.target;
    }
    function blur(event: FocusEvent) {
      if (
        event.relatedTarget instanceof Node &&
        !node.contains(event.relatedTarget)
      )
        focused.current = null;
    }
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
  return (
    <div
      {...props}
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
        const all = tabs(node);
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
        if (next === undefined) return;
        event.preventDefault();
        next.focus();
        const value = next.dataset.fluxTabValue;
        if (activateOnFocus && value !== undefined) context.setValue(value);
      }}
    />
  );
}
export const TabsOverflowList = TabsList;
```
