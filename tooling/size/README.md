# Flux size contract

Flux treats consumer bytes as a release contract. This checker is deliberately
small and build-only: it uses the already-pinned TypeScript parser to walk emitted
ESM imports and compresses files with Node's built-in gzip/Brotli implementations.
It also measures standalone bundled entries using esbuild already installed with
the React package's Vite toolchain; no new dependency is required.

## Commands

```bash
pnpm flux size                  # check already-built dist + icon sizes (used by pnpm flux check)
pnpm flux size changed          # build packages + check changed components + icon sizes
pnpm flux size baseline review  # build packages + read-only bundled baseline proposal
pnpm flux size baseline accept           # build packages + explicitly update bundled baseline
pnpm flux size aggregate review # build packages + read-only aggregate proposal
pnpm flux size aggregate accept # build packages + accept aggregate only (approval required)
pnpm flux size release          # build packages + full check + stale-baseline protection + icon sizes
pnpm flux test size             # checker unit tests
pnpm flux size compare <base> [current-ref|working-tree] [--json] # isolated revision comparison
```

`pnpm flux size` uses existing production output; run `pnpm flux build packages` first
when checking source changes outside a workflow that already builds packages.
The review and update commands build current source before measuring selected entries (all entries by default).
Review is read-only with respect to baselines and source files; its build refreshes
package output. Only `pnpm flux size baseline accept` accepts and writes a bundled baseline.

`tooling/size/baseline.json` is committed. Schema version 2 keeps the legacy
component `raw`, `gzip`, `brotli`, and metadata fields as emitted-graph diagnostics
and adds `components[slug].bundled` with separate raw/gzip/Brotli measurements,
output breakdown and peers. Version 1 remains readable, but missing or malformed
bundled baselines fail the primary gate explicitly. Historical emitted values
are never used as bundled baselines.

### Full acceptance

Use when a deliberately reviewed change should accept all current bundled entries.
Review the proposed bundled baseline changes before explicitly accepting them:

```bash
pnpm flux size baseline review
# Only after explicit approval of the proposal:
pnpm flux size baseline accept
```

Both commands measure all entries with the same production methodology as the
normal check. The review checker writes nothing; both show exact before/after bundled values
(`baselineChanges` in JSON). Update intentionally accepts bundled regressions,
but still enforces unchanged absolute budgets and aggregate regression checks.
It preserves emitted values, aggregate baselines, removed entries and unrelated
metadata. It records the bundling method and writes deterministic JSON through
an exclusively created sibling file followed by atomic rename. Measurement or
gate failure leaves the original untouched. A pre-existing `.pending` file is
never overwritten. Updates cannot be combined with `--changed` or `--release`.
`pnpm flux size baseline accept` replaces the legacy combined update workflow: it now uses
`--update-bundled-baseline`, does not update icon baselines, and does not run
registry generation. The checker still rejects the legacy `--update-baseline`
flag. Icon baseline acceptance remains a separate explicit operation through
`pnpm flux size icons accept`. Release verification is unchanged.

### Targeted acceptance

Use explicit component slugs when only reviewed components should advance while
other regressions remain blocked:

```bash
pnpm flux size baseline review -- --components=data-table,knob
pnpm flux size baseline accept -- --components=data-table,knob
```

The list must contain known, unique slugs, with no empty entries or whitespace.
Input order does not affect selection; reports normalize selection by slug.
`--components` requires review or update, and cannot combine with `--changed` or
`--release`. Review and update are mutually exclusive. Acceptance never infers
selection from Git changes.

Only selected entries are bundled and included in `baselineChanges`.
`bundledEntryCoverage.measured` lists selected slugs; `unmeasured` lists every
other live slug, without zero-value placeholders. Every emitted graph and global
aggregate is still measured. Updates replace only selected `bundled` objects,
preserving all other component data, historical entries, aggregate baselines,
schema/budget versions and method metadata. Targeted acceptance requires schema 2
and matching bundling-method metadata, with existing selected bundled objects;
initial baseline or toolchain migration needs separate review. Targeted writes
replace only selected JSON values, preserving unrelated bytes including whitespace.
Validation, measurement, absolute-budget or applicable aggregate-gate failures
prevent writing. The same atomic writer is used for full and targeted acceptance.

Targeted acceptance does not change absolute budgets or regression tolerance,
does not update aggregate baselines, and does not hide unselected component
failures in normal `pnpm flux size`, which still checks every public entry.

## Size classes

Every component metadata file has a `sizeClass`. New components default to
`primitive`, the strictest class. Moving a component to a larger class is an
explicit code-review decision rather than a silent budget increase.

- `primitive`: wrappers, layout, visual primitives
- `overflow`: the measured native-picker capability (5,632 raw / 2,688 gzip / 2,304 Brotli maximum, including CSS)
- `interactive`: buttons, toggles, tabs and similar local interactions
- `overlay`: popovers, tooltips, menus and dialogs
- `composite`: multi-part coordinated widgets
- `data-heavy`: virtualization/search/data-intensive widgets

