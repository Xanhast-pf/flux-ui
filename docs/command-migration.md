# Repository command migration

`pnpm flux` is the contributor interface. Node 24+ and pnpm 10.34.5 are the
only toolchain prerequisites. Root scripts are `flux` and the `prepare` lifecycle
hook. The former script identifiers below are not compatibility aliases.

## Former root scripts

| Former script           | Current interface                                | Audience / role    |
| ----------------------- | ------------------------------------------------ | ------------------ |
| `dev`                   | `pnpm flux dev`                                  | contributor        |
| `generate`              | `pnpm flux maintain generate`                    | contributor        |
| `generate:check`        | `pnpm flux check generated`                      | contributor        |
| `component:new`         | `pnpm flux component new`                        | contributor        |
| `component:doctor`      | `pnpm flux component doctor`                     | contributor        |
| `clean`                 | `pnpm flux maintain clean`                       | contributor        |
| `build`                 | `pnpm flux build`                                | contributor        |
| `typecheck`             | `pnpm flux check types`                          | contributor        |
| `lint`                  | `pnpm flux check lint`                           | contributor        |
| `lint:fix`              | `node tooling/terminal/tasks.mjs lint:fix`       | internal-only task |
| `format`                | `node tooling/terminal/tasks.mjs format`         | internal-only task |
| `format:check`          | `pnpm flux check format`                         | contributor        |
| `knip`                  | `pnpm flux check knip`                           | contributor        |
| `test`                  | `pnpm flux test`                                 | contributor        |
| `test:e2e`              | `pnpm flux test e2e`                             | contributor        |
| `test:a11y`             | `pnpm flux test a11y`                            | contributor        |
| `bench`                 | `pnpm flux perf bench`                           | contributor        |
| `size`                  | `pnpm flux size`                                 | contributor        |
| `bible:check`           | `pnpm flux check bible`                          | contributor        |
| `bible:staged`          | `node tooling/terminal/tasks.mjs bible:staged`   | internal-only task |
| `bible:refresh`         | `pnpm flux maintain bible refresh`               | maintainer         |
| `bible:pin`             | `pnpm flux maintain bible pin`                   | maintainer         |
| `check`                 | `pnpm flux check`                                | contributor        |
| `check:full`            | `pnpm flux check full`                           | contributor        |
| `check:fix`             | `pnpm flux fix`                                  | contributor        |
| `changeset`             | `pnpm flux release changeset`                    | maintainer         |
| `release:version`       | `pnpm flux release version`                      | maintainer         |
| `release`               | `pnpm flux release guide`                        | maintainer         |
| `prepare`               | `npm/pnpm lifecycle hook`                        | lifecycle          |
| `bible:changed`         | `pnpm flux check bible-changed`                  | contributor        |
| `size:changed`          | `pnpm flux size changed`                         | contributor        |
| `size:compare`          | `pnpm flux size compare`                         | contributor        |
| `size:baseline:review`  | `pnpm flux size baseline review`                 | maintainer         |
| `size:aggregate:review` | `pnpm flux size aggregate review`                | maintainer         |
| `size:aggregate:update` | `pnpm flux size aggregate accept`                | maintainer         |
| `size:update`           | `pnpm flux size baseline accept`                 | maintainer         |
| `size:release`          | `pnpm flux size release`                         | contributor        |
| `size:test`             | `pnpm flux test size`                            | contributor        |
| `build:packages`        | `pnpm flux build packages`                       | contributor        |
| `storybook`             | `pnpm flux dev storybook`                        | contributor        |
| `storybook:build`       | `pnpm flux build storybook`                      | contributor        |
| `perf`                  | `pnpm flux perf`                                 | contributor        |
| `perf:update`           | `pnpm flux perf accept`                          | maintainer         |
| `perf:smoke`            | `pnpm flux perf smoke`                           | contributor        |
| `docs:check`            | `pnpm flux check docs`                           | contributor        |
| `docs:test`             | `pnpm flux test docs`                            | contributor        |
| `icons:size`            | `pnpm flux size icons`                           | contributor        |
| `icons:test`            | `pnpm flux test icons`                           | contributor        |
| `icons:size:update`     | `pnpm flux size icons accept`                    | maintainer         |
| `trust:test`            | `pnpm flux test trust`                           | contributor        |
| `trust:quality`         | `node tooling/terminal/tasks.mjs trust:quality`  | internal-only task |
| `trust:browser`         | `node tooling/terminal/tasks.mjs trust:browser`  | internal-only task |
| `trust:generate`        | `node tooling/terminal/tasks.mjs trust:generate` | internal-only task |
| `release:pack`          | `pnpm flux release pack`                         | maintainer         |
| `dogfood:check`         | `pnpm flux check dogfood`                        | contributor        |
| `dogfood:test`          | `pnpm flux test dogfood`                         | contributor        |
| `archive`               | `pnpm flux maintain archive`                     | contributor        |
| `verify:all`            | `pnpm flux check all`                            | contributor        |
| `consumer:packed`       | `pnpm flux release consumer`                     | maintainer         |
| `consumer:check`        | `pnpm flux test consumer`                        | contributor        |
| `safety:test`           | `pnpm flux test safety`                          | contributor        |
| `feature:test`          | `pnpm flux test feature`                         | contributor        |
| `terminal:test`         | `pnpm flux test terminal`                        | contributor        |

