# Checkbox and Knob size continuation

> **Historical size audit.** Measurements below describe the repository state at the time of this audit. The deprecated `Fader` compatibility wrapper was subsequently removed before 1.0.

## Result

**Incomplete: both historical gates still fail, and an architectural floor has
not been established.** The retained changes improve both task-owned entries
without changing public types, budgets, baselines, dependencies, or size accounting.

| Entry            | Before | After |  Gate | Status |
| ---------------- | -----: | ----: | ----: | ------ |
| Checkbox raw     |  1,381 | 1,323 | 1,445 | Pass   |
| Checkbox gzip    |    731 |   716 |   763 | Pass   |
| Checkbox Brotli  |    614 |   601 |   638 | Pass   |
| DataTable raw    |  9,517 | 9,459 | 8,677 | Fail   |
| DataTable gzip   |  4,009 | 3,996 | 3,767 | Fail   |
| DataTable Brotli |  3,546 | 3,533 | 3,331 | Fail   |
| Knob raw         |  5,274 | 5,139 | 4,907 | Fail   |
| Knob gzip        |  2,334 | 2,299 | 2,222 | Fail   |
| Knob Brotli      |  2,073 | 2,039 | 1,956 | Fail   |

All measurements are bytes. DataTable still exceeds its gates by
782 / 229 / 202 bytes; Knob by 232 / 77 / 83 bytes.

## Measurement method

Measurements bundle emitted package entries with the existing esbuild toolchain:
ES2022, browser platform, ESM, minification, tree shaking, external React peers,
no source maps or legal comments. JS and CSS are compressed separately using
`tooling/size/lib.mjs`, then added. No mandatory internal modules are externalized.
The final `pnpm size` agrees with the diagnostic entry totals.

Task-start source and emitted output were copied to `/tmp/flux-floor-start`.
Measurement scripts, JSON results, and validation logs are there. The isolated
feature-build workspace is `/tmp/flux-floor-lab`; no diagnostic substitutions
remain in production source or output. These temporary paths are session
artifacts, not committed infrastructure.

Checkbox marginal cost is the complete DataTable bundle minus a diagnostic
bundle replacing Checkbox's emitted module with `export function t(){return null}`.
That deliberately inert reference removes its implementation and CSS, but retains
DataTable's integration call site. It is not a candidate implementation.

The task-start marginal measurement is **1,145 / 359 / 322**, rather than the
previous audit's **1,145 / 362 / 311**. This run uses the current task-start
DataTable, including its earlier CSS reduction, for both sides of the comparison.
Compression deltas depend on the surrounding bundle; they are not additive module
sizes. Final Checkbox marginal cost is **1,087 / 346 / 309**.

## Checkbox attribution and retained optimization

| Standalone contribution                | Before raw / gzip / Brotli | After raw / gzip / Brotli |
| -------------------------------------- | -------------------------- | ------------------------- |
| JS, including helpers and entry syntax | 652 / 389 / 339            | 652 / 389 / 339           |
| CSS                                    | 729 / 342 / 275            | 671 / 327 / 262           |
| Total                                  | 1,381 / 731 / 614          | 1,323 / 716 / 601         |

The original DataTable metafile attributes 442 raw bytes to Checkbox's
implementation/class constant, 728 to its CSS, 141 to shared `attachRef`, and
52 to shared `joinClassNames`. Helpers are shared with other retained modules;
charging their complete standalone cost again as Checkbox marginal cost would
be incorrect. Output separators account for the CSS file's additional byte.

Retained changes in `Checkbox.css.ts`:

- Factor repeated invalid selectors into `&:is(...)`, retaining specificity and
  all three invalid-state triggers.
- Remove explicit border-box sizing supplied by the native checkbox's browser
  stylesheet. Chromium computed-style comparison confirmed unchanged 24px square
  dimensions and border-box sizing.

Every other declaration was inspected. Appearance preserves native glyphs;
accent supplies the theme; dimensions, margin and flex shrinking control layout;
vertical alignment matters outside flex layouts; cursors preserve interaction
feedback. Disabled opacity/cursor, invalid shadows, focus outlines and their
forced-colors overrides remain. Forced-colors focus must override the invalid
outline's dashed style and smaller offset. No styles moved to another component.

The implementation, types, tests, stories and emitted dependency graph were
inspected. There is no unnecessary runtime state or retained component catalog.
`useCallback` preserves consumer ref identity. `attachRef` preserves object refs
and React 19 cleanup. Restoring indeterminate before consumer callbacks preserves
synchronous updates; capturing checked before those callbacks preserves callback
semantics. Removing these paths would violate existing behavior tests.

### Checkbox experiments

Each row reports the measured complete entry and its marginal cost against the
same inert reference. Raw / gzip / Brotli bytes are shown throughout.

