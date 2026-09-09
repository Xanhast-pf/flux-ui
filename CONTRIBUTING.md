# Contributing

1. Use Node 24 and pnpm 10.34.5.
2. Read `AGENTS.md` before changing public APIs or architecture.
3. Create components with `pnpm component:new` rather than copying folders manually. New components default to the strict `primitive` size class; choose a larger class only when the behavior requires it.
4. Run `pnpm check` before pushing; run `pnpm check:full` when docs/browser behavior changes. Commit intentional `tooling/size/baseline.json` changes with the code that caused them.
5. Add a Changeset for user-visible published package changes.
6. Keep Coding Bible enabled; do not hide findings with exclusions.

Public API additions should include the usage that motivated them. Prefer a smaller API plus composition over speculative convenience props.
