# Reviewed size acceptance — 2026-09-14

> **Historical report.** This records a prior snapshot, not current behavior or release readiness. Consult current engineering documentation and executed checks.

This records two separately authorized acceptance decisions, not new absolute
budgets or extra headroom. The existing optimized Field/Tabs implementations
were preserved. No component implementation or packaging policy changed.
Complete old/new records, including JS/CSS breakdowns, diagnostic emitted graphs,
file counts and checksums, are in [the measurement evidence](size-acceptance-2026-09-14.json).

## A. Field and Tabs

Accept the reviewed cost of composition and initial SSR associations in Field,
and collection recovery, keyboard entry and focus preservation in Tabs.
Root-owned slots and wrapped-part registration serve different association
requirements. Tabs must recover unavailable items without overriding controlled
authority or stealing outside focus. Reverting these repairs to recover bytes
would remove required behavior. The preceding optimization review was read;
this acceptance does not restart that optimization exercise.

| Bundled entry | Old raw / gzip / Brotli | Accepted raw / gzip / Brotli | Files |
| ------------- | ----------------------- | ---------------------------- | ----- |
| Field         | 2868 / 1252 / 1099      | 3037 / 1426 / 1254           | 2 → 2 |
| Tabs          | 5092 / 2199 / 1891      | 6452 / 2746 / 2394           | 2 → 2 |

The bundled-entry method remains unchanged, with React peers external.
Diagnostic emitted-graph totals are also captured in the two records; they are
not the component gate or the arithmetic used to attribute aggregate growth.

## B. Catalog aggregates

Accept the separately reviewed 70-component catalog snapshot, including prior
hardening, eight additions, existing-component repairs, exports, declarations
and maps. These totals use compression per emitted file. The three aggregate
views overlap and must not be added together.

| Aggregate | Old raw / gzip / Brotli  | Accepted raw / gzip / Brotli | Files     |
| --------- | ------------------------ | ---------------------------- | --------- |
| rootEntry | 4619 / 1543 / 1352       | 5275 / 1734 / 1520           | 1 → 1     |
| runtime   | 164731 / 76322 / 65365   | 199901 / 92508 / 79379       | 198 → 225 |
| published | 951639 / 313646 / 269402 | 1099160 / 374699 / 322302    | 815 → 925 |

The previous aggregate review distinguished stored-baseline revision
`e0443a84ef095e191616fe0c528aec0c538d30b5` from immediate pre-expansion HEAD
`bb9acae3a639009b1d9779674f432dce1dc5c294`. Prior hardening accounts for
2090 / 1043 / 944 runtime bytes and 9862 / 4283 / 3627 published bytes.
The expansion and repairs account for the remaining 33080 / 15143 / 13070
runtime bytes and 137659 / 56770 / 49273 published bytes. The eight additions'
exclusive runtime files contribute 30489 raw bytes. Declaration and map costs
remain included; no files were removed to manipulate totals.

## Provenance and safeguards

- Starting HEAD: `bb9acae3a639009b1d9779674f432dce1dc5c294`, with the user's
  pre-existing repaired working tree, including eight untracked components.
- Node 24.21.0; pnpm 10.34.5; React/React DOM 19.2.8; Vite 8.2.2;
  TypeScript 5.9.3; esbuild 0.28.2; Vanilla Extract CSS 1.21.2;
  Vanilla Extract Vite plugin 5.2.6; CSS injection plugin 2.2.2;
  zlib 1.3.2.1-motley-8002e91; Brotli 1.2.0.
- Before acceptance, all tracked and nonignored untracked files were inventoried
  with SHA-256 hashes. Inventory checksum:
  `f523664d0fc89cddb6241c3f7074aba2f5771565122a12545961f0f0d3691288`.
- The starting baseline was saved with exclusive creation and read-only mode at
  `/tmp/flux-acceptance-20260914/baseline.start.json`; inventory, installed
  toolchain listing, fresh measurement output and command logs accompany it.
- Starting baseline SHA-256:
  `2d43f52b4e32026f00310438bd1ad295f2979c6380ab275fae6674a2f3548872`.
- Accepted baseline SHA-256:
  `34f9c43df5834cf9a0ae209f1596a09a87e2f4e74e43db5edb1bc9c85a00be1c`.
- Existing `aggregate-review.md`, `Field-Tabs-review.md` and `verification.md`
  in `.cache/size-review-2026-09-14-oud4i1u1` were read before acceptance.
  That review's package/tooling source manifest checksum is
  `a56ede308a9437cab8d79cfd62a000e2085afc254402c4f92e71b397dee91a9a`.
- Production packages built successfully before the unchanged size checker
  produced fresh JSON. All five reviewed totals and aggregate file counts
  reproduced exactly. The pre-acceptance gate failed the expected regressions.
- A guarded script verified the starting bytes, reviewed totals, record schemas,
  unchanged external peers and every other inventoried file except the two
  authorized browser tests before writing only the authorized measurements.
  No whole-catalog updater or baseline-acceptance command was run.
