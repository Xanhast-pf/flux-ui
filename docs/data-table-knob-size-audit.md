# DataTable and Knob size investigation

> **Historical size audit.** Measurements below describe the repository state at the time of this audit. The deprecated `Fader` compatibility wrapper was subsequently removed before 1.0.

## Result

Incomplete. Both bundled entries still exceed their unchanged regression gates.
The measurements do not establish an architectural floor.

| Entry     | Initial raw / gzip / Brotli | Final raw / gzip / Brotli | Existing maximum raw / gzip / Brotli |
| --------- | --------------------------- | ------------------------- | ------------------------------------ |
| DataTable | 9,577 / 4,013 / 3,548 B     | 9,517 / 4,009 / 3,546 B   | 8,677 / 3,767 / 3,331 B              |
| Knob      | 5,399 / 2,349 / 2,082 B     | 5,274 / 2,334 / 2,073 B   | 4,907 / 2,222 / 1,956 B              |

DataTable still needs 840 / 242 / 215 B removed; Knob still needs
367 / 112 / 117 B removed. No baselines, budgets, accounting, dependencies,
public types, or Slider/Fader implementation files were changed by this pass.

## Initial retained-byte attribution

These are esbuild metafile contributions to the actual standalone minified
consumer output, built from the package's emitted files. They are not source
lengths or sums of independently compressed modules. Diagnostics used the same
ES2022, ESM, minification, tree shaking, external React peers, and compression
settings as the existing checker. All diagnostic scripts and comparison builds
were kept under `/tmp/flux-size-audit`, outside production source.

| Contributor                                                          | DataTable raw |    Knob raw |
| -------------------------------------------------------------------- | ------------: | ----------: |
| Component implementation, model/math, generated class-name constants |       5,508 B |     3,920 B |
| Component CSS                                                        |       1,285 B |     1,406 B |
| Checkbox implementation and class-name constant                      |         442 B |         0 B |
| Checkbox CSS                                                         |         728 B |         0 B |
| ScrollArea implementation and class-name constant                    |       1,108 B |         0 B |
| ScrollArea CSS                                                       |         287 B |         0 B |
| `attachRef`                                                          |         141 B |         0 B |
| `joinClassNames`                                                     |          52 B |        52 B |
| Import/export syntax and output separators                           |          26 B |        21 B |
| **Total**                                                            |   **9,577 B** | **5,399 B** |

This lists every retained transitive module. React and its JSX runtime are
external peers under the existing policy; no React implementation bytes are
included. There is no retained styling engine, generic state hook, or other
high-level runtime. Generated style constants are included in component JS;
static CSS is charged separately.

### Nested dependency counterfactuals

A temporary esbuild loader omitted one stylesheet or substituted one component
module with an inert exported function. These intentionally nonfunctional
counterfactuals diagnose marginal cost only; they are not candidate solutions.
Other inputs remained unchanged. Compression deltas are nonadditive.

| Diagnostic removal            | Entry after removal raw / gzip / Brotli | Reduction raw / gzip / Brotli |
| ----------------------------- | --------------------------------------- | ----------------------------- |
| Checkbox CSS only             | 8,849 / 3,801 / 3,376 B                 | 728 / 212 / 172 B             |
| Checkbox module and its CSS   | 8,432 / 3,651 / 3,237 B                 | 1,145 / 362 / 311 B           |
| ScrollArea CSS only           | 9,290 / 3,942 / 3,490 B                 | 287 / 71 / 58 B               |
| ScrollArea module and its CSS | 8,207 / 3,480 / 3,082 B                 | 1,370 / 533 / 466 B           |

`attachRef` remains necessary when either public component alone is removed.
Checkbox's callbacks, native indeterminate synchronization, and ref handling
are in its 442 B implementation. There is no accidental dependency pyramid or
barrel import retaining an unrelated component catalog.

## Ticket attribution and root causes

