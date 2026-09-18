# Component ticket validation after Tabs overflow removal

> **Historical validation record.** The findings and size measurements below describe an earlier 70-component snapshot. The deprecated `Fader` compatibility wrapper was subsequently removed before 1.0; current code uses `Slider orientation="vertical"`.

## Verdict

**NOT READY.** Tabs now passes its existing size gates and semantic tests. Release
is blocked by the DataTable, Slider, Fader and Knob bundled regression gates,
two mobile-navigation focus assertions, and the previously identified Coding
Bible JS-005 cleanup applicability defect. No budget, baseline, assertion, analyzer
rule, dependency or lockfile was weakened or updated.

This report supersedes the shipping-status statements in the two historical Tabs
investigations. Their measurements and experiments remain useful evidence.

## 1. Tabs overflow removed

Removed the experimental list controller, overflow rendering/compatibility part,
fitting and positioning helpers, overflow stylesheet, and their dedicated unit
and source-contract tests. Removed the overflow story and documentation claims.
The wide-list docs and built-consumer fixtures now exercise ordinary scrolling,
keyboard selection and controlled state; there is no More menu.

The obsolete shared menu-item stylesheet was removed and its styles returned to
DropdownMenu. DropdownMenu now has no diff from HEAD.

## 2. Semantic architecture retained

Root owns controlled/uncontrolled selection and stable IDs. List owns scoped DOM
membership, roving focus, dynamic selection/focus recovery and keyboard events.
The list has a single membership MutationObserver; it has no resize observer,
geometry, partitioning, popup state or positioning. Consumer refs are stable
across selection changes and retain React cleanup semantics. Layout effects
reconcile after React updates without putting collection bookkeeping in render.

ARIA associations, manual/automatic activation, Home/End, orientation, RTL,
looping, unavailable items, nested-list isolation, cancellation, native scrolling,
wrapping, themes, hydration and lost-focus recovery are retained and tested.

The repository's established names are Tab and Panel. They remain supported;
Trigger and Content were added as direct aliases to satisfy the requested names.
No extra implementation or public type family was created. Optional callback and
list/orientation options accept forwarded undefined values. Root still requires
an explicit controlled or initial selection, preserving the established contract.

## 3. Tabs files and test classification

- `packages/react/src/components/Tabs/Tabs.tsx`: semantic compound export.
- `TabsList.tsx`: semantic list replacing the overflow shell/controller.
- `TabsContext.ts`: retained small, private component context.
- `Tabs.types.ts`: overflow type removed; optional forwarding improved.
- `TabsList.test.tsx`: semantic tests retained from the experimental suite plus
  direct controlled/cancelled selection through Trigger/Content.
- `Tabs.css.ts`, `Tabs.test.tsx`, `Tabs.stories.tsx` and `index.ts`: historical
  styling, original semantic tests, non-overflow stories and exports retained.
- Docs example/metadata, consumer fixture/tests, docs browser tests, feature and
  dogfood contracts, changesets and this report updated to match the shipped API.

Deleted experimental files: `TabsListController.ts`, `TabsOverflowList.tsx`,
`TabsOverflowList.css.ts`, `TabsOverflowList.test.tsx`, `fitTabs.ts`,
`fitTabs.test.ts`, `positionTabsMenu.ts`, `positionTabsMenu.test.ts`.

The removed tests asserted fitting, popup interaction, labels, resizing,
positioning and the experimental compatibility part. Hydration/ID stability,
StrictMode cleanup refs, consumer handlers, unavailable controlled selection and
fresh event-time membership remain covered. The original 14 semantic tests were
not deleted. Final Tabs total: 19 passing tests.

## 4–5. Production measurements

The existing production build and `tooling/size/check.mjs --json` measured all
70 entries. Figures include separately compressed JavaScript and CSS, with the
existing React peer exclusions and all entry exports retained.

