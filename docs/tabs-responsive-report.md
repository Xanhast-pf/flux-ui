# Responsive Tabs implementation and validation report

> **Historical report.** This records a prior snapshot, not current behavior or release readiness. Consult current engineering documentation and executed checks.

Implementation is complete; retained size and performance baselines are not accepted. The final approval boundary concerns component size proposals and the aggregate snapshot. Packed-consumer verification also remains blocked by the existing release-version prerequisites.

The starting tree contained staged contributor work. Changes below are relative to that starting index, preserving unrelated work. Historical Overflow investigations and reports remain unchanged.

## Public API and migration

`Tabs.Root`, `Tabs.List`, `Tabs.Tab`, `Tabs.Panel`, and the existing `Trigger`/`Content` aliases remain. No overflow props, public hook, or replacement wrapper were added. Root still supports controlled/uncontrolled selection, orientation, size and appearance; List retains wrap, activateOnFocus, loopFocus and native div props; Tab and Panel retain value and native props. Panel retains its padding option.

Public `Overflow` and `OverflowProps` are removed. Canonical generation removed their root export, catalog and health entries. Component count is **71 → 70**.

Before:

```tsx
<Overflow>
  <Tabs.Root defaultValue="overview">
    <Tabs.List aria-label="Project sections">
      <Tabs.Tab value="overview">Overview</Tabs.Tab>
      <Tabs.Tab value="activity">Activity</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
    <Tabs.Panel value="activity">Activity panel</Tabs.Panel>
  </Tabs.Root>
</Overflow>
```

After:

```tsx
<Tabs.Root defaultValue="overview">
  <Tabs.List aria-label="Project sections">
    <Tabs.Tab value="overview">Overview</Tabs.Tab>
    <Tabs.Tab value="activity">Activity</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
  <Tabs.Panel value="activity">Activity panel</Tabs.Panel>
</Tabs.Root>
```

Remove the Overflow import too. There is no migration wrapper.

## Implementation decisions

- `Tabs.List` owns the private `useTabOverflow` controller. Horizontal non-wrapping lists get one private grid wrapper; the actual tablist retains native props, ref, className, styles and keyboard handlers.
- The ghost ellipsis button is a sibling of the tablist. It is a real DropdownMenu trigger, named “More tabs,” with the current Tabs size. It is outside `role="tablist"` because it is a menu button rather than a tab.
- DropdownMenu owns menu semantics, arrow navigation, Home/End, typeahead, Escape, outside dismissal and focus restoration. Tabs adds no competing menu keyboard manager.
- One ResizeObserver per enhanced list observes its container, trigger and tab items. A MutationObserver handles membership, labels, selected state and availability. One pending requestAnimationFrame batches actual events; there is no polling or self-rescheduling frame loop. Observers and scheduled work are cleaned up.
- Candidate tabs belong to the current tablist, including nested markup, while nested tablists and consumer-hidden/inert ancestors are excluded. Measurement accounts for actual column gap, padding/borders, trigger width and selected width, without LTR positioning assumptions. The selected tab is retained before fitting other tabs.
- Overflow-owned originals retain their IDs, values and panel associations. They receive a private marker and inert, remain measurable in invisible fixed boxes, and are excluded from roving navigation and assistive exposure. Consumer-authored hidden/inert/marker attributes are preserved; unchanged membership does not rewrite owned attributes.
- Labels prefer aria-labelledby, then aria-label, then text. Disabled originals produce disabled menu items. Menu activation temporarily lifts inert and calls the original button’s native click, preserving consumer onClick, cancellation and controlled ownership.
- Resize that hides a focused tab transfers focus to the trigger. Accepted menu selection restores the original selected tab and focuses it after measurement. Widening that removes a focused trigger/menu transfers focus to the selected visible tab. Existing Tabs roving focus remains authoritative.
- Selection and panel state update immediately. The layout effect restores a newly selected overflowed tab without forcing layout; the existing scheduled pass performs fitting. This avoids forcing layout across every list during synchronous React updates.
- SSR and initial hydration render all ordinary tabs. A hidden, noninteractive trigger shell has stable markup. Managed mode requires hydration, ResizeObserver and usable geometry. Missing ResizeObserver or zero geometry leaves native scrolling available. Wrap and vertical modes do not create a menu or horizontal controller.
- Managed lists use overflow-x:hidden. Invisible measured originals do not expand their scroll area; an oversized visible selected tab is constrained and clipped within the available list. Browser assertions check both the overflow mode and scrollWidth <= clientWidth + 1, including a long selected label at 320px.

