# Flux icon size contract

Every public icon is built as an independent ESM entry and measured together with the shared `IconBase` runtime graph.

Absolute per-icon ceilings:

- raw: 3 KiB
- gzip: 1.25 KiB
- Brotli: 1 KiB

`baseline.json` also prevents quiet growth below the absolute ceiling. A metric may grow by at most 10% or the small byte floor encoded in `check.mjs`, whichever is larger.

```bash
pnpm build:packages
pnpm icons:size
pnpm icons:size:update # only after reviewing intentional emitted changes
```

Normal new-icon work should use `pnpm size:update`, which updates both component and icon baselines only after absolute budgets pass.
