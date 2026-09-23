# Overflow aggregate attribution — evidence only

> **Historical report.** This records a prior snapshot, not current behavior or release readiness. Consult current engineering documentation and executed checks.

No baseline acceptance is authorized or performed by this report.

## Control and reproducibility

The immediate pre-Overflow control is `93ec029a79ace8fd2eee07dba2b61f310ff5edcc`
(HEAD). It has 70 component baseline entries, no Overflow entry/source, and the
exact accepted aggregate values below. Its lockfile and workspace file match the
checkout byte-for-byte. The working tree contains 71 public components.

**The control does not rebuild to the accepted aggregate.** Therefore the entire
accepted-baseline-to-current increase is not cleanly attributable to Overflow.

Two independent isolated comparisons produced identical aggregate inventories
(including SHA-256 hashes for every published file), component rows, and gate
results. This establishes repeatability under the installed toolchain, not
reproduction of the historical measurement environment. Node was v24.21.0, zlib
1.3.2.1-motley-8002e91, gzip level 9, Brotli quality 11.

The parent commit also records the same aggregate, while HEAD changes existing
production components (including Tabs, Knob, Slider, DataTable and others) and
retains those aggregates. Its lockfile and workspace file differ from the current
checkout. No parent build was attempted with mismatched dependencies. This is
evidence of a carried-forward historical baseline; the exact split between earlier
source changes and historical toolchain effects remains unresolved. Raw-byte and
file-count differences show this is not merely compression variation.

## Exact aggregate evidence

All tuples are **raw / gzip / Brotli / fileCount**, in bytes except fileCount.
Root entry is already included in runtime; runtime is already included in published.

| Set        | Accepted baseline               | Isolated base                   | Isolated current                | Base → current delta          |
| ---------- | ------------------------------- | ------------------------------- | ------------------------------- | ----------------------------- |
| Root entry | 5275 / 1734 / 1520 / 1          | 5299 / 1741 / 1532 / 1          | 5394 / 1775 / 1560 / 1          | +95 / +34 / +28 / 0           |
| Runtime    | 199901 / 92508 / 79379 / 225    | 202964 / 93276 / 80056 / 225    | 209067 / 96000 / 82350 / 229    | +6103 / +2724 / +2294 / +4    |
| Published  | 1099160 / 374699 / 322302 / 925 | 1111499 / 379007 / 325863 / 929 | 1137485 / 389791 / 334996 / 947 | +25986 / +10784 / +9133 / +18 |

Accepted baseline → isolated base discrepancies:

- Root: +24 / +7 / +12 / 0.
- Runtime: +3063 / +768 / +677 / 0.
- Published: +12339 / +4308 / +3561 / +4.

Accepted baseline → current remains +9166 / +3492 / +2971 / +4 runtime,
and +38325 / +15092 / +12694 / +22 published.

## Every changed runtime file

Paths are relative to `packages/react/dist`. A dash means absent.

| Path                                    | Base raw / gzip / Brotli | Current raw / gzip / Brotli |
| --------------------------------------- | ------------------------ | --------------------------- |
| `assets/Overflow.css`                   | —                        | 489 / 253 / 183             |
| `chunks/Overflow-B-dwskkN.js`           | —                        | 5278 / 2138 / 1857          |
| `chunks/overflowCapability-BwkmyGl9.js` | —                        | 189 / 163 / 128             |
| `overflow.js`                           | —                        | 82 / 89 / 78                |
| `chunks/Tabs-sphbpjxV.js`               | 5018 / 2049 / 1794       | —                           |
| `chunks/Tabs-Di22a8jK.js`               | —                        | 4988 / 2096 / 1811          |
| `index.js`                              | 5299 / 1741 / 1532       | 5394 / 1775 / 1560          |
| `tabs.js`                               | 74 / 85 / 75             | 74 / 85 / 78                |

There are five added paths, one removed path, and two changed same-path files.
All other runtime files have identical hashes. The Tabs source maps on both sides
list the same four source modules: Tabs.css.ts, TabsContext.ts, TabsList.tsx,
and Tabs.tsx. Source inspection identifies the TabsList integration change; this
pairing is not inferred solely from hashed filenames.

Select is already a shared chunk in the base. Its entry, CSS, and chunk remain
byte-identical: `select.js` 78 / 87 / 74, `assets/Select.css` 624 / 323 / 268,
`chunks/Select-BH_vs6zF.js` 469 / 303 / 260. Overflow imports that existing chunk.
There is no measurable Select reshaping/duplication increase in this comparison.

## The earlier remainder

The four newly added Overflow-named files total **6038 / 2643 / 2246**.
The earlier **3128 / 849 / 725** remainder is exactly:

| Contributor                                    |   Raw | Gzip | Brotli |
| ---------------------------------------------- | ----: | ---: | -----: |
| Accepted baseline → rebuilt pre-Overflow state | +3063 | +768 |   +677 |
| Root export output                             |   +95 |  +34 |    +28 |
| Tabs chunk replacement                         |   -30 |  +47 |    +17 |
| Tabs entry hash-reference change               |     0 |    0 |     +3 |
| Total                                          | +3128 | +849 |   +725 |

