# Contributing to Flux UI

Thanks for helping build Flux UI. The repository is intentionally strict because API quality, accessibility, bundle size, and runtime behavior are treated as product contracts rather than cleanup work.

## First-time setup

Follow the canonical setup guide in [`docs/development.md`](docs/development.md):

```bash
git clone https://github.com/Xanhast-pf/flux-ui.git
cd flux-ui
# If you use nvm; otherwise make sure `node --version` reports Node 24.
nvm use
corepack enable
pnpm install
pnpm check
```

Install Playwright Chromium before running browser/full checks:

```bash
pnpm --filter @flux-ui/docs exec playwright install chromium
```

## Before changing public API or architecture

Read [`AGENTS.md`](AGENTS.md). It is the authoritative engineering contract for both human and AI contributors.

Public API additions should include the real usage that motivated them. Prefer a smaller API plus composition over speculative convenience props.

## Components

Create public components through the generator:

```bash
pnpm component:new ComponentName Category [sizeClass]
pnpm component:doctor ComponentName
```

Do not copy folders or manually wire generated registries. If adding a component requires unrelated project-wide edits simply to become discoverable, improve the generator instead.

New components default to the strict `primitive` size class. Choose a larger class only when the implementation genuinely warrants it.

## Validation

Before pushing ordinary changes:

```bash
pnpm check
```

For component visuals, browser behavior, accessibility, Storybook, or runtime-sensitive changes:

```bash
pnpm storybook:build
pnpm check:full
pnpm perf
```

Keep Coding Bible enabled. Do not hide findings with exclusions merely to make CI green.

## Baselines

Size and runtime baselines are reviewed contracts, not snapshots to regenerate whenever a test fails.

Use:

```bash
pnpm size:update
```

only for a new public component or an intentionally accepted size change.

Use:

```bash
pnpm perf:update
```

only when intentionally establishing or changing the runtime-performance baseline.

Commit baseline changes with the code that justifies them.

## Changesets

Add a Changeset for user-visible published package changes:

```bash
pnpm changeset
```

Docs-only, test-only, and internal tooling changes generally do not require one unless the published package contract changes.

## Pull requests

Keep PRs focused. Include:

- what changed and why;
- relevant Storybook/screenshots for visual work;
- accessibility/interaction notes for behavior-heavy components;
- intentional size/performance baseline changes;
- a Changeset when required.

The protected GitHub `CI / Required` gate must pass before merge.