The exact byte limits live in `budgets.mjs`, not in component metadata.

## What is measured

For each public component entry the checker recursively follows emitted
relative JS/CSS imports and reports raw, gzip and Brotli bytes. This includes
shared runtime that the component actually pulls into a consumer graph.

Aggregate runtime measures the union of emitted runtime files, counting shared
files once; it is not the sum of standalone bundled entries. Its existing budgets
and applicable baseline regression gates remain enforced independently, including during
bundled baseline review and update. Neither command changes aggregate baselines.
The checker also reports all files that would live under `packages/react/dist`. Source maps and declarations affect the
published-package metric but not individual runtime component cost.

## Regression policy

Bundled-entry raw, gzip and Brotli values enforce both category budgets and
per-component baseline regressions. Numeric limits and tolerances are unchanged.
Emitted-graph deltas are diagnostic only. Aggregate accounting and thresholds are
unchanged; aggregate snapshots now carry independent applicability metadata. Absolute budgets prevent a component from becoming objectively heavy.
The checked-in baseline prevents gradual drift inside those ceilings. Current
component output may grow by at most 2%, with a tiny byte floor for very small
files. Meaningful growth requires an explicit baseline diff in the PR.

## Standalone bundled entries

Every discovered public `dist/<slug>.js` entry is independently rebundled
with the installed esbuild: browser ESM, ES2022, tree shaking, full minification,
no code splitting, no source maps or legal comments. All entry exports remain
live. Only reachable production modules participate; tests, stories and docs
are not entries. The existing graph validation runs before bundling, retaining
the same missing-import, graph-boundary and external-peer contract.

Output stays entirely in memory (`write: false`). One JS output and, when
needed, one bundled CSS output are compressed separately with the existing
gzip/Brotli settings and summed. CSS is included, including local `@import`
dependencies. No output is written to `dist`, source directories or temporary
build directories. Unsupported asset formats fail instead of being omitted.

The JSON report adds `bundledEntries` (raw/gzip/Brotli, JS/CSS breakdown,
file count and external peers) and `bundledEntryMethod` (bundler version and
settings). Existing `components` fields and aggregate metrics retain their
original meaning. Text output labels both measurements.

Bundled measurements require their own accepted baselines. Until migration,
`pnpm flux size` exits nonzero with explicit missing-bundled-baseline errors while
still displaying both measurement families and aggregate failures. JSON keeps
legacy `components`, adds the explicit `emittedGraphs` family, and reports
`componentGates` alongside `bundledEntries`. Text includes all three sizes and
deltas for each family and the bundled gate result.

Helper extraction no longer adds a separate compressed JS stream to the bundled
metric. This is standalone entry cost, not the incremental cost of importing
several components into an application. Shared code can be deduplicated in that
application. React peers remain excluded, not free.

The normal multi-entry package build is unchanged. Measurement performs one
in-memory consumer bundle per component, so it costs more than the graph walk.
Results depend on the pinned bundler version and settings, and use the existing
`dist`: they do not establish that build output matches current source.

## Complete graphs, explicit peers

A missing local JS/CSS dependency is an error, not a smaller component. Static
imports, reexports, literal dynamic imports and stylesheet `@import` edges are
followed. Root escapes and symlink escapes are rejected. Non-literal dynamic
imports cannot be measured and fail explicitly.

Bare React/ReactDOM peer imports are listed in the report but excluded from the
component metric. They still cost bytes in the application. New external engines
must be bundled or gain an independently reviewed/measured dependency contract;
externalizing an engine is not a way to pass a component budget.

Failure messages include exact bytes as well as rounded KiB, so a one-byte
regression is not printed as an inexplicable equal-looking comparison.

## Changed selection and historical comparisons

`--changed` retains the existing component-source selection rules. Only selected
entries are bundled; every emitted graph and aggregate is still measured as
before. Directory-prefix and selected-component sets avoid scanning all changed
paths for every component. JSON `bundledEntries` contains only actual measurements;
`bundledEntryCoverage.measured` and `.unmeasured` explicitly list the slugs in each
group. Text output reports both counts. An unmeasured entry has no zero placeholder.

Compare two source revisions with the current measurement implementation:

```bash
pnpm flux size compare e0443a84 working-tree
pnpm flux size compare e0443a84 working-tree --json > /tmp/flux-size-comparison.json
# An explicit current revision (for example HEAD) is also supported.
```

The command exports revisions into temporary directories. `working-tree` copies
tracked and non-ignored untracked files, preserving current edits and deletions.
It builds each copy with its own package scripts/configuration and source, then
measures both with the same currently loaded bundled-entry implementation and
installed toolchain. Installed third-party dependencies are reused; workspace
package links point into each temporary copy. Dependency lockfiles and workspace
configuration must match the installed checkout; otherwise comparison stops.
No dependencies are installed, Git worktrees registered, or baselines updated.
Temporary copies and build outputs are removed on success or failure.

