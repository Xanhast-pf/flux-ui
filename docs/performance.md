# Performance

Performance is treated as a release contract, not a marketing adjective.

Flux measures two complementary layers:

1. **shipping cost** — what bytes a consumer receives;
2. **runtime cost** — what overhead the abstraction adds in a real browser.

## Bundle-size contract

The dependency-free checker under `tooling/size/` operates on the normal multi-entry library build. It automatically discovers every public component and follows the emitted JS/CSS runtime graph.

Automated gates include:

- absolute raw, gzip, and Brotli budgets by component complexity class;
- committed per-component regression baselines;
- runtime-union and published-dist aggregate measurements;
- strict baseline coverage for every public component;
- changed-component checks for fast local feedback;
- full stale-baseline protection for release checks.

New components start in the strictest `primitive` class. Raising a class is an explicit metadata/code-review decision, not a way to silence a size failure.

See [`../tooling/size/README.md`](../tooling/size/README.md).

## Runtime-performance contract

The Playwright/Chromium harness measures Flux against React/native reference implementations on the **same browser and machine run**.

Current scenarios can render:

- `raw` — the simplest unstyled React/native element variant (the key is retained in the harness; it is not direct-DOM HTML);
- `native` — an equivalent handwritten React + HTML/CSS implementation;
- `flux` — the Flux public API.

The primary regression reference is the equivalent `native` variant when one exists.

Measured metrics include:

- synchronous mount cost;
- mount-to-next-frame diagnostic;
- synchronous update cost;
- update-to-next-frame diagnostic;
- synchronous unmount cost;
- DOM node count.

Samples alternate execution order and calculate paired Flux/reference ratios before taking the median. This reduces noise from runner speed, JIT state, and temporary machine load.

CI gates on the stable synchronous mount/update/unmount ratios. Next-frame measurements are recorded and printed as diagnostics but are not hard regression gates because `requestAnimationFrame` phase introduces natural frame-boundary noise.

The benchmark should always be read in both relative and absolute terms. A `2×` ratio can still represent only a few microseconds per component when the native reference is extremely cheap.

See [`../tooling/perf/README.md`](../tooling/perf/README.md).

## Performance principles

- Do less work before optimizing work.
- Prefer CSS/platform layout over JavaScript observation when possible.
- Do not add `memo`, `useMemo`, or `useCallback` without evidence.
- Avoid unnecessary DOM wrappers and global subscriptions.
- Keep visual primitives server-safe unless behavior requires otherwise.
- Compare equivalent behavior when benchmarking competitors or native references.
- Never update a baseline reflexively just to turn CI green.

As behavior-heavy components arrive, add scenarios that match their actual risk: open/close latency, focus management, repeated interaction, large collections, memory/leak behavior, and scaling curves.
