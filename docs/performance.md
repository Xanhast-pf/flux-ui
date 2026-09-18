# Performance

Performance is treated as a release contract, not a marketing adjective.

Flux measures two complementary layers:

1. **shipping cost** — what bytes a consumer receives;
2. **runtime cost** — what overhead the abstraction adds in a real browser.

## Bundle-size contract

The build-time checker under `tooling/size/` operates on the normal multi-entry library build. It automatically discovers every public component and follows the emitted JS/CSS runtime graph.

Automated gates include:

- absolute raw, gzip, and Brotli budgets by component complexity class;
- committed per-component regression baselines;
- runtime-union and published-dist aggregate measurements;
- strict baseline coverage for every public component;
- changed-component checks for fast local feedback;
- full stale-baseline protection for release checks.

Scaffolds default to the strictest `primitive` class. Deliberately complex families such as Chart and DataTable declare the existing `data-heavy` class in reviewed metadata. Reclassifying an existing component is not a way to silence a size failure.

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

## Discovered workloads and honest references

The docs Lab discovers paired `*.json` manifests and `*.fixture.tsx` implementations
under `apps/docs/src/perf/scenarios/`. There are fourteen initial scenarios:
Button, Grid, Text, Stack, Field/Input, Checkbox, Slider, Chart, CodeBlock, Knob,
LevelMeter, DataTable, Sidebar, and SplitPane. New scenarios need a unique ID,
fixture revision, workload unit, finite limits, and a matching fixture.

Button and Grid have equivalent React/native comparisons. Other scenarios report
absolute Flux workload timings, not invented native ratios. Grid measures **one
layout with N cells**, not N Grid instances. DataTable measures loaded rows;
Chart measures source samples; CodeBlock measures lines. The reported node count
is separate from each scenario's work unit.

The current Button and Grid fixtures are revision 2. Their computed layout
fingerprints must match the equivalent native run before a ratio is produced.
Grid now uses the same 24px gap in both variants. Previous baseline revisions
must not be compared to these changed workloads. The performance page marks old
measurements as pending instead of presenting them as current evidence.

Run `pnpm flux perf smoke` to check execution and equivalence. Run the full `pnpm flux perf`
for historical ratio gates; it refuses a mismatched baseline fixture revision.
Only after correctness, equivalence, and emitted package checks pass should a
reviewed `pnpm flux perf accept` establish new measurements. This patch changes no
recorded timing values. New flux-only scenarios have smoke/browser coverage, not
historical timing thresholds or input-latency percentile claims yet.

Relative local JS/CSS imports missing from a component's emitted graph are now
fatal size errors, as are escaping paths and unaccounted runtime externals. The
React peers excluded from component accounting are reported explicitly. Component
size is still not the entire page download: tokens, peers, fonts/images, code
splitting and browser cache behavior have distinct costs.
