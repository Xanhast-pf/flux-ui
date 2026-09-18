# Bounded smart Tabs optimization pass

No implementation experiment was retained. All touched source and test files were restored byte for byte to the task-start working tree. The approved smart Tabs architecture and its package-level advantage remain intact. Only this report and `docs/tabs-optimization-pass.json` are new task changes.

The requested 500–1,000 Brotli-byte recovery was not reached. The smallest measured Tabs experiment was 7,025 bytes, a 168-byte saving, but its aggregate compressed cost increased. The retained result is 7,193 bytes (999 bytes below the unchanged 8 KiB composite ceiling). This is the outcome of a bounded pass, not proof of a universal theoretical minimum.

The JSON companion contains exact measurements, JS/CSS breakdowns, aggregate file counts, experiment performance samples and read-only baseline proposals. It is diagnostic evidence, not a quality baseline.

## Starting attribution

The production build and existing standalone esbuild checker reproduced the supplied starting values exactly. Attribution used an in-memory esbuild bundle of the emitted Tabs entry with a metafile, matching browser ESM/ES2022/minification/tree-shaking and React peer exclusion. CSS and JavaScript compression are independent; semantic parts inside a compressed stream do not have additive Brotli costs.

| Emitted contribution                                                           | Minified raw bytes attributed by metafile |
| ------------------------------------------------------------------------------ | ----------------------------------------: |
| Tabs chunk: root, list, panels, overflow controller and local class references |                                     7,573 |
| DropdownMenu chunk, including Label/Separator                                  |                                     2,171 |
| Popover chunk, including Close                                                 |                                     3,191 |
| Button                                                                         |                                       545 |
| Floating-surface chunk                                                         |                                     1,938 |
| Roving focus                                                                   |                                       511 |
| Class join / ref attachment helpers                                            |                                  52 / 141 |
| Tabs CSS                                                                       |                                     2,932 |
| DropdownMenu CSS, including extras                                             |                                       851 |
| Popover CSS                                                                    |                                        79 |
| Button CSS / shared action CSS                                                 |                               700 / 1,891 |
| Floating CSS                                                                   |                                       667 |
| Shared scrollbar CSS                                                           |                                       580 |

Import/export glue accounts for the remainder: complete output is 16,142 JS + 7,701 CSS raw bytes, 6,058 + 1,993 gzip, and 5,448 + 1,745 Brotli. The scrollbar helper also contributes a class reference; its supplied isolated-entry increase is 589 raw bytes.

The starting emitted compound objects explicitly retained Label, Separator and Close. Close has no separate CSS asset: Button styles are already required by Trigger. Label/Separator styles share the menu CSS asset. `useTabOverflow` is coalesced into the Tabs chunk, so exact independent production compression cannot be attributed to it. Source sizes are 7,851 bytes for the hook; 9,688 for Tabs.tsx/TabsList.tsx/TabsContext.ts together; 4,862 for DropdownMenu; 7,941 for Popover; 1,062 for Button; 2,567 for useFloatingSurface; and 1,373 for rovingFocus. The Label/Separator source functions occupy 295 bytes and Close 380 bytes; these are source spans, not compressed bundle costs.

## Experiments

All experiments were built and measured against the current smart Tabs working tree, never the historical accepted Tabs baseline. No dependency, bundler configuration, budget, tolerance or baseline was changed.

| Experiment                             | Tabs raw / gzip / Brotli | DropdownMenu raw / gzip / Brotli | Runtime gzip / Brotli | Published gzip / Brotli |
| -------------------------------------- | -----------------------: | -------------------------------: | --------------------: | ----------------------: |
| Starting tree                          |   23,843 / 8,051 / 7,193 |           12,372 / 4,645 / 4,104 |       95,478 / 81,971 |       386,550 / 332,419 |
| Named primitives                       |   23,331 / 7,897 / 7,058 |           12,127 / 4,579 / 4,052 |       95,526 / 82,000 |       386,649 / 332,519 |
| Separate menu extras CSS/core          |   23,094 / 7,861 / 7,025 |           12,173 / 4,598 / 4,069 |       95,939 / 82,368 |       388,128 / 333,796 |
| Conditional menu, first version        |   23,552 / 7,981 / 7,137 |           12,127 / 4,579 / 4,052 |       95,604 / 82,080 |       386,985 / 332,787 |
| Conditional menu, refined measurement  |   23,560 / 7,993 / 7,148 |           12,127 / 4,579 / 4,052 |       95,620 / 82,092 |       386,983 / 332,783 |
| Named primitives + one geometry read   |   23,337 / 7,906 / 7,066 |           12,127 / 4,579 / 4,052 |       95,535 / 82,011 |       386,624 / 332,484 |
| Named primitives + scrollbar shorthand |   23,315 / 7,890 / 7,050 |           12,127 / 4,579 / 4,052 |       95,520 / 81,993 |       386,630 / 332,463 |