## Motion and native scrollbars

Tab color/border/background transitions and panel entrance use the existing 180ms normal-motion token and Flux easing. Panels animate opacity and a 0.125rem optical translation; no height animation, delayed selection or interactive cross-fade is added. Reduced motion disables the panel animation and tab transition.

The private shared `scrollbar.css.ts` class is composed into ScrollArea, Sidebar.Panel and Tabs. Sidebar retains scrollbar-gutter:stable. CodeBlock and DataTable inherit the treatment through their existing ScrollArea composition.

Blink/WebKit use a 0.5rem native scrollbar box, a transparent track, a 0.125rem transparent thumb border, padding-box clipping and rounded corners. Border and border-strong theme colors provide resting and hover colors. Firefox uses scrollbar-width:thin and scrollbar-color. Forced colors removes author WebKit pseudo styling and restores automatic native scrollbar color/width. There is no JavaScript track, thumb or hit testing.

Docs viewport and preview surfaces mirror this treatment in app CSS. Exact dogfood ownership entries document the requested app-owned scrollbar rules without raising declaration budgets. Importing tokens does not restyle arbitrary consumer scroll containers.

## Bundled size

All values below are bytes, ordered **raw / gzip / Brotli**. Bundled entries include emitted JS and CSS, with React external.

| Surface  | Starting working tree |                  Final |
| -------- | --------------------: | ---------------------: |
| tabs     | 6,571 / 2,822 / 2,464 | 23,843 / 8,051 / 7,193 |
| overflow | 5,165 / 2,380 / 2,053 |                Removed |

The old Tabs and Overflow entries were separate public surfaces; summing isolated bundles is not a deduplicated application bundle. The replacement Tabs includes DropdownMenu, Popover and Button behavior already present elsewhere in the system. All absolute component and aggregate budgets pass. Tabs changes from **interactive → composite**, using the already-approved existing class. No global byte limit changed.

Read-only component baseline proposals (accepted numbers differ from the pre-task working-tree measurements above):

| Component   |      Accepted baseline |   Proposed measurement |
| ----------- | ---------------------: | ---------------------: |
| tabs        |  6,482 / 2,773 / 2,421 | 23,843 / 8,051 / 7,193 |
| scroll-area |      1,608 / 919 / 760 |    2,197 / 1,128 / 931 |
| sidebar     |  5,922 / 2,277 / 1,965 |  6,511 / 2,430 / 2,101 |
| code-block  | 10,891 / 4,427 / 3,826 | 11,480 / 4,583 / 3,964 |
| data-table  |  9,459 / 3,996 / 3,533 | 10,048 / 4,160 / 3,685 |

The four scrollbar-related entry increases each contain 580 added CSS bytes and 9 added JS bytes for static class composition. This is shared presentation cost, not a new runtime controller in those components. These proposals are reported separately; none was accepted.

Read-only aggregate proposal, using the repository’s sum-of-per-file-compressed-bytes method:

| Aggregate |             Accepted baseline |         Starting working tree |          Proposed measurement |
| --------- | ----------------------------: | ----------------------------: | ----------------------------: |
| rootEntry |         5,394 / 1,775 / 1,560 |         5,372 / 1,768 / 1,553 |         5,328 / 1,752 / 1,549 |
| runtime   |     209,067 / 96,000 / 82,350 |     210,100 / 96,397 / 82,694 |     209,739 / 95,478 / 81,971 |
| published | 1,137,485 / 389,791 / 334,996 | 1,141,126 / 391,209 / 336,200 | 1,135,977 / 386,550 / 332,419 |

