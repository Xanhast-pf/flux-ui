# Flux icon size contract

Every public icon is built as an independent ESM entry and measured together with the shared `IconBase` runtime graph.

Absolute per-icon ceilings:

- raw: 3 KiB
- gzip: 1.25 KiB
- Brotli: 1 KiB

`baseline.json` also prevents quiet growth below the absolute ceiling. A metric may grow by at most 10% or the small byte floor encoded in `check.mjs`, whichever is larger.

```bash
pnpm flux build packages
pnpm flux size icons
pnpm flux size icons accept # only after reviewing intentional emitted changes
```

For new icons, inspect `pnpm flux size icons` first. After explicit review, maintainers may use `pnpm flux size icons accept`; it accepts only icon baselines after absolute budgets pass. Component bundled and aggregate baseline acceptance are separate operations.
