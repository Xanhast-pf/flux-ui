# Overflow capability implementation and verification

## Status

The implementation keeps optional behavior out of plain Tabs. The remaining
release approvals are Overflow's **first bundled baseline** and the affected
**aggregate baselines**; no existing baseline has been edited. The normal size gate intentionally rejects an entry without an
accepted baseline. This report does not claim that the complete repository gate
is green.

## Public API and presentation

```tsx
<Overflow>
  <Tabs.Root defaultValue="overview">
    <Tabs.List aria-label="Project sections">
      <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
      <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
      <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="overview">Overview panel</Tabs.Content>
    <Tabs.Content value="activity">Activity panel</Tabs.Content>
    <Tabs.Content value="settings">Settings panel</Tabs.Content>
  </Tabs.Root>
</Overflow>
```

Overflow accepts native div props, including `ref`, `className`, `style`, and data
attributes. There are no strategy, orientation, type, priority, minimum-count, or
public adapter props. Consumer container sizing determines available space.

The overflow control is Flux's existing **native Select**, named “More items.”
The browser owns its picker, keyboard option navigation, typeahead, disabled
options, cancellation and focus. This intentionally uses native platform
presentation, rather than promising a custom menu's appearance or keyboard
model. Standard platform picker-opening gestures vary by browser and OS.

A measured early DropdownMenu composition retained 16,333 raw / 6,115 gzip /
5,424 Brotli bytes. That included Popover, Button, dismissal and positioning.
The native picker removes that graph without copying those components or adding
a new overlay framework. Native scrolling alone was insufficient because this
task requires an overflow presentation. Child-type inspection and resurrecting
the old Tabs controller were rejected.

## Internal capability contract

`internal/overflowCapability.ts` contains a nullable React context and types only.
Its value is a pure render callback, supplied by Overflow. A collection calls it
with its native root element and a scoped `items(root)` query. The optional
internal `selected` selector defaults to `[aria-selected=true]`; the internal
label defaults to “More items.” Adapters can override those defaults.

The returned enhancement component owns its DOM ref. It renders the original
collection as its first child and the picker as its sibling. DOM access happens
in effects, never during the render callback. Neither a ref nor a component
factory is invoked through an unknown render-time callback. The implementation
uses no `child.type`, display-name matching, cloning, global registration, or
public adapter API.

Tabs passes its existing scoped DOM query, which excludes nested tablists.
Root continues to own controlled/uncontrolled selection. List continues to own
keyboard behavior, orientation, roving tabindex, membership reconciliation and
focus recovery. Trigger/Tab and Content/Panel remain direct aliases.
Activation from the picker calls the original native item's `click()`, preserving
consumer cancellation, disabled behavior and controlled ownership.

A test-only button collection uses the same callback with `aria-current` and its
own label. Core Overflow imports no Tabs code. This is an architectural proof,
not a shipped Toolbar or Breadcrumbs adapter.

## Runtime, layout and accessibility

Each enhancement uses one ResizeObserver observing its container, collection,
picker, and candidate items. A single MutationObserver detects membership,
labels, identity and semantic attribute changes. Tabs retains its existing
membership MutationObserver. Thus an enhanced Tabs collection has **one resize
observer and two mutation observers**, without per-item observer instances.
Observer notifications coalesce into one animation-frame measurement per
collection. There is no polling or global listener. Transient geometry and owned
DOM attributes stay in an effect closure; only picker choices enter React state.
Identical choices preserve the existing state object.

The fitting pass prioritizes the selected item, then retains items in source
order while space remains. Overflowed items remain in their original DOM with
`inert`, absolute positioning and hidden visibility. Their intrinsic width stays
measurable. The picker contains text options, not duplicate tabs or tabpanels.
The selected original tab remains visible and is the panel's label. The picker
is outside the tablist; the browser axe test verified this ownership model.
Oversized selected tabs retain native scrolling rather than becoming unreachable.
Explicit wrapped lists retain wrapping. Vertical lists need a constrained block
size; they retain vertical keyboard behavior.

Selection temporarily reveals the activated original item before clicking it,
so Tabs can reconcile the new selection. Subsequent measurement restores the
correct partition even if the consumer cancels or rejects selection. A resize
that hides the focused tab moves focus to the picker. When the picker disappears
while focused, focus returns to the selected tab. Ordinary Tab navigation exits
the picker normally.