Thus **65 / 81 / 48** of that remainder is Overflow-related emitted output;
**3063 / 768 / 677** predates the working-tree task relative to the accepted
baseline. The capability chunk is already counted among the four new files and
must not be counted twice. No unrelated current production source changes were
found. No build nondeterminism was observed. Historical toolchain contribution
cannot be excluded or quantified from the available compatible control.

These are exact file-level contributions, not semantic compression attribution.
For example, the Tabs chunk delta includes minifier naming, import changes, and
compression effects; assigning each compressed byte to a particular statement
would be unjustified.

## Published-package reconciliation

| Contributor                                  | Raw delta | Gzip delta | Brotli delta | File-count delta |
| -------------------------------------------- | --------: | ---------: | -----------: | ---------------: |
| Runtime union above                          |     +6103 |      +2724 |        +2294 |               +4 |
| Overflow JavaScript source map               |    +14619 |      +4866 |        +4248 |               +1 |
| Capability JavaScript source map             |      +876 |       +479 |         +371 |               +1 |
| Overflow declarations and declaration maps   |     +2703 |      +1870 |        +1532 |              +10 |
| Capability declarations and declaration maps |     +1230 |       +685 |         +553 |               +2 |
| Tabs JavaScript source-map replacement       |       +83 |        +51 |          +53 |                0 |
| TabsList declaration and declaration map     |      +301 |       +102 |          +79 |                0 |
| Root declaration and declaration map         |       +71 |         +7 |           +3 |                0 |
| Total                                        |    +25986 |     +10784 |        +9133 |              +18 |

Full reports retain exact per-file metrics and hashes on both sides, plus sorted
added/removed/changed paths. No semantic-equivalence matcher was introduced.

## Production source scope

Tracked diff plus untracked-file inventory against the chosen SHA:

- New Overflow implementation: `Overflow.tsx`, `useOverflowItems.ts`,
  `Overflow.css.ts`, `Overflow.types.ts`, `index.ts` under
  `packages/react/src/components/Overflow/`.
- Discovery metadata: `components/Overflow/component.meta.json`.
- Intentional existing-component integration: `components/Tabs/TabsList.tsx`.
- Shared internal helper: `internal/overflowCapability.ts`.
- Generated public export: `packages/react/src/index.ts`.
- No unrelated production React source changes. React package metadata,
  lockfile, workspace file, and package build configuration are unchanged from
  the chosen base.

Overflow tests, stories, benchmarks, docs, consumer fixtures, and tooling changes
are not React runtime drift. Existing user-owned changes were preserved.

## Tool changes and validation

`tooling/size/compare.mjs` now records aggregate measurements for both snapshots
and prints a text comparison after component rows. Its focused helper,
`compare-aggregate.mjs`, uses the authoritative size-library functions and records
content hashes to detect same-size content changes. `compare.test.mjs` covers exact
integer deltas, relative inventories, equal-size changes, JSON/text CLI output,
baseline preservation, isolated build writes, redirected workspace links, and
rejection of a mismatched lockfile using fixtures/stub builds.

Executed:

- `pnpm size:test`: 32 tests passed. Initial sandbox run disrupted subprocess
  tests; the final run used normal subprocess execution outside that restriction.
- Targeted ESLint and Prettier: passed for all three changed JavaScript files.
- Targeted Coding Bible invocation: exited successfully but reported no supported
  source files in scope; this is not analyzer coverage of these `.mjs` files.
- Two isolated comparisons: builds succeeded and measurements matched exactly.
  All 71 individual bundled gates pass; the nine historical aggregate failures
  remain. The comparison command reports gate status separately from its own exit.
- `git diff --check`: passed. Baseline bytes match the pre-task saved copy.

Not run: full repository verification, browser/performance tests, separate
TypeScript check (only JavaScript tooling changed), or historical builds requiring
other dependencies. No checkout baseline update, budget/tolerance change,
installation, commit, push, branch operation, or acceptance-workflow change.
Existing size tests exercise baseline updates only inside their disposable fixtures.

Evidence artifacts for this session:

- `/tmp/flux-overflow-isolated-size.json` (initial pnpm banner removed to leave JSON).
- `/tmp/flux-overflow-isolated-size-repeat.json` (run with `pnpm --silent`).
- `/tmp/flux-overflow-emitted-evidence/{base,current}` (emitted files for inspection).

These temporary artifacts are not durable repository artifacts. The report above
preserves the conclusions and exact major contributions.

## Workflow gap and proposed separate follow-up

Adding a component initially makes live/baseline component counts differ, which
skips aggregate historical checks. Adding its bundled baseline restores equal
counts and reactivates those checks. Bundled baseline updates deliberately retain
aggregate baselines, while applicable aggregate failures block that same update.
There is no explicit aggregate review/acceptance operation.

A separate approved task could add an explicit aggregate review proposal and
acceptance operation, bound to measured source/toolchain identity and the previous
baseline, updating only aggregate fields after explicit approval. Keep ordinary
`size:update` behavior, budgets, and unrelated component baselines unchanged.
First resolve or explicitly review the pre-existing historical discrepancy; do not
silently roll it into an Overflow acceptance.