Aggregate file counts: root 1 → 1, runtime 229 → 226, published 947 → 934. The component-count change makes the accepted aggregate snapshot stale. Aggregate runtime and published totals decrease compared with the starting working tree even though the isolated Tabs entry grows.

`tooling/size/baseline.json` has exactly one structural deletion: `components.overflow` (21 lines). A parsed deep comparison against the pre-task file verified that every retained component, aggregate field and measurement is unchanged. No Tabs, scrollbar-related component, aggregate, icon or performance baseline was accepted.

Executed review commands:

```sh
pnpm flux size baseline review --components=tabs,scroll-area,sidebar,code-block,data-table --json
pnpm flux size aggregate review --json
```

The component review succeeds with no absolute failures. Aggregate review exits nonzero for the stale snapshot and reports its proposal with accepted:false.

## Runtime measurements

Three focused Chromium runs of 100 five-tab collections, median milliseconds:

| Workload                   | Mount | Synchronous update | Unmount | DOM nodes |
| -------------------------- | ----: | -----------------: | ------: | --------: |
| Historical Overflow + Tabs |  59.8 |                9.8 |     6.5 |      1800 |
| Final responsive Tabs      |  71.3 |                9.9 |     5.1 |      1900 |

The historical sample was not rerun under identical conditions, so this is diagnostic context rather than a statistical regression verdict. The first synchronous-measurement implementation measured about 93ms update time; deferring fitting reduced that to about 9.9ms. The final fixture creates exactly 100 observers and leaves zero active after unmount in each run. Mount cost and DOM count increase; this is the cost of the real menu integration. Performance smoke passes. No performance baseline was changed.

## Validation

- 33 focused Tabs unit tests pass, including 14 migrated/new overflow cases. The focused DropdownMenu/Popover tests also pass (6 tests).
- Final full-check unit execution passes all 394 React tests, 54 other workspace tests and the tooling test suites. Callback-ref cleanup, controlled/uncontrolled behavior, hidden ownership, hydration, observer cleanup, explicit layout modes, fitting gaps, external selection and focus recovery are covered.
- Generated-file verification, docs coverage, dogfood, formatting, package builds, ESLint, TypeScript, Knip and docs build pass in the final full-check run.
- Final Coding Bible check passes: 74 applicable automated rules, 825 files.
- Storybook build passes, including responsive and wrapping stories.
- Focused Chromium checks pass (15 with the existing refinement suite; 7 after the performance adjustment), including axe, 320px/390px/desktop geometry, all-fit restoration, long-label clipping, menu keyboard/typeahead, cancellation, RTL, forced colors, reduced motion and native fallback.
- Final built-public-export consumer check passes declarations and all 26 browser tests. Dynamic membership and toggling wrapping/vertical layouts are tested against package output, without docs aliases.
- Performance smoke and the independent icon size gate pass.
- Broad Chromium browser suite passes: all 459 tests, including light/dark accessibility coverage.
- `pnpm flux check` initially stopped on an async-without-await lint error in a new test. That was fixed, and targeted lint plus the check nested inside `pnpm flux check full` subsequently passed lint.
- `pnpm flux check full` stops at size: all absolute limits pass, but five retained component baselines report regressions and the aggregate snapshot is stale. Its later Storybook, broad browser, performance smoke, icon size, Coding Bible and built-consumer steps were run independently. The release-mode size step was not reached; read-only component and aggregate reviews provide the proposals. It is not an all-green full check.
- Initial sandboxed browser startup failed; the authorized local-server/Chromium runs outside the sandbox succeeded.
- Packed consumer was attempted but cannot run: the release manifest is absent, and `pnpm flux release pack` rejects the existing 0.0.0 versions of tokens/icons/identity. Versions were not changed to bypass this prerequisite. No archive release or publication occurred.
- Firefox/WebKit execution and physical screen-reader certification were not performed; scrollbar branches are source-verified and Chromium/axe behavior is tested. No baseline acceptance, release versioning or publishing commands were run.