Consumer-hidden/inert items are excluded from the picker. Overflow cleans up
only its own enhancement attributes, subscriptions and scheduled frame on
unmount. StrictMode and real browser teardown tests cover cleanup.

## Unsupported, multiple and nested children

Unsupported content renders unchanged inside the native Overflow wrapper and
creates no observers. Fragments, application wrappers and conditional children
work through context. One collection is supported per Overflow. A second
collection throws a specific error asking for separate wrappers. Nested Overflow
providers own independent collections.

## SSR and hydration

Server and initial client markup both contain the enhancement slot and an inert,
unexposed native picker. Original tabs remain usable with native scrolling before
measurement. There is no server DOM access and no post-mount DOM reparenting.
The hydration test verifies that the exact server tablist node is retained and
that no recoverable hydration error is reported. Without ResizeObserver, the
original scrolling collection remains available.

## Production size and CSS attribution

Measurements use the pinned esbuild 0.28.2 production entry method: minified
ES2022 ESM, all exports retained, React peers external, JavaScript and CSS
compressed independently and summed. The before value was measured from the
clean starting working tree, not copied from a historical report.

| Entry                       |    Raw |  Gzip | Brotli |
| --------------------------- | -----: | ----: | -----: |
| Tabs before Overflow work   |  6,505 | 2,744 |  2,392 |
| Tabs after, imported alone  |  6,482 | 2,773 |  2,421 |
| Overflow alone              |  5,083 | 2,338 |  2,028 |
| Tabs + Overflow composition | 11,497 | 4,493 |  3,981 |

Plain Tabs changes by **−23 raw / +29 gzip / +29 Brotli bytes** and passes its
unchanged absolute and historical regression gates. Its only new retained
module is the **52-byte context declaration**. It retains no measurement,
Overflow CSS, Select, Menu, Popover, Button, IconButton, or positioning code.

Tabs CSS is unchanged: **2,160 raw / 780 gzip / 640 Brotli bytes** before and
after. Overflow's standalone CSS output is **1,112 / 496 / 401**. Metafile
attribution assigns 488 raw bytes to Overflow CSS and 623 to Select CSS, plus
the output separator. The composed CSS output is 3,271 / 1,059 / 884. Compression
of fragments is non-additive.

Largest retained standalone JavaScript contributions:

| Entry    | Module             | Raw attributed bytes |
| -------- | ------------------ | -------------------: |
| Tabs     | Tabs chunk         |                3,548 |
| Tabs     | Roving focus       |                  510 |
| Tabs     | attachRef          |                  141 |
| Overflow | Overflow chunk     |                3,689 |
| Overflow | Select             |                  154 |
| Each     | Capability context |                   52 |
| Each     | joinClassNames     |                   52 |

[Exact measurement and retained-module evidence](./overflow-size-report.json).
Only Select is retained as a higher-level Flux dependency of Overflow. ReactDOM
portals, overlay components, positioning and external engines are absent.

The new `overflow` size category caps the complete entry at **5,632 raw / 2,688
gzip / 2,304 Brotli bytes**, about 11–15% above the optimized measurement. This
is a new component budget, not an increase to an existing budget. The scaffold
and component doctor now read the authoritative size-class list instead of
maintaining duplicate hardcoded lists. An accepted historical baseline would
apply the existing tighter 2% regression policy as well.

## Performance evidence

The workload renders 100 independent five-tab collections. Updating changes
selection and available width. Three Chromium samples measured:

| Metric                              | Sample 1 | Sample 2 | Sample 3 |
| ----------------------------------- | -------: | -------: | -------: |
| Synchronous mount, ms               |     92.0 |     59.0 |     59.8 |
| Synchronous update, ms              |     12.2 |      9.8 |      6.2 |
| Synchronous unmount, ms             |      7.4 |      6.5 |      3.8 |
| Measurement-frame median, ms        |      0.4 |      0.4 |      0.2 |
| Measurement-frame p95, ms           |      0.5 |      0.5 |      0.3 |
| Maximum measured frame callback, ms |     11.4 |     20.2 |      5.5 |

