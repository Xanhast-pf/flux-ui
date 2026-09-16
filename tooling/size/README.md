# Flux size contract

Flux treats consumer bytes as a release contract. This checker is deliberately
small and build-only: it uses the already-pinned TypeScript parser to walk emitted
ESM imports and compresses files with Node's built-in gzip/Brotli implementations.
It also measures standalone bundled entries using esbuild already installed with
the React package's Vite toolchain; no new dependency is required.

## Commands

```bash
pnpm size                  # check already-built dist + icon sizes (used by pnpm check)
pnpm size:changed          # build packages + check changed components + icon sizes
pnpm size:baseline:review  # build packages + read-only bundled baseline proposal
pnpm size:update           # build packages + explicitly update bundled baseline
pnpm size:release          # build packages + full check + stale-baseline protection + icon sizes
pnpm size:test             # checker unit tests
pnpm size:compare <base> [current-ref|working-tree] [--json] # isolated revision comparison
```

`pnpm size` uses existing production output; run `pnpm build:packages` first
when checking source changes outside a workflow that already builds packages.
The review and update commands build current source before measuring selected entries (all entries by default).
Review is read-only with respect to baselines and source files; its build refreshes
package output. Only `pnpm size:update` accepts and writes a bundled baseline.

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
pnpm size:baseline:review
# Only after explicit approval of the proposal:
pnpm size:update
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
`pnpm size:update` replaces the legacy combined update workflow: it now uses
`--update-bundled-baseline`, does not update icon baselines, and does not run
registry generation. The checker still rejects the legacy `--update-baseline`
flag. Icon baseline acceptance remains a separate explicit operation through
`pnpm icons:size:update`. Release verification is unchanged.

### Targeted acceptance

Use explicit component slugs when only reviewed components should advance while
other regressions remain blocked:

```bash
pnpm size:baseline:review -- --components=data-table,knob
pnpm size:update -- --components=data-table,knob
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
failures in normal `pnpm size`, which still checks every public entry.

## Size classes

Every component metadata file has a `sizeClass`. New components default to
`primitive`, the strictest class. Moving a component to a larger class is an
explicit code-review decision rather than a silent budget increase.

- `primitive`: wrappers, layout, visual primitives
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
and baseline regression gates remain enforced independently, including during
bundled baseline review and update. Neither command changes aggregate baselines.
The checker also reports all files that would live under `packages/react/dist`. Source maps and declarations affect the
published-package metric but not individual runtime component cost.

## Regression policy

Bundled-entry raw, gzip and Brotli values enforce both category budgets and
per-component baseline regressions. Numeric limits and tolerances are unchanged.
Emitted-graph deltas are diagnostic only. Aggregate accounting and gates are
unchanged. Absolute budgets prevent a component from becoming objectively heavy.
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
`pnpm size` exits nonzero with explicit missing-bundled-baseline errors while
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
pnpm size:compare e0443a84 working-tree
pnpm size:compare e0443a84 working-tree --json > /tmp/flux-size-comparison.json
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