## Public command tree

CLI help is authoritative; this migration inventory records the final command paths.

```text
dev → dev
dev storybook → storybook
check → check
check full → check:full
check all → verify:all
check generated → generate:check
check docs → docs:check
check dogfood → dogfood:check
check format → format:check
check lint → lint
check types → typecheck
check knip → knip
check bible → bible:check
check bible-changed → bible:changed
fix → check:fix
test → test
test e2e → test:e2e
test a11y → test:a11y
test consumer → consumer:check
test size → size:test
test icons → icons:test
test docs → docs:test
test trust → trust:test
test dogfood → dogfood:test
test safety → safety:test
test feature → feature:test
test terminal → terminal:test
build → build
build packages → build:packages
build docs → build:docs
build storybook → storybook:build
doctor → doctor
component (help group)
component new → component:new
component doctor → component:doctor
size → size
size icons → icons:size
size changed → size:changed
size compare → size:compare
size release → size:release
size baseline (help group)
size aggregate (help group)
size aggregate review → size:aggregate:review
size aggregate accept → size:aggregate:update
size baseline review → size:baseline:review
size baseline accept → size:update
size icons accept → icons:size:update
perf → perf
perf smoke → perf:smoke
perf bench → bench
perf accept → perf:update
release (help group)
release guide → release
release changeset → changeset
release version → release:version
release pack → release:pack
release consumer → consumer:packed
maintain (help group)
maintain generate → generate
maintain clean → clean
maintain archive → archive
maintain bible (help group)
maintain bible refresh → bible:refresh
maintain bible pin → bible:pin
```

## Architecture and contracts

`public-commands.json` owns public names, summaries, usage, examples, audience,
write metadata and argument validation. Each handler references `commands.json`,
the existing structured argv task registry. `public-commands.mjs` builds the nested
help/dispatch tree; `cli.mjs` calls the existing task execution layer in `tasks.mjs`.
`commands.mjs` provides task references, progress labels and argument forwarding.
`runner.mjs` retains output capture, signals, failure summaries and Windows handling.

Normal `check` preserves all twelve ordered gates. `check full` calls it before
release size, Storybook, browser, performance smoke and built-consumer validation.
`check all` expands those canonical definitions, continues independent checks,
blocks size measurements after production build failure and writes a receipt.

CI retains individually named evidence checks and their IDs. Hooks retain lint-staged,
generated drift and staged Coding Bible in pre-commit; pre-push invokes the normal
internal check. No release permissions, OIDC, publishing or evidence policy changed.

Knip discovers CLI binaries in the structured argv registry and derives Node entry
files from it through `knip.js`; dependency analysis remains enabled. No dependencies
were added. Consumer package installation and standalone showcase scripts remain
ordinary pnpm operations. Workspace `pnpm --filter` / `pnpm -r` commands remain
internal implementation. Dated audits, size acceptance reports, attribution and
performance evidence retain the command spellings actually executed.

## Superseded artifacts

The partial Just implementation existed. Its root `justfile`, twelve `.just`
modules under `tooling/just/` and `tooling/just/run.mjs` were removed. Their grouping,
descriptions and task mappings were ported. The read-only doctor, task registry,
CI/hooks decoupling, Windows runner and verification tests were reused. The doctor
no longer probes Just. No CI Just installation step existed.

All work overlaps the user-owned partial migration intentionally; unrelated changes
were preserved. No baseline acceptance, budget/tolerance edit, dependency change,
lockfile update, release, commit or push is part of this migration.