Each sample created 100 ResizeObservers and left **zero active** after unmount.
The 1,800 DOM nodes are for the complete 100-collection workload, including Tabs
and panels. Frame instrumentation measures callbacks that read observed element
geometry; it does not include every later React commit. The maxima are retained,
not discarded. This is an absolute workload with noisy browser timings, not a
native-equivalence ratio, latency guarantee, or accepted performance baseline.

[Raw workload and observer evidence](./overflow-performance-report.json).

## Changed areas and validation

- New Overflow component, types, static CSS, measurement hook, 17 behavior tests,
  story, SSR benchmark and metadata; generated exports/catalog/health entries.
- Tiny internal capability context and Tabs List query/render-slot integration;
  existing keyboard scan-count and scoping assertions remain unchanged.
- Docs preview/API notes, built-public-package fixture/test, Chromium docs axe
  test, performance workload manifest/fixture and observer instrumentation test.
- Size category, scaffold/doctor size-class discovery, and exact geometry-only
  dogfood allowances for the width-changing docs and benchmark containers.
- This audit and measurement artifacts. No dependencies, lockfile, public Tabs
  API, Tabs CSS, or existing size/performance baseline changed.

Passed: 36 focused Overflow/Tabs tests, including SSR/hydration; React package
suite (397 tests); repository typecheck and lint; production React and docs
builds; Coding Bible; dogfood ownership; 30 size-tool tests; docs Chromium
selection/resize/axe; built-package consumer selection/resize/membership; and
Chromium workload/observer cleanup.

The restricted environment initially discarded captured subprocess output;
size-tool tests passed with normal subprocess execution. Browser tests also
required permission to start localhost preview servers. No test, assertion,
analyzer rule or gate was weakened.

Final gate status:

- All 70 existing component bundled gates pass; Overflow passes its new absolute
  budget and fails only because no initial historical baseline has been accepted.
- `check:full` was executed once. Its nested `check` passed generation, docs,
  dogfood, formatting, package builds, lint, types, Knip, package/size/icon/docs/
  trust tests, then stopped at a source-contract check requiring the original
  quoting of a Tabs selector. The original syntax was restored without changing
  the assertion. All 37 dogfood, 3 safety and 31 feature contract tests then passed.
- Full size checking was run separately after that fix and reported only the
  missing Overflow baseline. Coding Bible and focused browser checks passed.
- The entire full gate was not repeated after a targeted fix. Its later Storybook,
  full browser matrix, generic performance smoke and full consumer stages were
  not executed; the affected docs, performance and public-package consumer tests
  were executed independently and passed.
- Formatting and final diff checks passed. No commit, push or baseline acceptance
  was performed.

## Limits and next steps

Only Tabs is a production integration. Future adapters could supply scoped
items and alternate selection semantics for Toolbar, Breadcrumbs or Pagination,
but none are claimed or shipped. Menu presentation is intentionally native.
Browser validation is Chromium, not a cross-browser or physical screen-reader
certification. Localized picker labels currently require an internal adapter
change; there is no speculative public label prop. The performance sample is
small and includes outliers.

Overflow's initial bundled baseline still requires explicit acceptance under
root AGENTS.md. Existing Tabs and unrelated component baselines remain untouched.

Adding the Overflow baseline entry also makes the baseline/live component counts
equal, re-enabling historical aggregate checks. A read-only preview shows these
additional changes; they have **not** been accepted:

| Aggregate         |    Before raw / gzip / Brotli |   Current raw / gzip / Brotli |
| ----------------- | ----------------------------: | ----------------------------: |
| Root entry        |         5,275 / 1,734 / 1,520 |         5,394 / 1,775 / 1,560 |
| Runtime union     |     199,901 / 92,508 / 79,379 |     209,067 / 96,000 / 82,350 |
| Published package | 1,099,160 / 374,699 / 322,302 | 1,137,485 / 389,791 / 334,996 |

Each would exceed its current historical tolerance after registration. Published
package accounting includes declarations and maps, unlike the consumer-entry
measurements. These are whole-package comparisons against accepted baselines,
not isolated marginal Overflow costs. The bundled-entry attribution above is
the evidence for optional dependency separation. Aggregate acceptance is a
separate approval boundary, not covered by approval of the Overflow-only entry.
See the exact [baseline review proposal](./overflow-baseline-proposal.json).