Both sides use the same explicit React/ReactDOM externals, bundler options, and
Node compression implementation. Each graph still validates its actual peers.
The table includes all components, with absent entries represented explicitly.
JSON includes exact bundled JS/CSS and emitted-graph measurements, tool versions,
and current size-gate results (`sizeCheck`). A failing size gate is reported with status
and diagnostics; it does not invalidate a successfully measured comparison.
The historical bundled values never come from `baseline.json`: that file is used
only to identify separate emitted-graph diagnostic regressions.

## Aggregate snapshot review and acceptance

Component bundled baselines and aggregate snapshots are separate contracts.
Accepting a new component never implicitly accepts package-wide growth. Aggregate
applicability uses its own `componentCount` and `method`, never the number of
component baseline entries (which may include newly accepted or removed entries).

```bash
pnpm flux size aggregate review
# Only after explicit human approval of the measured proposal:
pnpm flux size aggregate accept
```

Both commands use the authoritative `build:packages` path before measuring all
live components and the same aggregate definitions as the normal checker. A
failed build stops the command; direct checker flags assume production output
has already been built, just like the existing bundled baseline flags. Graph
validation rejects missing/invalid modules and unaccounted imports.

Review is read-only with respect to source and baselines; building refreshes
package output. It prints exact baseline/current/delta tuples for raw, gzip,
Brotli and file count, plus the snapshot component count. The result is explicitly
**a proposal, not acceptance**. Legacy snapshots have an unknown component count;
review never attributes them to the current catalog. Task-specific attribution
remains in `docs/overflow-aggregate-attribution.md`, separating the historical
discrepancy from the isolated Overflow addition.

Review and update enforce all individual bundled budgets and regressions,
including missing/malformed component baselines, and all absolute aggregate
budgets. Only aggregate historical regression/applicability is suspended for this
explicit review or acceptance. Malformed aggregate metrics or metadata fail
safely. Any measurement or gate failure prevents acceptance. Neither command can
combine with the other, bundled review/update, `--components`, `--changed`, or
`--release`. Absolute budgets and regression tolerances are never changed.

The snapshot stores `componentCount` and `method`: aggregate schema version 1,
gzip level 9, Brotli quality 11, the versioned Flux production package build
contract, root `dist/index.js`, the JS/MJS/CJS/CSS runtime union, all dist files
for the published union, and per-file compression/summing. The method version
must advance when build/measurement semantics change. It excludes Git IDs,
timestamps and machine paths. The top-level baseline schema is unchanged.

Normal and release checks fail on absent, legacy, malformed or stale snapshot
metadata. An applicable snapshot enforces the existing historical regression
policy. Staleness never counts as a passed historical check. Component baseline
review/update reports stale aggregate metadata separately, allowing the component
contract to be accepted first; it still blocks malformed aggregate state,
absolute aggregate failures and applicable aggregate regressions. Normal/release
quality remains red until aggregate review and explicit acceptance follow.

Aggregate update recomputes live measurements and replaces only the aggregate
JSON value, preserving every unrelated byte, component baseline and bundled-entry
method. It validates the aggregate-only proposal, writes an exclusive `.pending`
sibling, syncs and atomically renames it. Failure leaves the original untouched;
a pre-existing `.pending` is never overwritten. Update requires an existing
aggregate property; an entirely missing property needs separate repair. Legacy
values migrate on explicit acceptance only. No icon/performance baselines or
component registries are updated. Component baseline updates never alter
aggregate values, and aggregate updates never alter component baselines.

## Docs production chunks

`pnpm flux build docs` checks emitted JavaScript with
`tooling/size/docs-chunks.mjs` after Vite succeeds. The aggregate build delegates
here, so both `pnpm flux check` and `pnpm flux check full` enforce this policy.
Focused unit tests do not rebuild docs.

Normal docs chunks are capped at **500,000 raw bytes**, preserving Vite's decimal
500 kB protection and staying below 500 KiB. The only exception is the separate
`axe-core` module used by the Accessibility page's live scan. Its 4.13.0 build is
586,951 bytes; its hard ceiling is **600,000 bytes** (13,049 bytes / 2.22% headroom).
This single large engine module is already isolated; arbitrary vendor grouping
would not divide its implementation usefully. The live scan stays available in
production and imports the engine only when requested.

The build emits `.vite/docs-chunks.json` using final bundler module/import metadata,
without source maps. Classification uses the `node_modules/axe-core/` module path,
not a filename or hash, and forbids unrelated modules in the exception. The checker
measures actual asset bytes, accounts for every JavaScript asset, requires exactly
one axe chunk, and rejects entry/static dependencies on axe (even from lazy routes).
Axe must have an emitted dynamic import boundary and remain outside the initial
entry's transitive static graph. Synthetic graph tests cover these failure modes.

Vite's generic warning limit is 600 kB only to avoid duplicate noise for this
bounded optional engine. This does not change component, icon, aggregate or
runtime-performance budgets or baselines.