An isolated copy of the current React source was built with only the relevant
DataTable/Knob implementation files replaced by their Git HEAD versions. This
kept the current dependencies, build configuration, and shared components. It
is a diagnostic comparison, not a reproduction of the historical baseline.

| Entry     | Pre-ticket implementation raw / gzip / Brotli | Ticket delta raw / gzip / Brotli |
| --------- | --------------------------------------------- | -------------------------------- |
| DataTable | 8,506 / 3,693 / 3,265 B                       | +1,071 / +320 / +283 B           |
| Knob      | 4,810 / 2,178 / 1,917 B                       | +589 / +171 / +165 B             |

### DataTable

The public Checkbox requirement is the principal new retained cost: 442 B JS
and 728 B CSS. The previous focus-index and stable-sort simplifications reduced
the DataTable/model contribution from 5,607 to 5,508 B, partly offsetting that
cost. ScrollArea predates the ticket and contributes no ticket delta.

Selection ownership, the selected-ID Set, per-row callback, and cell wrapper
already existed. The new callback forwards Checkbox's boolean instead of
reading a native change event. No new DataTable row-selection CSS was added.
No select-all/indeterminate DataTable API exists in the inspected implementation;
Checkbox's existing public indeterminate behavior remains covered separately.

The kept CSS edit removes `overflow: auto` and the identical focus outline
already supplied by ScrollArea. DataTable retains its outward outline offset,
scroll anchoring, border, and geometry.

### Knob

The ticket added 429 B to emitted JS and 160 B to CSS. Its additions include
reset validation, retaining the original default, double-click reset with
capture cleanup, changed-value commits, and size/custom-diameter support.
The math helpers were unchanged by the ticket. No nested Flux component or
new shared hook explains this growth.

The kept implementation uses one key-to-step table for keyboard changes and
release recognition. Home/End still select the true bounds; Page and arrow
keys retain their direction and step semantics. Numeric lookup validation
ignores unknown keys, including inherited object property names. Reset,
pointer, controlled/uncontrolled, disabled, and ARIA paths are unchanged.

## Measured experiments

Each implementation experiment was followed by React tests and a Vite package
build plus standalone bundled measurement. The commands initially forwarded
filters after `--`; Vitest ran the full React suite, rather than only those
files. All these test runs passed. Deltas below are against each experiment's
starting point, not against Git HEAD.

| Experiment                                          | Starting raw / gzip / Brotli | Result raw / gzip / Brotli | Delta raw / gzip / Brotli | Decision                                              |
| --------------------------------------------------- | ---------------------------- | -------------------------- | ------------------------- | ----------------------------------------------------- |
| Knob: shared keyboard map                           | 5,399 / 2,349 / 2,082        | 5,274 / 2,334 / 2,073      | -125 / -15 / -9           | Kept                                                  |
| DataTable: shared window-calculation closure        | 9,577 / 4,013 / 3,548        | 9,550 / 4,018 / 3,556      | -27 / +5 / +8             | Reverted; compressed output worsened                  |
| DataTable: remove duplicate ScrollArea declarations | 9,577 / 4,013 / 3,548        | 9,517 / 4,009 / 3,546      | -60 / -4 / -2             | Kept                                                  |
| Knob: shared pointer-capture release helper         | 5,274 / 2,334 / 2,073        | 5,214 / 2,340 / 2,072      | -60 / +6 / -1             | Reverted; gzip worsened for negligible Brotli benefit |

No rejected implementation remains in source. No Checkbox substitution was
kept or proposed as a way to satisfy the public-checkbox contract.

### CSS output

| CSS                                             | Initial raw / gzip / Brotli | Final raw / gzip / Brotli |
| ----------------------------------------------- | --------------------------- | ------------------------- |
| Entire DataTable entry, including nested styles | 2,301 / 807 / 668 B         | 2,241 / 803 / 666 B       |
| Entire Knob entry                               | 1,407 / 612 / 507 B         | 1,407 / 612 / 507 B       |