| Tabs measurement | Before cleanup | After cleanup | Reduction |
| ---------------- | -------------: | ------------: | --------: |
| Raw              |         16,268 |         6,505 |     9,763 |
| Gzip             |          5,916 |         2,744 |     3,172 |
| Brotli           |          5,282 |         2,392 |     2,890 |
| CSS raw          |          4,331 |         2,160 |     2,171 |
| CSS gzip         |          1,307 |           780 |       527 |
| CSS Brotli       |          1,121 |           640 |       481 |

Final JS: **4,345 / 1,964 / 1,752**. Final CSS exactly matches the historical
core CSS measurement. No styles were moved outside the measured entry.

| Reference                             |   Raw |  Gzip | Brotli | Final minus reference |
| ------------------------------------- | ----: | ----: | -----: | --------------------- |
| Historical                            | 6,452 | 2,746 |  2,394 | +53 / -2 / -2         |
| Minimal semantic prototype            | 5,719 | 2,468 |  2,146 | +786 / +276 / +246    |
| Prototype with dynamic focus recovery | 6,523 | 2,748 |  2,403 | -18 / -4 / -11        |

The difference from the minimal prototype retains mutation-driven membership and
focus recovery. The final implementation is effectively the same size as the
recovery prototype and historical implementation, while retaining stable refs
and adding the requested part aliases. These are whole-entry comparisons, not
independently additive estimates of each feature's compression cost.

## 6. Transitive composition audit

Tabs imports only its own context/styles, React, attachRef, joinClassNames and
rovingFocus. There are no remaining Popover, Menu, DropdownMenu, Button, icon,
floating-surface or menu-item-style imports. The starting candidate had already
removed high-level popup runtime imports; this cleanup removes the remaining
local overflow controller and shared popup CSS rather than claiming a package
uninstall. No manifest dependencies changed.

Other compositions inspected:

- DataTable → Checkbox + ScrollArea. Checkbox supplies the required public
  selection control and styling. ScrollArea predates this ticket. The entire
  DataTable graph is measured; its new CSS contribution is 728 raw bytes larger.
- Fader → Slider. This is the established compatibility wrapper. Nearly all new
  Fader weight is inherited from Slider; duplicating a smaller legacy control
  would create divergent behavior.
- InputGroup → Input. A small existing native-input adapter; its bundle gate passes.
- Drawer → NativeModal (internal). Existing modal semantics are shared; the new
  scroll-lock CSS adds 42 raw bytes. Optional type widening adds no runtime.
- Sidebar → Button; CodeBlock → Button + ScrollArea; Combobox → Input and the
  existing floating helper. These compositions predate the ticket. Their
  production measurements are unchanged and their gates pass. No new shared
  architecture was introduced merely to split accounting.

## 7–9. Other components, retained changes and size gates

All listed unit suites pass. All listed docs previews passed Chromium axe checks
in light and dark themes. These automated checks are not manual screen-reader
or touch-assistive-technology certification.

| Component    | Ticket changes / API                                                  | Unit tests | Raw / gzip / Brotli    | Size status / remaining issue                  |
| ------------ | --------------------------------------------------------------------- | ---------: | ---------------------- | ---------------------------------------------- |
| Tabs         | Semantic list; Trigger/Content aliases; optional forwarding           |         19 | 6,505 / 2,744 / 2,392  | Pass                                           |
| Slider       | Native vertical mode, custom static skin, resetValue, CSS variables   |         13 | 3,324 / 1,159 / 975    | Regression failure                             |
| Fader        | Deprecated vertical Slider adapter; imports retained                  |          1 | 3,580 / 1,260 / 1,056  | Regression failure inherited from Slider       |
| Knob         | Sizes, diameter override, resetValue, no-op pointer commit prevention |         27 | 5,399 / 2,349 / 2,082  | Regression failure                             |
| DataTable    | Public Checkbox selection; leaner identity lookup and stable sorting  |         13 | 9,577 / 4,013 / 3,548  | Regression failure                             |
| InputGroup   | Direct NumberField/Field composition; grouped invalid styling         |          2 | 2,492 / 894 / 763      | Pass                                           |
| Drawer       | Static document scroll lock; optional undefined forwarding            |          2 | 6,493 / 2,518 / 2,211  | Size/axe pass; mobile focus assertion mismatch |
| Sidebar      | Persistent desktop navigation and separate mobile Drawer examples     |          4 | 5,922 / 2,277 / 1,965  | Size/axe pass; same mobile assertion mismatch  |
| CodeBlock    | Exhaustive typed language examples and copy checks                    |         12 | 10,891 / 4,427 / 3,826 | Pass; production component unchanged           |
| Toggle       | Content-sized example layout                                          |          6 | 2,002 / 910 / 752      | Pass; production component unchanged           |
| Combobox     | Clarified predefined-option autocomplete documentation                |          5 | 8,431 / 3,432 / 3,046  | Pass; production component unchanged           |
| Input        | Clarified native field documentation                                  |          3 | 1,447 / 633 / 540      | Pass; production component unchanged           |
| NumberField  | Documented grouped numeric composition                                |          2 | 1,654 / 764 / 639      | Pass; production component unchanged           |
| DropdownMenu | Removed overflow-driven shared-style extraction                       |          2 | 12,372 / 4,645 / 4,104 | Pass; restored to HEAD                         |