## Changeset and boundaries

`.changeset/responsive-tabs.md` adds a minor pre-1.0 package changeset describing Overflow removal, the wrapper-free migration, automatic menu behavior, motion and native scrollbar styling. No dependency, package version, lockfile, global size budget, security policy or release workflow was changed. No commit, push, branch operation, publication or baseline acceptance occurred.

Remaining follow-ups: explicitly review the five component size proposals and aggregate proposal; supply properly versioned release artifacts for packed-consumer validation. Mount cost is higher than the historical Overflow fixture and should remain visible in future performance review. Existing historical documents are preserved rather than rewritten.

## Exact file changes

Modified files (relative to the pre-task index):

- `apps/docs/consumer/consumer.spec.ts`
- `apps/docs/consumer/main.tsx`
- `apps/docs/consumer/refinements.spec.ts`
- `apps/docs/src/examples/scroll-area.example.tsx`
- `apps/docs/src/examples/tabs.example.tsx`
- `apps/docs/src/examples/tabs.preview.tsx`
- `apps/docs/src/generated/components.ts`
- `apps/docs/src/generated/health.ts`
- `apps/docs/src/perf/scenario.types.ts`
- `apps/docs/src/styles.css`
- `apps/docs/tests/component-refinements.spec.ts`
- `packages/react/src/components/ScrollArea/ScrollArea.css.ts`
- `packages/react/src/components/Sidebar/Sidebar.css.ts`
- `packages/react/src/components/Tabs/Tabs.css.ts`
- `packages/react/src/components/Tabs/Tabs.stories.tsx`
- `packages/react/src/components/Tabs/Tabs.types.ts`
- `packages/react/src/components/Tabs/TabsList.tsx`
- `packages/react/src/components/Tabs/component.meta.json`
- `packages/react/src/index.ts`
- `tooling/dogfood/ownership.json`
- `tooling/size/baseline.json`

Added files:

- `.changeset/responsive-tabs.md`
- `apps/docs/consumer/tabs.tsx`
- `apps/docs/src/perf/scenarios/tabs.fixture.tsx`
- `apps/docs/src/perf/scenarios/tabs.json`
- `apps/docs/tests/tabs-perf.spec.ts`
- `apps/docs/tests/tabs.spec.ts`
- `docs/tabs-responsive-report.md`
- `packages/react/src/components/Tabs/TabOverflow.test.tsx`
- `packages/react/src/components/Tabs/useTabOverflow.ts`
- `packages/react/src/internal/scrollbar.css.ts`

Deleted files (useful fixtures/tests migrated to Tabs files listed above):

- `apps/docs/consumer/overflow.tsx`
- `apps/docs/src/examples/overflow.example.tsx`
- `apps/docs/src/examples/overflow.preview.tsx`
- `apps/docs/src/perf/scenarios/overflow.fixture.tsx`
- `apps/docs/src/perf/scenarios/overflow.json`
- `apps/docs/tests/overflow-perf.spec.ts`
- `apps/docs/tests/overflow.spec.ts`
- `docs/overflow.md`
- `packages/react/src/components/Overflow/Overflow.bench.tsx`
- `packages/react/src/components/Overflow/Overflow.css.ts`
- `packages/react/src/components/Overflow/Overflow.stories.tsx`
- `packages/react/src/components/Overflow/Overflow.test.tsx`
- `packages/react/src/components/Overflow/Overflow.tsx`
- `packages/react/src/components/Overflow/Overflow.types.ts`
- `packages/react/src/components/Overflow/component.meta.json`
- `packages/react/src/components/Overflow/index.ts`
- `packages/react/src/components/Overflow/useOverflowItems.ts`
- `packages/react/src/internal/overflowCapability.ts`