| Experiment                                        | Standalone Checkbox | Marginal in DataTable | Complete DataTable    | Decision                                                                |
| ------------------------------------------------- | ------------------- | --------------------- | --------------------- | ----------------------------------------------------------------------- |
| Task start                                        | 1,381 / 731 / 614   | 1,145 / 359 / 322     | 9,517 / 4,009 / 3,546 | Reference                                                               |
| Factor invalid selectors only                     | 1,345 / 728 / 616   | 1,109 / 354 / 324     | 9,481 / 4,004 / 3,548 | Insufficient alone; Brotli worsens                                      |
| Above, omit forced-colors shadow reset            | 1,329 / 726 / 608   | 1,093 / 352 / 319     | 9,465 / 4,002 / 3,543 | Rejected; retain explicit reset for consumer forced-color customization |
| Factored selectors plus native border-box default | 1,323 / 716 / 601   | 1,087 / 346 / 309     | 9,459 / 3,996 / 3,533 | Kept                                                                    |
| Above, positive-node ref guard                    | 1,316 / 714 / 601   | 1,080 / 345 / 312     | 9,452 / 3,995 / 3,536 | Rejected; DataTable Brotli worsens                                      |

### Minimal Checkbox diagnostic

The first diagnostic retained the full optimized stylesheet but reduced the
implementation to native input props/ref forwarding and boolean change forwarding.
It measured **829 / 256 / 228** marginal bytes, producing a
**9,201 / 3,906 / 3,452** DataTable entry.

The reduced-style diagnostic retains native input semantics, checked and native
ref forwarding, boolean change forwarding, the class, native appearance, accent,
24px dimensions, layout/cursor declarations, focus outline, and forced-colors
focus outline. It omits disabled/invalid presentation and indeterminate behavior
not used by DataTable's actual row selector. Conceptually its implementation is:

```jsx
function Checkbox({ onCheckedChange, ...props }) {
  return (
    <input
      {...props}
      type="checkbox"
      className="_63780z0"
      onChange={(event) =>
        onCheckedChange?.(event.currentTarget.checked, event)
      }
    />
  );
}
```

It measures **520 / 166 / 142** marginal bytes and produces a
**8,892 / 3,816 / 3,366** DataTable entry. This is still over all three gates.
It is intentionally incomplete, not shipped, and was not separately certified
by running the consumer suite against substituted package output. The production
consumer suite ran against the full public Checkbox.

This is the smallest diagnostic measured here, **not proof of the minimum
possible implementation**. It does not establish an architectural floor.

### DataTable core review and floor conclusion

The retained component/model contribution is approximately 5,508 raw bytes;
DataTable-owned CSS is 1,225. ScrollArea remains approximately 1,395 raw bytes
including styles. The core contains native table rendering, stable cached sort
keys, virtualization/spacers, focused-row retention, selected-ID ownership,
caption/header offset measurement and validation of supported geometry.
No new dependency pyramid or large redundant stylesheet was found.

The earlier shared-window-helper experiment was not repeated. Sorting caches
accessor values once; dropping that cache changes runtime work. Removing the
focused row, body-offset measurement or viewport comparison would sacrifice
required behavior or performance. Nevertheless, inspection alone does not rule
out a more compact rendering/window representation. The reduced Checkbox
counterfactual remains only 215 / 49 / 35 bytes above the complete gates, so
unexplored core reductions could materially change that diagnostic conclusion.

**DataTable floor standard is not met.** Checkbox improved modestly, rather than
being proven maximally compact, and the diagnostic is not a certified minimum.

## Knob architecture investigation

The clean-room attempt reconstructed the interaction body from the required
contracts while reusing the public prop signature, semantic markup, formatter,
key table, math helpers and styling. One interaction ref owns the raw reset
value, keyboard flag and pointer transaction. `publish` centralizes changed
value publication and reset commits; `finishKey` owns keyboard completion;
`cancelPointer` owns pointer identity checks and rollback. Pointer-up retains
its own release-before-commit ordering. All 36 Knob behavior tests passed.

The retained optimization also sends all recognized keys through `stepKnob`.
Home/End's negative/positive infinite tick counts already reach `snapKnob`'s
endpoint clamps. This removes separate endpoint branches while preserving true
bounds, non-dividing steps, fine adjustments, and numeric lookup guards against
inherited-property keys. No public types or math helpers changed.

Five drag values still have independent roles:

- `id` rejects events from other pointers.
- `y` supports incremental deltas and changing fine mode during a drag.
- `fraction` retains unsnapped movement between pointer events.
- `original` supports cancellation and changed-value commit detection.
- `latest` preserves the last proposed value even if a controlled parent does
  not echo it, or pointer completion occurs without another render.

Replacing latest with a derivation from fraction also needs the most recent
fine-step state and must account for changed bounds; it is not a free deletion.
Reset validation covers a separate consumer input from value/range validation.
The raw mount default must survive later bounds expansion.

