# Flux UI runtime performance contract

Flux measures browser runtime cost relative to React/native baselines instead of treating raw milliseconds from one machine as portable truth.

## Variants

A scenario may render three variants:

1. **raw** — the simplest unstyled React + native element implementation. Despite the historical key name, this is not direct-DOM HTML outside React.
2. **native** — equivalent behavior/layout written directly with React + HTML/CSS.
3. **flux** — the Flux public component API.

The primary regression reference is `native` when an equivalent implementation exists. `raw` remains useful as a theoretical lower React/native floor.

For example, Button compares Flux with a native button implementation that reproduces the equivalent structural/styling work, while Grid compares Flux with handwritten CSS Grid. This measures abstraction overhead rather than unfairly comparing "doing layout" with "doing nothing".

## Metrics

Each sample records:

- synchronous mount time;
- mount-to-next-frame time;
- synchronous update time;
- update-to-next-frame time;
- synchronous unmount time;
- DOM node count.

`requestAnimationFrame` fires before paint, so the diagnostic is deliberately called **to-frame**, not **to-paint**.

The synchronous mount/update/unmount ratios are the historical regression contract. Frame metrics are stored and printed for context but are not hard CI gates because frame phase is naturally noisy.

## Noise reduction

Runs alternate variant ordering so the same implementation is not consistently favored by JIT warmup, CPU state, or runner load.

For each iteration Flux is paired with the corresponding reference result. Ratios are calculated **per pair first**, then the median ratio is taken. This is more stable than dividing two unrelated aggregate timings.

A ratio of `1.08` means Flux took 8% longer than its reference for that metric during the paired browser measurements.

Always interpret ratios together with absolute cost. When a reference takes only a few milliseconds for 1,000 instances, a large-looking percentage can still mean only a few microseconds of overhead per component.

## Commands

```bash
pnpm perf:smoke   # fast sanity run; no historical assertion
pnpm perf         # full benchmark + synchronous regression assertion
pnpm perf:update  # intentionally record a new baseline
```

Playwright Chromium must be installed once:

```bash
pnpm --filter @flux-ui/docs exec playwright install chromium
```

The committed baseline lives at `tooling/perf/baseline.json`.

Do not run `perf:update` simply because `perf` failed. Investigate the regression first; update the baseline only when the new cost is understood and intentionally accepted.
