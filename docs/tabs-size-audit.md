# Tabs size audit

Current decision and validation: [semantic Tabs cleanup report](./component-ticket-validation.md). Automatic overflow was removed after this investigation.

Follow-up: [whole-component continuation evidence](./tabs-size-continuation.md). The measurements below remain the starting baseline for that investigation.

## Status

The ticket remains incomplete. The retained implementation preserves the current API and automatic overflow and improves all three size metrics, but fails both existing gates. This audit establishes a floor for the **current rendering/styling architecture**, not a proof that no behavior-equivalent redesign can ever meet the gates. No baseline, budget, accounting rule, dependency, or public export was changed.

## Measurements

Production React package build, measured by the existing `measureBundledEntry` implementation (esbuild, minified ES2022 ESM, all entry exports retained, React peers external, JavaScript and CSS compressed separately and summed).

| State                       |    Raw |  Gzip | Brotli |
| --------------------------- | -----: | ----: | -----: |
| Starting repository         | 16,749 | 6,144 |  5,478 |
| Retained specialization     | 16,268 | 5,916 |  5,282 |
| Reduction                   |    481 |   228 |    196 |
| Absolute limit              | 14,336 | 4,096 |  3,072 |
| Absolute overage            |  1,932 | 1,820 |  2,210 |
| Historical regression limit |  6,582 | 2,801 |  2,442 |
| Historical overage          |  9,686 | 3,115 |  2,840 |

The accepted historical measurements are 6,452 / 2,746 / 2,394; the regression limits above include the existing tolerance. The historical source has ordinary scrolling tabs and no automatic overflow menu.

Final JavaScript: **11,937 / 4,609 / 4,161**. Final CSS: **4,331 / 1,307 / 1,121**. CSS source was unchanged; changed bundle ordering accounts for small compression differences versus the initial CSS measurement of 4,331 / 1,311 / 1,119.

## Retained code evidence

A temporary esbuild metafile against the production output found only Tabs, positioning, roving focus, ref composition, class-name composition, and the three expected stylesheets. There is no unexpected library, dependency graph, duplicate overflow implementation, or accidentally retained component catalog.

Source-map-attributed minified JavaScript segments, including generated boundaries associated with those mappings:

| Source              | Raw segment bytes | Independently compressed gzip | Independently compressed Brotli |
| ------------------- | ----------------: | ----------------------------: | ------------------------------: |
| TabsListController  |             7,241 |                         2,800 |                           2,513 |
| TabsList            |             1,764 |                           854 |                             757 |
| Tabs root/tab/panel |             1,227 |                           664 |                             565 |
| Roving focus        |               753 |                           450 |                             386 |
| fitTabs             |               343 |                           245 |                             208 |
| positionTabsMenu    |               275 |                           182 |                             171 |
| attachRef           |               142 |                           115 |                              87 |
| TabsContext         |               139 |                           141 |                             105 |
| joinClassNames      |                52 |                            72 |                              56 |

These gzip/Brotli columns are **diagnostic, non-additive fragment measurements**, not marginal savings: compression shares a dictionary across the actual bundle. Metafile attribution and source-map attribution can assign generated boundaries differently. The authoritative sizes are the complete outputs above.

The controller's largest attributed sections are:

- Measurement, overflow reconciliation, selection and focus recovery: 2,055 raw bytes.
- Setup, collection queries, observers, subscriptions and cleanup: 1,683.
- Menu keyboard handling and typeahead: 692.
- List keyboard handling: 467.
- Menu opening: 402; menu selection: 339; positioning integration: 331; dismissal: 304.
- Accessible label resolution: 212; open-menu reconciliation: 173.

The CSS metafile attributes 3,087 bytes to Tabs styles, 667 to the floating surface and 576 to menu-item styles, plus one output separator byte.

## Architectural audit

Geometry already lives in a list-owned closure. React state contains only the rendered overflow choices. Measurements, animation-frame scheduling, selection fallback index, observed nodes, menu-open bookkeeping and typeahead do not cause independent React state updates.

The controller already has one ResizeObserver, one MutationObserver and one scheduled measurement path. Per-tab resize observation detects width changes even when the list width is unchanged. Event-time queries preserve current membership, hidden/inert/disabled semantics and nested-list isolation. Previously rejected membership/geometry caches and subscription rebuilds were not retried.

CSS already owns clipping, the outer grid, wrapped/vertical layout, hidden overflow tabs and oversized priority-tab clipping. The required ordered subset with an active/focused priority tab and corresponding accessible menu still needs membership measurement and selection logic. Replacing that with scrolling alone changes the requested UX. Removing fallback dismissal/positioning would break the tested non-native-popover path. No browser support policy was changed.

