# Development workflow

Contributors need **Node 24+** and **pnpm 10.34.5**.
No additional system task runner is required.

```bash
pnpm install --frozen-lockfile
pnpm flux doctor
pnpm flux dev
```

`pnpm flux dev` starts the docs app; `pnpm flux dev storybook` starts the isolated component
workbench. Both are long-running servers. Source aliases avoid an initial build.
Run `pnpm flux` for the small command menu, or `pnpm flux check --help`, `pnpm flux test --help`,
`pnpm flux component --help`, `pnpm flux size --help`, `pnpm flux perf --help`, `pnpm flux release --help`
and `pnpm flux maintain --help` for focused discovery. Invoke from the repository root; use `pnpm -w flux ...` from nested workspace directories.

For browser/full checks, install Chromium, Firefox, and WebKit separately:

```bash
pnpm --filter @flux-ui/docs exec playwright install chromium firefox webkit
```

On Linux, use `pnpm --filter @flux-ui/docs run playwright:install:compat` if system libraries are missing.
Doctor checks versions, workspace files, dependencies and the optional Playwright browser prerequisites without
network access, installation or source writes. It is not a quality gate.

## Before opening a pull request

```bash
pnpm flux check
```

This is the normal fail-fast merge-readiness contract. For browser, accessibility,
Storybook or runtime-sensitive changes, run `pnpm flux check full`. It includes release
size checks, Storybook, the broad Chromium suite, focused Chromium/Firefox/WebKit
compatibility, performance smoke and the built-public-export consumer (without docs aliases or CSS).

For exhaustive local diagnosis, `pnpm flux check all` continues independent checks and
writes `.cache/verify-all/receipt.json`. Failed production builds block size checks;
any failed or blocked gate keeps the exit code nonzero. This receipt is not CI evidence.

`pnpm flux fix` regenerates, builds declarations, applies safe ESLint fixes and Prettier,
regenerates again, then runs `pnpm flux check`. It writes files; review the diff. It does
not accept baselines or suppress failures. On a fresh checkout, run `pnpm flux build packages`
before standalone type-aware lint. Builds write dist/cache output, never baselines.

| Command                                                                                              | Purpose                                                    | Writes files?         | Typical user       |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | --------------------- | ------------------ |
| `pnpm flux doctor`                                                                                   | Check local prerequisites                                  | No                    | Everyone           |
| `pnpm flux dev`                                                                                      | Start docs development                                     | No source writes      | Everyone           |
| `pnpm flux check`                                                                                    | Normal fail-fast gate                                      | Build/cache only      | Everyone           |
| `pnpm flux check full`                                                                               | Add browser compatibility/Storybook/runtime/consumer gates | Build/test/cache only | UI/runtime changes |
| `pnpm flux check all`                                                                                | Continue independent checks, save receipt                  | Build/cache/receipt   | Troubleshooting    |
| `pnpm flux fix`                                                                                      | Generate, safe lint/format fixes, check                    | Yes                   | Everyone           |
| `pnpm flux component new ...`                                                                        | Scaffold component and docs example                        | Yes                   | Component work     |
| `pnpm flux size baseline review` / `pnpm flux size aggregate review`                                 | Inspect proposed baseline                                  | Build/cache only      | Maintainers        |
| `pnpm flux size baseline accept` / `pnpm flux size aggregate accept` / `pnpm flux size icons accept` | Accept separately reviewed baselines                       | **Yes**               | Maintainers only   |
| `pnpm flux perf accept`                                                                              | Accept reviewed performance baseline                       | **Yes**               | Maintainers only   |
| `pnpm flux release ...`                                                                              | Protected release preparation/inspection                   | Depends; see help     | Maintainers        |

## Components and size baselines

```bash
pnpm flux component new Example Layout primitive
pnpm flux component doctor Example
pnpm flux maintain generate
```

Implement the generated component, example, semantics, tests and benchmark;
scaffolding alone is not a finished component. Default examples must use public
Flux APIs for ordinary UI. See [dogfooding.md](dogfooding.md) for ownership rules.

Do not update a baseline to hide a behavior, accessibility, or unexplained size
regression. First inspect the emitted result and run the relevant tests. A new
family legitimately needs a first baseline after measurement. Existing category
budgets remain enforced during baseline updates.

```bash
pnpm flux size
pnpm flux size icons
# Only after reviewing fresh measurements and accepting their changes:
pnpm flux size baseline accept
```

`pnpm flux size icons` and `pnpm flux size icons accept` rebuild the icon package before measuring it.
`pnpm flux size` measures existing component output, so run the package build or the full
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

## Advanced families and safe local tools

See [advanced-components.md](advanced-components.md) for the syntax, chart,
numeric-control, data-table, and split-pane APIs and their explicit limits.
`pnpm flux test feature` checks their pure data models, token contrast, scenario
pairing, and measurement semantics. Browser and React tests are separate gates.

`pnpm flux maintain clean` resolves the repository from the script location, not the shell's
working directory. Only the repository cache and explicit app/package `dist`
directories are eligible. The repository root, outside paths, and symlinked
output paths are rejected. `pnpm flux test safety` runs destructive-path reproductions
only inside temporary test repositories.

`pnpm flux maintain archive` keeps its fixed filename and replaces the previous archive only
after a successful staged ZIP. It excludes real local environment files, common
private-key/credential files, symlinks, caches, and build noise. Safe example
configuration and literal `${ENV}` references remain eligible, while detected
credential values and private-key headers are omitted. This is a conservative
sharing safeguard, not a complete secret scanner or a defense against hostile
concurrent filesystem changes. Review the file summary before sharing a ZIP.

## Internal command architecture

`pnpm flux` is the contributor interface. Root scripts contain only `flux` and the
Husky `prepare` lifecycle hook. `tooling/terminal/public-commands.json` owns public
help, argument rules and task references. `commands.json` owns ordered argv arrays;
`commands.mjs` validates internal references. The public CLI, Git hooks, separate CI
evidence steps and exhaustive verification share these task definitions.

The CLI resolves the repository root from its module location. Arguments remain
arrays through the shared runner, including spaces and shell metacharacters.
Component, aggregate and icon acceptance remain separate. Review never accepts,
absolute budgets remain enforced, stale aggregate snapshots still fail, and release
mode never accepts a baseline.

`pnpm flux release` lists safe preparation/inspection operations. `pnpm flux release guide` explains
why local publishing is disabled and intentionally exits nonzero. Only the protected
GitHub **Release packages** workflow publishes. `pnpm flux maintain clean` and `archive` retain
the existing filesystem/secret safeguards. Bible refresh/pin change dependency metadata
and require explicit maintainer authorization; Coding Bible remains required.
