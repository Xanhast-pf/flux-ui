# Development workflow

Use the versions in `.nvmrc` and root `package.json` (Node 24 and pinned pnpm).

```bash
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm --filter @flux-ui/docs exec playwright install chromium
pnpm dev
```

On a Linux machine missing browser system libraries, use Playwright's
`install --with-deps chromium` instead. `pnpm storybook` runs the isolated
component workbench. Source aliases make normal docs development independent of
an initial package build.

## Before opening a pull request

```bash
pnpm generate
pnpm format
pnpm verify:all
```

Review generated changes rather than committing arbitrary drift. `check` and
`check:fix` build package declarations before type-aware lint, because the public
consumer intentionally has no source aliases. Build packages before invoking
`lint` or `lint:fix` alone on a fresh checkout. `verify:all`
runs the commands behind `check` and `check:full`, continues independent checks
after a failure, and writes `.cache/verify-all/receipt.json`. A failed build blocks
size measurement so stale output is not accepted. The command still exits with
failure when any gate fails.

`pnpm consumer:check` rebuilds the packages and runs the public-export consumer
without docs aliases or CSS. It checks both type declarations and rendered styles.
The required CI Browser job also runs it before publishing Pages.

## Components and size baselines

```bash
pnpm component:new Example Layout primitive
pnpm component:doctor Example
pnpm generate
```

Implement the generated component, example, semantics, tests and benchmark;
scaffolding alone is not a finished component. Default examples must use public
Flux APIs for ordinary UI. See [dogfooding.md](dogfooding.md) for ownership rules.

Do not update a baseline to hide a behavior, accessibility, or unexplained size
regression. First inspect the emitted result and run the relevant tests. A new
family legitimately needs a first baseline after measurement. Existing category
budgets remain enforced during baseline updates.

```bash
pnpm size
pnpm icons:size
# Only after reviewing fresh measurements and accepting their changes:
pnpm size:update
```

`icons:size` and `icons:size:update` rebuild the icon package before measuring it.
`size` measures existing component output, so run the package build or the full
verification workflow before invoking it in isolation.

## Troubleshooting and review

A missing-baseline error is different from an absolute-budget failure. A new
workflow is not a passing receipt. Never check in `.cache`, dependency folders,
Playwright traces or local build outputs as source.

Changes to persistent navigation must preserve route state, panel scroll, normal
page interaction and explicit closing. Changes to compound styling need nested
examples. Changes to native hidden behavior need real visibility and focus tests,
not merely an attribute assertion. See [workshop.md](workshop.md) for the app's
route and consumer contracts, and [CONTRIBUTING.md](../CONTRIBUTING.md) for review
and contribution policy.