- Deep comparisons preserve all 68 other records, including AlertDialog,
  Combobox, DropdownMenu, InputGroup, Popover, Tag, Toast and Tooltip.
  Inventory remains exactly 70. Names, classifications, unrelated top-level
  metadata, budgets, tolerances, regression policy, measurement/coverage code,
  release/trust validation, dependencies and lockfile remain unchanged.

## Separate documentation test repairs

The Install page intentionally became consumer-first. The old test still
expected “Package shape,” “Daily development” and “Add a component,” although
consumer package guidance and contributor commands now appear in four current
sections on the same page. The test now checks those meaningful headings,
retains the minimum 15px following-content gap, and checks actual candidate
installation, development and scaffolding commands in named code regions.
No documentation UI changes or selector-only headings were needed.

The export test attempted to use “View source” before opening the initially
closed composition inspector. It now verifies that control is initially hidden,
opens “Inspect composition,” verifies source controls become visible, selects
the helper source and package manifest, and retains the recipe ZIP download
filename assertion. No hidden-role lookup, delay or default-state change was
introduced.

## Verification

Focused ESLint passed. The two repaired browser files passed all 10 tests.
The first sandboxed browser attempts could not start the local server; direct
preview startup identified `listen EPERM` on 127.0.0.1:4173. The permitted run
passed without configuration changes.

The initial `pnpm check:full` attempt stopped at generated-file validation:
`health.ts` mirrors the accepted baseline. `pnpm generate` refreshed only its
Field/Tabs diagnostic values and the three aggregates; the starting user-owned
health snapshot was retained for comparison. This required generated surface
is separate from the two browser repairs. No generator code changed.

A second attempt stopped at format validation before builds/tests: the guarded
JSON serialization needed the repository formatter. Formatting changed no JSON
values; the accepted checksum above reflects the formatted bytes.

The final `pnpm check:full` run exited 0. Its exact constituent commands ran
against the accepted baseline and regenerated health snapshot; their successful
results are reused here instead of repeating the suite.

| Command                                 | Final result                                                                   |
| --------------------------------------- | ------------------------------------------------------------------------------ |
| `pnpm check:full`                       | Exit 0; all six stages passed                                                  |
| `pnpm build:packages`                   | Passed before authoritative size checks and within the final pipeline          |
| `pnpm generate:check`                   | Passed                                                                         |
| `pnpm docs:check`                       | Passed                                                                         |
| `pnpm dogfood:check`                    | Passed                                                                         |
| `pnpm format:check`                     | Passed                                                                         |
| `pnpm lint`                             | Passed                                                                         |
| `pnpm typecheck`                        | Passed                                                                         |
| `pnpm knip`                             | Passed                                                                         |
| `pnpm test`                             | Passed complete top-level test chain; no failing or skipped test summaries     |
| `pnpm build`                            | Passed production packages and docs build                                      |
| `pnpm size`                             | Passed normal component/aggregate gates and icon size gate                     |
| `pnpm bible:check`                      | Passed                                                                         |
| `node tooling/size/check.mjs --release` | Passed; all 70 components checked                                              |
| `pnpm storybook:build`                  | Passed                                                                         |
| `pnpm test:e2e`                         | Passed complete configured Chromium docs/browser suite, including both repairs |
| `pnpm perf:smoke`                       | Passed                                                                         |
| `pnpm consumer:check`                   | Passed package builds, built-consumer typecheck and browser checks             |
| Focused two-file browser run            | 10 passed                                                                      |
| Targeted two-file ESLint                | Exit 0                                                                         |
| Final `git diff --check`                | Exit 0                                                                         |

The final pipeline's check stage took 76.8s, release size 3.6s, Storybook 4.4s,
docs/browser suite 317.3s, performance smoke 6.4s and consumer verification 20.3s.
The full command log is `/tmp/flux-acceptance-20260914/check-full-complete.log`.
Final comparison against the starting inventory permits only the baseline,
two browser tests and generated health snapshot; every other starting file is
byte-identical. In particular, 54 policy, measurement, validation and dependency
files remain byte-identical. The two new engineering evidence documents contain
the acceptance and final results. No staging, commits, branches or publication
were performed.

Non-failing output included React test-environment `act(...)` warnings, Vite's
large-chunk advisory and conflicting terminal color-variable warnings. No gates
or warnings were suppressed. There are no remaining required gate failures.
After this results-only documentation update, the two report files were checked
with Prettier and the final diff/preservation checks were repeated; production
source, tests and baseline were unchanged from the passing pipeline.

Full `pnpm perf`, `pnpm verify:all`, packed-candidate `pnpm consumer:packed`,
package publication and full release verification were not run. Performance
smoke is not a full performance run. The docs suite uses its configured Chromium
project; it does not establish broader browser support beyond the actual
built-consumer configuration. No claim of completed release verification is made.
