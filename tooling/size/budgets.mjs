export const BUDGETS_VERSION = 1;

// New components start in the strictest class. Escalating the class is an
// explicit component metadata change that reviewers can see and challenge.
export const sizeClasses = Object.freeze({
  primitive: Object.freeze({
    raw: 6 * 1024,
    gzip: 2 * 1024,
    brotli: 1536,
  }),
  interactive: Object.freeze({
    raw: 14 * 1024,
    gzip: 4 * 1024,
    brotli: 3 * 1024,
  }),
  overlay: Object.freeze({
    raw: 26 * 1024,
    gzip: 7 * 1024,
    brotli: 5 * 1024,
  }),
  composite: Object.freeze({
    raw: 42 * 1024,
    gzip: 11 * 1024,
    brotli: 8 * 1024,
  }),
  "data-heavy": Object.freeze({
    raw: 64 * 1024,
    gzip: 16 * 1024,
    brotli: 12 * 1024,
  }),
});

// A deterministic build has no measurement noise. Tiny byte changes are still
// tolerated so refactors do not require baseline churn for a few compressed
// bytes, but meaningful regressions fail immediately.
export const regressionPolicy = Object.freeze({
  percent: 2,
  minimumBytes: Object.freeze({
    raw: 64,
    gzip: 32,
    brotli: 24,
  }),
});

// Aggregate limits scale with the number and declared complexity of public
// components instead of becoming an arbitrary fixed ceiling that would punish
// a large library for adding legitimately tiny entries.
export const aggregatePolicy = Object.freeze({
  rootEntryBaseBrotli: 512,
  rootEntryPerComponentBrotli: 32,
  sharedRuntimeBaseBrotli: 4 * 1024,
  sharedRuntimePerComponentBrotli: 96,
});

export const validSizeClasses = Object.freeze(Object.keys(sizeClasses));