The generic positioning utility retained four-side placement, arbitrary alignment and offset handling that Tabs never requests. A local `positionTabsMenu` implements just the existing end-aligned, vertically flipping placement, including RTL, viewport clamping and available menu height. It does not move uncounted code elsewhere: it remains included in the Tabs consumer bundle.

## Experiments

Each implementation experiment ran all focused Tabs unit tests successfully and rebuilt production output before measurement.

| Experiment                                      |    Raw |  Gzip | Brotli | Decision                                                                                                          |
| ----------------------------------------------- | -----: | ----: | -----: | ----------------------------------------------------------------------------------------------------------------- |
| Specialized menu positioning                    | 16,268 | 5,916 |  5,282 | Keep: -481 / -228 / -196 from start                                                                               |
| Reuse shared roving helper for menu keys        | 16,245 | 5,917 |  5,275 | Revert: -23 / +1 / -7 versus retained implementation; negligible mixed result with extra edge-index adaptation    |
| Delegate trigger/menu click and keydown to host | 16,373 | 5,936 |  5,302 | Revert: +105 / +20 / +20 versus retained implementation; target-routing checks outweighed two fewer subscriptions |

The keyboard experiment was the lowest raw/Brotli candidate measured, but it was not a meaningful improvement across the established metrics. The retained implementation is the smallest measured candidate improving all three metrics together.

A separate **nonfunctional diagnostic ablation**, built entirely into a temporary directory, replaced the controller with a null connection. This was never shipped or used to claim a gate pass. It measured **7,943 / 2,957 / 2,596**, still exceeding the historical limits by **1,361 / 156 / 154**, despite having no overflow or list keyboard controller at all. The production source was not altered for this ablation.

This demonstrates that optimizing or even deleting the entire controller cannot reach the historical gates while leaving the current render/styling shell intact. Restoring required behavior necessarily adds code to that shell. It does **not** establish a universal minimum for a rewritten shell, so completion criterion B is not claimed.

## Changes in this pass

- `packages/react/src/components/Tabs/TabsListController.ts`: call the specialized positioning function with the existing RTL decision.
- `packages/react/src/components/Tabs/positionTabsMenu.ts`: internal positioning implementation.
- `packages/react/src/components/Tabs/positionTabsMenu.test.ts`: compare against the established positioning implementation over 3,456 combinations of viewport dimensions, anchor locations, popup dimensions and direction.
- `docs/tabs-size-audit.md`: this report.

Existing user changes were preserved. No commits or branch changes were made. Temporary bundle instrumentation was kept outside production source.

## Validation

Passed:

- Focused Tabs unit tests: 35 tests across four files, including the new 3,456-case positioning equivalence test. Existing coverage includes controlled ownership/cancelled clicks, keyboard behavior, dynamic membership/labels, selected-tab reveal, explicit wrapped/vertical layouts, hydration, StrictMode refs and cleanup.
- Four built-public-package Chromium tests: overflow selection/keyboard/resize; accessible menu and normal focus exit; container-only resize; selection/dismissal without native popovers.
- One Chromium docs test: ordinary Tabs preview automatic overflow and accessibility.
- React production build, including declaration emission.
- React package typecheck.
- ESLint and Prettier across the Tabs directory.
- Working-tree whitespace check.

Failed:

- Existing changed-component size check: Tabs fails both gates with the exact overages above. Other pre-existing component changes were also evaluated by this command; no unrelated failures were repaired.
- Focused Coding Bible: one JS-005 finding at `TabsOverflowList.test.tsx:415`, in the existing hydration test's `try/finally` cleanup. Required cleanup was preserved; analyzer configuration was not changed.

The sandbox initially blocked local preview ports with EPERM. The same browser checks passed with local-server execution allowed.

Not run: full repository verification, cross-browser suites, full repository accessibility coverage, or performance benchmarks. The retained change substitutes equivalent positioning arithmetic; it does not materially change observation, traversal, render scheduling or layout work. Full verification was not run because focused size and Coding Bible gates remain red; release readiness is not claimed.

## Remaining work and limits

The unexplored path is a coordinated redesign of the render/styling shell and overflow controller, with the same semantics and compatibility API. A controller-only rewrite cannot meet the historical limits under the measured shell. Any future experiment must measure the complete JS+CSS entry and retain cancellation, fallback popovers, typeahead, focus recovery, hydration/ref cleanup, dynamic membership and explicit layouts.

The measurements do not establish that such a redesign is impossible, or that it will succeed. There is no justified basis here to accept a larger baseline or declare the ticket complete. This pass provides a verified local reduction and a concrete architectural constraint, not fulfillment of completion criterion A or B.