| Experiment                                                                       | Knob raw / gzip / Brotli | Decision                                   |
| -------------------------------------------------------------------------------- | ------------------------ | ------------------------------------------ |
| Task start                                                                       | 5,274 / 2,334 / 2,073    | Reference                                  |
| CSS: square aspect ratio, omit blockified display and unpainted indicator radius | 5,200 / 2,335 / 2,078    | Rejected; compressed output worsens        |
| Above plus shared keyboard completion and changed-result return                  | 5,193 / 2,342 / 2,072    | Rejected; gzip worsens                     |
| Original CSS plus one interaction ref for reset/drag/keyboard state              | 5,262 / 2,344 / 2,078    | Rejected; compressed output worsens        |
| Existing math handles Home/End bounds                                            | 5,253 / 2,323 / 2,059    | Kept in reconstruction                     |
| Reconstructed publication/state/cancellation paths                               | 5,242 / 2,324 / 2,068    | Refined to remove unused completion branch |
| Reconstruction with cancellation-only helper                                     | 5,171 / 2,303 / 2,039    | Kept                                       |
| Above plus non-rendering CSS removal                                             | 5,139 / 2,299 / 2,039    | Final                                      |

The combined CSS/completion-path candidate and both reconstructed candidates
were tested with the 36 Knob unit tests, which passed. The single-ref alternative was measured but not
separately behavior-tested after its compressed-size loss. The prior shared
pointer-release experiment was not repeated.

The CSS review covered preset/custom variable precedence, hidden handling,
focus, disabled state, dial/indicator geometry, readout and forced colors.
Using aspect ratio removed raw repetition but compressed worse. The final CSS retains both explicit diameter dimensions but removes the dial's
redundant block display (the flex container blockifies it) and the indicator's
unpainted, non-clipping border radius. Twenty-four Chromium screenshot pairs
match the original exactly across four sizes, three focus/disabled states and
two forced-colors settings. CSS falls from 1,407 / 612 / 507 to
1,375 / 608 / 507 bytes.

### Feature counterfactuals after the retained optimization

These are isolated builds of the reconstructed implementation with features
removed or restored. They keep the current dependencies and build configuration.
They are **not a reproduction of a historical release**.
The first row keeps current keyboard/commit fixes while omitting reset and sizing.

| Knob architecture                                    |   Raw |  Gzip | Brotli | Marginal raw / gzip / Brotli |
| ---------------------------------------------------- | ----: | ----: | -----: | ---------------------------- |
| Historical-equivalent core, with current fixes       | 4,568 | 2,148 |  1,898 | —                            |
| + reset, retaining a mount-snapped default           | 4,956 | 2,251 |  1,985 | +388 / +103 / +87            |
| + bounds-safe reset, retaining the raw mount default | 4,947 | 2,249 |  1,984 | -9 / -2 / -1                 |
| + sizing/custom diameter                             | 5,139 | 2,299 |  2,039 | +192 / +50 / +55             |
| Full current contract                                | 5,139 | 2,299 |  2,039 | 0 / 0 / 0                    |

Bounds-safe reset is smaller in this controlled comparison because it removes
initial snapping. It must not be described as an inherent size regression.
Reset/sizing together account for +571 / +151 / +141 bytes in these variants.
This attributes intentional costs in the current architecture; it does not
prove another architecture cannot implement them more cheaply.

**A Knob floor is not proven.** The reconstruction, marginal feature builds,
behavior checks and separate CSS review establish costs in the measured
architectures. They do not provide a lower bound on all equivalent
implementations. Further interaction representation changes could still reduce
the remaining 232 / 77 / 83 bytes. The evidence supports attribution to reset
and sizing in these architectures, not declaring the historical gate impossible.

## Compatibility, validation and scope

Retained changes affect only `Checkbox.css.ts`, `Knob.tsx`, `Knob.css.ts`, and
this audit. Pre-existing changes in Knob and the rest of the
working tree were preserved. No API/type changes or assertion weakening occurred.
Native checked/uncontrolled/form/ref behavior remains covered by Checkbox tests;
Knob reset, capture, cancellation, controlled values and key-release behavior
remain covered by existing tests. Final diff was compared with task-start copies.

Checks actually executed on retained production changes:

- Targeted Checkbox/DataTable/Knob tests: 73 passed before the final endpoint
  change; targeted Knob tests after that change: 36 passed.
- Final React package tests: **380 passed across 78 files** after reconstruction.
- React package Vite/declaration build: passed.
- `pnpm lint`: passed.
- `pnpm typecheck`: passed.
- `pnpm bible:check`: passed, 74 applicable rules in 817 files.
- Chromium built-public-export consumer tests: **5 passed** (DataTable selection,
  focus/windowing, public Checkbox styling, Knob pointer cancellation, numeric
  controls, preset/custom sizes and reset commits).
