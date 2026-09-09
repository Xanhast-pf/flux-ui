# Flux size contract

Flux treats consumer bytes as a release contract. This checker is deliberately
small and dependency-free: after the library build it only walks emitted ESM
imports and compresses files with Node's built-in gzip/Brotli implementations.
That keeps full-library checks practical even with thousands of components.

## Commands

```bash
pnpm size:update   # build packages + intentionally accept current measurements
pnpm size          # check the already-built dist (used by pnpm check)
pnpm size:changed  # build packages + check changed component regressions
pnpm size:release  # build packages + full check + stale-baseline protection
pnpm size:test     # checker unit tests
```

`tooling/size/baseline.json` is generated and committed. A new component has no
baseline, so `pnpm size` fails until its measured cost has been reviewed and
`pnpm size:update` is committed. Baseline updates never bypass the absolute
budget for the component's size class.

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

The checker also reports the union of all runtime files and all files that
would live under `packages/react/dist`. Source maps and declarations affect the
published-package metric but not individual runtime component cost.

## Regression policy

Absolute budgets prevent a component from becoming objectively heavy.
The checked-in baseline prevents gradual drift inside those ceilings. Current
component output may grow by at most 2%, with a tiny byte floor for very small
files. Meaningful growth requires an explicit baseline diff in the PR.

## Scaling model

The expensive part of library development should not grow linearly with CI
bundler invocations. Flux performs one normal multi-entry package build, then
size checks are filesystem + compression work. `size:changed` narrows local
feedback to touched component folders while release checks still verify the
entire public surface.

Future competitor benchmarks should live in a separate reproducible consumer
fixture. This core contract intentionally measures Flux itself and does not
hard-code marketing comparisons into package.json.