Popover remained 9,341 / 3,735 / 3,273 in every experiment. Exact root/runtime/published triples for every phase are in the JSON companion.

1. **Named primitives:** exported the existing menu Root/Trigger/Popup/Item and Popover Root/Trigger/Popup inside their implementation modules, without changing public entrypoints. Tabs used direct named imports and DropdownMenu stopped importing the Popover compound object. Tabs fell by 512 raw / 154 gzip / 135 Brotli; DropdownMenu also fell by 52 Brotli. Aggregate runtime grew by 29 Brotli and published output by 100 Brotli. Reverted under the instruction to reject aggregate compressed growth.
2. **CSS separation:** moved menu core code to `DropdownMenuCore.tsx`, leaving Label/Separator and the public object in the existing module, and moved only their styles to `DropdownMenuExtras.css.ts`. Tabs saved another 237 raw / 36 gzip / 33 Brotli versus named imports. Runtime grew by 397 Brotli and published output by 1,377 versus the starting tree. Reverted both temporary files and the split.
3. **Conditional menu mounting:** added menu-required state and two-phase measurement. Phase one measured tabs without a trigger; phase two mounted the real Flux menu and used its measured trigger width in a layout effect. The existing observer was reused, with trigger observation updated on mount/unmount. Widening restored tabs and moved focus before unmounting the menu. The unit test asserted actual trigger absence, not just accessibility-tree absence. All 39 focused unit tests and all six Tabs browser/axe tests passed. The existing 100-instance workload still mounted every menu and retained 1,900 nodes. Published Brotli increased by 368 bytes.
4. **Refined conditional mounting:** removed its duplicate initial measurement and combined repeated rectangle reads, while preserving zero-width fallback. This brought the diagnostic median mount to 76.3 ms, but the sample count and host conditions did not establish a reliable gain; published Brotli still increased by 364 bytes. Reverted conditional mounting and its test edits, rather than retain another state/effect lifecycle on this evidence.
5. **Small hook-only follow-up with named imports:** restored the original menu lifecycle, retained a single rectangle read per candidate, and used existing short primitive names. Tabs was 7,066 Brotli; runtime/published grew by 40/65 Brotli. No observer or accessibility checks were removed. Reverted; the geometry rewrite did not simplify the hook enough to justify its result.
6. **Optional scrollbar shorthand:** after restoring the original hook, tested `background: var(--flux-color-border) padding-box` in place of separate background/background-clip declarations. The intended native interaction box, track, border, rounding, hover, Firefox and forced-colors rules stayed intact. Each affected raw entry fell by 16 bytes, but Sidebar Brotli increased by 5. The combined named-import/shorthand package still grew by 22 runtime / 44 published Brotli. Reverted.

The scrollbar experiment measured:

| Entry       | Starting raw / gzip / Brotli |   Shorthand experiment |                  Final |
| ----------- | ---------------------------: | ---------------------: | ---------------------: |
| scroll-area |          2,197 / 1,128 / 931 |    2,181 / 1,121 / 924 |    2,197 / 1,128 / 931 |
| sidebar     |        6,511 / 2,430 / 2,101 |  6,495 / 2,425 / 2,106 |  6,511 / 2,430 / 2,101 |
| code-block  |       11,480 / 4,583 / 3,964 | 11,464 / 4,578 / 3,956 | 11,480 / 4,583 / 3,964 |
| data-table  |       10,048 / 4,160 / 3,685 | 10,032 / 4,152 / 3,663 | 10,048 / 4,160 / 3,685 |

No speculative changes accumulated. The seven existing files touched and then restored were:

- `packages/react/src/components/Tabs/TabsList.tsx`
- `packages/react/src/components/Tabs/useTabOverflow.ts`
- `packages/react/src/components/Tabs/TabOverflow.test.tsx`
- `packages/react/src/components/DropdownMenu/DropdownMenu.tsx`
- `packages/react/src/components/DropdownMenu/DropdownMenu.css.ts`
- `packages/react/src/components/Popover/Popover.tsx`
- `packages/react/src/internal/scrollbar.css.ts`

## Retained architecture and behavior

The final package-private architecture is unchanged: Tabs imports the public compound DropdownMenu from its implementation module; DropdownMenu imports the Popover compound object and package-private usePopover. No new private primitives remain, and none were added to the package root. A final SHA-256 comparison found all 934 emitted package files, including declarations and source maps, byte-identical to the saved task-start build. Tabs, DropdownMenu and Popover retain every documented public part and public type. Label/Separator/Popover Close remain in the final Tabs bundle; no CSS extras split remains.