DataTable-owned CSS fell from 1,285 to 1,225 metafile bytes. Nested component
styles are unchanged. The one-byte difference between Knob's contribution and
its CSS file size is an output separator.

## Files changed by this pass

- `packages/react/src/components/DataTable/DataTable.css.ts`: remove duplicate declarations.
- `packages/react/src/components/DataTable/DataTable.test.tsx`: controlled selection through the Space key.
- `packages/react/src/components/Knob/Knob.tsx`: shared keyboard map.
- `packages/react/src/components/Knob/Knob.test.tsx`: all eight release keys and unknown-key guards.
- This audit.

The working tree already contained extensive ticket edits, including edits to
these test/implementation files. Those changes were preserved. DataTable's
implementation/model and Knob's types/styles/stories match the task-start
versions after experiments were reverted.

## Validation

- React package: **380 tests passed across 78 files** on the final code. This
  includes DataTable selection, controlled Space-key selection, virtualization,
  batched scrolling, stable sorting, Checkbox indeterminate/ref contracts, and
  Knob reset after bounds changes, pointer cancellation, controlled/uncontrolled,
  disabled, keyboard, and unknown-key behavior.
- `pnpm lint`, `pnpm format:check`, and `pnpm typecheck`: passed. The later
  `check:full` run also passed these stages after the added selection test.
- React package build (Vite and declaration TypeScript): passed.
- `pnpm bible:check`: passed, 74 applicable rules in 817 files at that run.
- Chromium built-public-export consumer tests: **5 passed**, selected with
  `--grep 'built (DataTable|Knob|knobs|table checkboxes|advanced exports)'`.
  Coverage includes real scrolling, selection/focus retention, public Checkbox
  styling, keyboard/pointer interactions, reset commits, and preset/custom size.
- Chromium axe preview tests: **4 passed**, DataTable and Knob in light and dark.
- Browser servers initially failed with sandbox `listen EPERM`; the approved
  runs outside the sandbox passed. No browser assertions were weakened.
- `pnpm check:full`: **failed** in `check`'s test stage. Generated files, docs,
  dogfood, formatting, package builds, ESLint, TypeScript, Knip, and workspace
  unit tests passed before two size-tool test files failed.
- Direct reproduction exposed sandbox `spawnSync node EPERM` in CLI fixtures.
  Both size-tool files passed outside the sandbox: **9 tests passed** using
  `node --test --test-reporter=spec tooling/size/bundled-entry.test.mjs tooling/size/output.test.mjs`.
  The full repository gate was not rerun; its remaining stages are unverified.
- Final `pnpm size`: **exit 1**, 70 components checked. DataTable, Knob, Slider,
  and Fader each fail raw/gzip/Brotli regression gates. The chained icon-size
  command is not reached after this failure. No size failure was hidden.
- Final diff was reviewed against the task-start backups, including confirmation
  that reverted experiments restored the pre-existing component edits.

Public APIs are unchanged. Tested semantics and accessibility pass; this is
not a claim of comprehensive screen-reader, browser-matrix, or performance
certification. Full browser, Storybook, release-size, and performance-smoke
stages were not reached by `check:full`. No performance baseline was measured
or accepted.

## Deferred components and remaining work

The final size check still reports these unchanged, explicitly deferred failures:

| Entry  |     Raw |    Gzip |  Brotli |
| ------ | ------: | ------: | ------: |
| Slider | 3,324 B | 1,159 B |   975 B |
| Fader  | 3,580 B | 1,260 B | 1,056 B |

Both task-owned entries also still fail all three regression metrics. These
experiments do not prove the thresholds impossible. Further implementation or
static-style reductions are needed while retaining the public Checkbox,
ScrollArea, reset, input, and accessibility contracts. The measured reductions
here are insufficient; no architecture or baseline acceptance is requested.