This pass additionally fixed Knob's captured reset default: retain the original
value and clamp/snap against the current range on reset. A default of 150 initially
clamped by max=100 now resets to 150 after max becomes 200, as documented. This
fix removes 24 raw bytes compared with the starting Knob candidate. A regression
test covers it.

Drawer's side and its inherited NativeModal optional configuration now accept
undefined directly. This type-only change also improves the existing Dialog
aliases; all 11 Dialog tests pass and its runtime is unchanged. A Drawer test
compiles and renders forwarded undefined options without casts or spreads.

The earlier DataTable optimizations are retained: no redundant full-row index
map, no per-row source-index property, stable native sorting of equal values,
and focused identity preserved through scrolling/sorting. The new selection
control still makes the component exceed its historical gate.

### Unresolved size evidence

All 70 entries pass absolute class budgets; 66 pass regression gates. The four
failures remain explicit:

| Component | Final raw/gzip/Brotli | Allowed regression ceiling raw/gzip/Brotli |
| --------- | --------------------- | ------------------------------------------ |
| Slider    | 3,324 / 1,159 / 975   | 708 / 504 / 387                            |
| Fader     | 3,580 / 1,260 / 1,056 | 1,028 / 646 / 496                          |
| Knob      | 5,399 / 2,349 / 2,082 | 4,907 / 2,222 / 1,956                      |
| DataTable | 9,577 / 4,013 / 3,548 | 8,677 / 3,767 / 3,331                      |

Slider's custom/orientation/forced-color stylesheet is 2,161 raw bytes, versus
300 historically. Its JavaScript is 1,163 versus 344. The required new skin's CSS
alone exceeds the old entire-component raw ceiling. Removing it or the reset
feature would change the retained ticket scope. Fader inherits that cost.
Knob has no high-level public component dependency; its growth is local reset
behavior and size styling. DataTable's growth is the new Checkbox graph after
retaining the existing model optimizations. These are not unexplained catalog
imports or accounting defects. This report does not prove a universal size floor;
further redesign requires a concrete approach that preserves the feature contracts.

No features were silently removed to meet old baselines. Acceptance of growth or
deferral/redesign of these features remains a product decision under AGENTS.md.

## 10. Accessibility and mobile focus finding

The affected previews and open overlays pass 29 Chromium axe tests. Keyboard,
forms, controlled ownership, disabled state, RTL and built public styles pass
consumer tests. Drawer side geometry/reduced motion and desktop Sidebar behavior
pass the relevant layout checks.

Two tests at `apps/docs/tests/component-refinements.spec.ts:131` fail at the
Shift+Tab containment assertion (line 169), at 320px and 390px. A minimal plain
HTML dialog opened with showModal reproduces the same sequence:

1. Close button focused; document.hasFocus() is true; dialog matches :modal.
2. Shift+Tab: document.activeElement is body, document.hasFocus() is false, dialog
   still matches :modal. Focus moved to browser chrome, not a background control.
3. Shift+Tab again: focus returns to the last link inside the modal.