- Chromium axe previews: **6 passed**, Checkbox/DataTable/Knob in light and dark.
- Direct Chromium comparison: identical original/final native dimensions,
  border-box, invalid/focused appearance in normal and forced-colors modes.
- `pnpm size`: **failed**, all three regression metrics for DataTable, Knob,
  Slider and Fader. 70 components checked; chained icon check was not reached.

Chromium initially failed to launch inside the sandbox with an OS permission
error. The same comparison and requested browser suites passed outside it.
This was an infrastructure failure, not a failed browser assertion.

`pnpm format:check` passed; the amended report also passed targeted Prettier verification. Full
repository verification, full browser matrix, Storybook and runtime performance
measurements were not run. Task-owned size gates still fail; no baseline was
regenerated or accepted. Chromium coverage does not constitute screen-reader
or cross-browser certification.

Slider and Fader were not edited. Their source directories were also compared
with the isolated source copy. Their still-visible sizes remain respectively
3,324 / 1,159 / 975 and 3,580 / 1,260 / 1,056 bytes. Size policy files remain
unchanged, and no lockfile or dependency edits were made by this pass.

## Next decision

Keep the existing gates. These measurements do not justify accepting a new
baseline. Remaining work is a stronger minimum-Checkbox/core-representation investigation
with the diagnostic consumer contract actually exercised, and further Knob
interaction representation work beyond the reconstruction measured here. Only then can the requested floor decision be made.

**INCOMPLETE — viable optimization avenues remain**

## Reviewed feature-growth acceptance — 2026-09-15

This decision supersedes the preceding request for further floor investigation.
Acceptance is justified by intentional reviewed feature growth after optimization,
not a mathematical architectural floor or impossibility of further optimization.

DataTable's approximate pre-Checkbox core is **8,372 / 3,650 / 3,224** bytes,
below its historical **8,506 / 3,693 / 3,265** baseline in all three metrics.
The accepted growth is attributable to public Flux Checkbox row-selection support.
Knob's measured historical-equivalent core is **4,568 / 2,148 / 1,898** bytes,
below its historical **4,810 / 2,178 / 1,917** baseline. Its accepted growth is
attributable to reset (including bounds-safe reset) and sizing/custom-diameter
requirements. Both components were optimized before acceptance; the detailed
counterfactual measurements and their limitations above remain evidence.

Production rebuild and targeted review selected exactly `data-table,knob`:

| Entry     | Previous raw / gzip / Brotli | Accepted raw / gzip / Brotli | New regression ceilings raw / gzip / Brotli |
| --------- | ---------------------------- | ---------------------------- | ------------------------------------------- |
| DataTable | 8,506 / 3,693 / 3,265        | 9,459 / 3,996 / 3,533        | 9,649 / 4,076 / 3,604                       |
| Knob      | 4,810 / 2,178 / 1,917        | 5,139 / 2,299 / 2,039        | 5,242 / 2,345 / 2,080                       |

The explicit acceptance commands are:

```bash
pnpm size:baseline:review -- --components=data-table,knob
pnpm size:update -- --components=data-table,knob
```

Absolute budgets and the existing 2% regression policy with byte floors remain
unchanged. Targeted acceptance updates only the two selected bundled objects.
All unrelated component baselines, emitted diagnostics, aggregate baselines,
schema/budget versions and bundling-method metadata remain unchanged. Slider
and Fader were deliberately not accepted; their failures remain release blockers.
Checkbox passes its existing baseline without acceptance.

Acceptance validation: `pnpm size:test` passed all 30 tests, including six new
selection/preservation/safety tests; `pnpm terminal:test` passed all 13 tests.
The initial sandbox run could not return subprocess fixture output correctly;
size and terminal tests passed outside the sandbox without weakening assertions.
Targeted review and update both exited 0, measuring two bundled entries and all
70 emitted graphs/global aggregates. Programmatic deep comparison and reversal
of only the selected JSON values reproduced the original baseline file byte for
byte, including unrelated whitespace. The final diff changes only DataTable and
Knob bundled measurements and their JS/CSS breakdowns.

Normal `pnpm size` exited 1: DataTable, Knob and Checkbox pass; only Slider and
Fader fail, each in raw/gzip/Brotli regression metrics. No absolute-budget or
aggregate failure was reported. `pnpm check:full` passed generated-file, docs,
dogfood, formatting, package-build, lint, typecheck, Knip, all test, and docs-build
stages before stopping on those same two size failures. `pnpm bible:check`
passed separately (74 applicable rules). Later release-size, Storybook, browser,
performance-smoke and built-consumer stages were not reached. No component,
budget, icon baseline, dependency or lockfile changes were made in this acceptance
pass; the existing component edits remain intact.