Fitting horizontal Tabs still mount the hidden DropdownMenu Root/Trigger and therefore Popover/Button behavior. No two-phase measurement or hook simplification remains. The scrollbar helper is unchanged. SSR and initial hydration follow the original markup, and the existing hydration test passes without recoverable errors. Original tab activation/cancellation, selected-tab visibility, disabled items, focus recovery, pending selected focus, observer cleanup, wrapping/vertical fallback and missing-ResizeObserver native scrolling remain covered by the focused tests. Chromium tests cover real menu keyboard/typeahead, Escape, RTL, resize focus, oversized labels, no managed horizontal scrolling, reduced motion and axe. No claim is made that this pass adds behavior coverage beyond those executed tests.

## Final comparison

| Surface                                         | Smart Tabs starting point |         Final retained |                             Delta |
| ----------------------------------------------- | ------------------------: | ---------------------: | --------------------------------: |
| Tabs raw                                        |                    23,843 |                 23,843 |                                 0 |
| Tabs gzip                                       |                     8,051 |                  8,051 |                                 0 |
| Tabs brotli                                     |                     7,193 |                  7,193 |                                 0 |
| DropdownMenu Brotli                             |                     4,104 |                  4,104 |                                 0 |
| Popover Brotli                                  |                     3,273 |                  3,273 |                                 0 |
| Runtime Brotli                                  |                    81,971 |                 81,971 |                                 0 |
| Published Brotli                                |                   332,419 |                332,419 |                                 0 |
| 100× Tabs mount, supplied historical diagnostic |                   71.3 ms | 70.0 ms new-run median |        Not an attributable change |
| 100× Tabs mount, newly rerun median             |                   80.2 ms |                70.0 ms | −10.2 ms observed; identical code |
| 100× Tabs DOM nodes                             |                     1,900 |                  1,900 |                                 0 |

Exact standalone and aggregate triples are unchanged:

| Surface       |  Starting raw / gzip / Brotli |     Final raw / gzip / Brotli |
| ------------- | ----------------------------: | ----------------------------: |
| tabs          |        23,843 / 8,051 / 7,193 |        23,843 / 8,051 / 7,193 |
| dropdown-menu |        12,372 / 4,645 / 4,104 |        12,372 / 4,645 / 4,104 |
| popover       |         9,341 / 3,735 / 3,273 |         9,341 / 3,735 / 3,273 |
| rootEntry     |         5,328 / 1,752 / 1,549 |         5,328 / 1,752 / 1,549 |
| runtime       |     209,739 / 95,478 / 81,971 |     209,739 / 95,478 / 81,971 |
| published     | 1,135,977 / 386,550 / 332,419 | 1,135,977 / 386,550 / 332,419 |

## Performance evidence

Each invocation used the same checked-in Chromium test, production fixture, 100-instance count and three samples. These are diagnostics, not a formal benchmark baseline or a statistically established improvement. Some earlier performance runs overlapped package measurements; the final run did not. Identical starting/final source still produced different timings, illustrating why a timing delta alone did not justify retention. Historical 71.3 / 9.9 / 5.1 ms and 1,900-node figures were supplied, not rerun under their original conditions.

| Run     | Mount samples, ms | Synchronous update samples, ms | Unmount samples, ms | Nodes per sample | Observers created / active after unmount |
| ------- | ----------------- | ------------------------------ | ------------------- | ---------------- | ---------------------------------------- |
| start   | 89.9, 65.7, 80.2  | 10.8, 10.7, 12.1               | 6.0, 6.1, 6.1       | 1,900            | 100 / 0                                  |
| idle    | 125.0, 77.7, 78.6 | 17.4, 13.2, 12.3               | 6.6, 7.0, 5.0       | 1,900            | 100 / 0                                  |
| refined | 92.9, 63.6, 76.3  | 17.2, 9.1, 9.2                 | 6.7, 7.0, 6.4       | 1,900            | 100 / 0                                  |
| final   | 93.6, 70.0, 65.9  | 11.9, 12.5, 10.0               | 6.0, 5.4, 5.4       | 1,900            | 100 / 0                                  |

Starting versus final medians were mount 80.2 → 70.0 ms, synchronous update 10.8 → 11.9 ms, and unmount 6.1 → 5.4 ms. No runtime gain is claimed: final source is identical. All samples created one ResizeObserver per enhanced list and cleaned all observers. Named-import/CSS-only intermediate experiments did not receive separate runtime reruns; none was retained.

## Validation

