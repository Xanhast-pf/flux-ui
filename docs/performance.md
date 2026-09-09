# Performance

Performance is treated as a release contract.

Flux uses a custom, dependency-free size gate under `tooling/size/` rather than
maintaining per-component Size Limit entries. The normal library build already
produces one public entry per component; the size checker discovers those
entries automatically and measures their emitted runtime graphs.

Current automated gates:

- absolute raw, gzip and Brotli budgets by component complexity class;
- checked-in per-component regression baselines;
- full runtime and published-dist aggregate measurements;
- strict baseline coverage for every public component;
- fast changed-component checks for local development;
- full release checks for the entire component surface;
- zero runtime style engine and static CSS theme variables;
- SSR benchmark fixture for Button;
- browser smoke tests in Playwright.

New components start in the strictest `primitive` size class. Raising a size
class is an explicit metadata change and therefore visible in review. Absolute
budgets live centrally in `tooling/size/budgets.mjs`; component metadata never
contains arbitrary byte limits.

See [`tooling/size/README.md`](../tooling/size/README.md) for the measurement
model and baseline workflow.

As components become behavior-heavy, add interaction benchmarks for open/close
latency, update cost, DOM node count and large-data scenarios. Competitive
bundle benchmarks must use reproducible consumer fixtures with equivalent
behavior and accessibility, not package-manager download size as a proxy for
consumer cost.