This is evidence that the unconditional assertion is stronger than native dialog
behavior. It is not evidence of background-page focus leakage. The assertions
remain unchanged. A product decision is needed between accepting native browser
chrome traversal with an appropriately reviewed background-inertness contract,
or intentionally adding focus wrapping. No focus trap was added to shared modal
infrastructure just to make these tests green. Assertions after the failing point
in those two tests have not executed; separate smoke tests cover navigation close
and routing, but do not replace the unexecuted assertions.

## 11. Executed checks

Passed:

- Complete React package suite: **370 tests, 78 files**, including all affected
  component tests, SSR tests and shared NativeModal tests.
- Complete built-package Chromium consumer suite: **24 tests**; no docs aliases.
- Docs component refinements, layout regressions and brand polish: **37 passed**,
  with the **2 failures** described above.
- Affected light/dark accessibility previews and open overlays: **29 passed**.
- Modified docs smoke suite: **6 passed**.
- Affected runtime fixture checks: **4 passed**.
- All-workspace TypeScript check; full repository ESLint and formatting checks.
- React production build including declarations; docs production build.
- Generated-file drift check; docs coverage (70 families and six scenes);
  dogfood ownership check; feature/dogfood test files; working-tree whitespace.

Failed:

- Full 70-component size checker: four regression failures above.
- Coding Bible: one JS-005 finding at `TabsList.test.tsx:108` on hydration's
  try/finally cleanup. Required unmount/host cleanup remains correct and intact.
  This is the already established analyzer/Canary follow-up; no rule was disabled.
- The two mobile focus assertions above.

Environment: initial browser runs could not start because the sandbox denied
localhost listeners (EPERM). Browser checks subsequently ran with local-server
access; that environment restriction is no longer a validation blocker.

Not run: `verify:all` / `check:full` (targeted gates remain red), full repository
unit/browser matrix, Firefox/WebKit, packed release consumer, Storybook production
build, manual screen-reader/touch testing, or baseline regeneration. The docs
build emits its existing large-chunk advisory for the lazy axe asset; it succeeds.

## 12. Benchmarks

Existing Tabs SSR benchmark, 1,000 instances: **38.3199 ms mean**, **26.0961 ops/s**,
14 samples, ±5.71% reported relative margin of error. No before-run latency was
collected, so this is not a measured speedup claim or an accepted new baseline.

Existing Chromium runtime fixture checks for Slider, Knob and DataTable passed;
the DataTable lab correctly reports a Flux-only workload. These fixtures validate
finite bounded work, not a native-relative regression threshold. The standard
native-relative performance gate covers Button/Grid, not these affected families;
there is no existing Tabs client-performance baseline. No drag-latency or full
native-relative performance certification is claimed.

## 13. Repository hygiene

No automatic overflow production code, integration imports, runtime hooks,
placeholder exports, menu CSS or fitting/positioning helpers remain. Temporary
logs/probes stayed in `/tmp`; no diagnostic build instrumentation was added to
production. Existing investigation documents are retained with a current-status
link. Generated registries, size/performance baselines, dependencies, lockfile,
CI policy and user-owned AGENTS.md edits were preserved. No commits, pushes,
branches, releases or publishing actions were performed.

The working tree intentionally contains the full uncommitted ticket and its
retained additions; “clean” does not mean discarding these user changes.

## 14. Follow-up work

1. Resolve the four historical size regressions through an approved feature
   scope/architecture decision. Do not auto-accept a baseline increase.
2. Resolve the native-dialog/browser-chrome focus contract before changing the
   two mobile assertions or shared modal implementation.
3. Fix JS-005 cleanup applicability in Coding Bible through Canary first, then
   update Flux through the separate authorized analyzer follow-up.
4. Rerun the remaining failed checks and full release verification after those
   blockers are resolved.

**Future PR: design and implement reusable `<Overflow />` capability.** Use the
retained Tabs evidence to investigate generic membership, priority, measurement,
focus, accessible naming, keyboard behavior, SSR and ownership across multiple
consumers. No API, adapter, dependency or placeholder is implemented here.
