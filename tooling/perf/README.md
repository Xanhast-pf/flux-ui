# Flux UI runtime performance contract

Flux measures browser runtime cost relative to native browser baselines instead
of treating raw milliseconds as portable truth.

Each scenario renders three variants when useful:

1. **raw** — the lowest-cost unstyled semantic HTML baseline.
2. **native** — equivalent behavior/layout written directly with HTML/CSS.
3. **flux** — the Flux component API.

`Button` uses raw `<button>` as its primary reference. `Grid` uses equivalent
handwritten CSS Grid as its primary reference so the test measures Flux
abstraction overhead rather than the cost of performing layout at all.

Samples alternate ordering between runs to reduce JIT, thermal, and runner-load
bias. CI compares the median Flux/reference ratio to a committed historical
baseline, which makes the contract substantially less sensitive to the absolute
speed of a particular GitHub runner.

Commands:

```bash
pnpm perf:smoke   # fast sanity run; no historical assertion
pnpm perf:update  # record a new intentional baseline
pnpm perf         # full benchmark + regression assertion
```

The baseline intentionally stores absolute medians too, but release gating uses
the relative overhead ratios. A ratio of `1.08` means Flux took 8% longer than
its native reference for that metric on the same browser/run.
