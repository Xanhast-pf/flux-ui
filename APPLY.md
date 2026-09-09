# Flux UI dashboard foundation — safe overlay

This archive contains the **complete contents of every folder changed by the implementation pass**. It is safe to replace those folders or merge them into the repository.

## If repairing a checkout after the previous partial overlay

The only intended tracked-file deletion is:

```text
packages/react/src/components/Button/Button.docs.tsx
```

Restore any other tracked files that were accidentally deleted, then apply this archive.

```bash
git diff --name-only --diff-filter=D \
  | grep -v '^packages/react/src/components/Button/Button.docs.tsx$' \
  | xargs -r git restore --

rm -f packages/react/src/components/Button/Button.docs.tsx
```

Then extract this archive at the repository root and run:

```bash
pnpm install
pnpm format
pnpm size:update
pnpm --filter @flux-ui/docs playwright:install
pnpm perf:update
pnpm check
pnpm check:full
```

`pnpm-lock.yaml` is intentionally not included because Storybook dependencies must be resolved by pnpm on the consumer machine.