- Focused Tabs/DropdownMenu/Popover unit tests: 39 passed on the named-import experiment, conditional-menu versions and restored final tree. Existing hydration, focus, ownership and StrictMode observer tests remained enabled.
- Final Tabs Chromium behavior suite: 6 passed, including axe at 320/390/1280 pixels, RTL, cancellation, resize focus, scrolling fallback and reduced motion. The conditional-menu experiment also passed this suite.
- Focused performance test: passed for start, both conditional-menu versions and final; three samples per run.
- `pnpm flux check types`: passed across the workspace.
- `pnpm flux test consumer`: passed package builds, built declaration typecheck and all 26 consumer browser tests. No source-only aliases were used as proof of built output.
- `pnpm flux check`: passed generation, docs coverage, dogfood, formatting, package builds, ESLint, TypeScript, Knip and workspace tests, then stopped in size-tooling subprocess tests. Isolating the bundled-entry test without process isolation exposed `spawnSync ... node EPERM`. No test or gate was weakened.
- `pnpm flux test size` outside the restricted sandbox: all 52 passed.
- `pnpm flux check full` with subprocess/browser permission: its nested normal check passed all stages through the complete test chain and build, then stopped at the five expected component baseline regressions and stale aggregate snapshot. Full verification therefore did not pass.
- `pnpm flux check bible`: passed separately, 74 applicable automated rules across 825 files.
- Full-check release-size, Storybook, broad browser and perf-smoke stages were not reached. Built consumer and focused browser/performance checks were executed separately as listed above. No new architectural contract test was retained because the refactor was reverted.

The initial browser-server failure was `listen EPERM` on 127.0.0.1:4173; authorized execution outside the sandbox passed. There were no unresolved tool-environment blockers after those reruns.

## Read-only baseline review

Executed the supported commands:

```sh
pnpm flux size baseline review --components=tabs,scroll-area,sidebar,code-block,data-table --json
pnpm flux size aggregate review --json
```

The component review completed successfully as a proposal; it warns that aggregate metadata is stale. The aggregate review emitted its proposal but exited nonzero because the existing component regressions remain unaccepted. These are the unchanged proposed component values:

| Component   | Accepted raw / gzip / Brotli | Proposed raw / gzip / Brotli |
| ----------- | ---------------------------: | ---------------------------: |
| code-block  |       10,891 / 4,427 / 3,826 |       11,480 / 4,583 / 3,964 |
| data-table  |        9,459 / 3,996 / 3,533 |       10,048 / 4,160 / 3,685 |
| scroll-area |            1,608 / 919 / 760 |          2,197 / 1,128 / 931 |
| sidebar     |        5,922 / 2,277 / 1,965 |        6,511 / 2,430 / 2,101 |
| tabs        |        6,482 / 2,773 / 2,421 |       23,843 / 8,051 / 7,193 |

The independent aggregate snapshot proposal changes the component count from 71 to 70. These accepted snapshot figures are distinct from both the task-start implementation and the supplied pre-smart-Tabs working-tree comparison.

| Aggregate | Accepted snapshot raw / gzip / Brotli |  Proposed raw / gzip / Brotli | Delta raw / gzip / Brotli |
| --------- | ------------------------------------: | ----------------------------: | ------------------------: |
| rootEntry |                 5,394 / 1,775 / 1,560 |         5,328 / 1,752 / 1,549 |           -66 / -23 / -11 |
| runtime   |             209,067 / 96,000 / 82,350 |     209,739 / 95,478 / 81,971 |        +672 / -522 / -379 |
| published |         1,137,485 / 389,791 / 334,996 | 1,135,977 / 386,550 / 332,419 |  -1,508 / -3,241 / -2,577 |

No proposal was accepted. The removed Overflow baseline entry remains removed. Tabs remains composite; all absolute budgets and tolerances are unchanged. Relative to the supplied pre-smart-Tabs working tree, the retained package still saves 361 raw / 919 gzip / 723 Brotli runtime bytes and 5,149 raw / 4,659 gzip / 3,781 Brotli published bytes.

## Boundaries and remaining risks

No public API, dependency, `pnpm-lock.yaml`, global budget or tolerance changed. No retained-component, aggregate, performance or icon baseline was accepted. Public Overflow was not restored. No custom menu, asynchronous menu import, generated-code trick or reduced scrollbar treatment was retained. No release, version, publish, commit or push occurred. User-owned staged and unstaged work was preserved.

The implementation remains above historical component baselines, so the normal/full gates stay red until human review and explicit acceptance or a separately justified implementation change. The 500–1,000 Brotli-byte target remains unmet. Idle menus remain mounted, and unused compound members/CSS remain in Tabs. The measurements do not establish that every possible further optimization would compromise behavior; they establish that this bounded set did not satisfy all requested constraints. A deeper redesign would need fresh evidence, while custom menus, async loading, API expansion and weakened behavior remain outside this task. This pass stops at the baseline acceptance boundary.
