import { createHash } from "node:crypto";

export const CHECKS = {
  quality: [
    {
      id: "generated",
      label: "Generated files",
      command: ["pnpm", "generate:check"],
    },
    {
      id: "docs-coverage",
      label: "Docs coverage",
      command: ["pnpm", "docs:check"],
    },
    {
      id: "dogfood",
      label: "Dogfood",
      command: ["pnpm", "dogfood:check"],
    },
    {
      id: "format",
      label: "Formatting",
      command: ["pnpm", "format:check"],
    },
    {
      id: "package-build",
      label: "Package builds",
      command: ["pnpm", "build:packages"],
    },
    {
      id: "lint",
      label: "ESLint",
      command: ["pnpm", "lint"],
    },
    {
      id: "types",
      label: "TypeScript",
      command: ["pnpm", "typecheck"],
    },
    {
      id: "knip",
      label: "Knip",
      command: ["pnpm", "knip"],
    },
    {
      id: "workspace-tests",
      label: "Workspace tests",
      command: [
        "pnpm",
        "-r",
        "--if-present",
        "test",
        "--reporter=default",
        "--reporter=../../tooling/terminal/vitest-reporter.mjs",
      ],
    },
    {
      id: "size-tests",
      label: "Size contracts",
      command: ["pnpm", "size:test"],
    },
    {
      id: "icons-tests",
      label: "Icon contracts",
      command: ["pnpm", "icons:test"],
    },
    {
      id: "docs-tests",
      label: "Docs contracts",
      command: ["pnpm", "docs:test"],
    },
    {
      id: "trust-tests",
      label: "Trust, release and terminal contracts",
      command: ["pnpm", "trust:test"],
    },
    {
      id: "dogfood-tests",
      label: "Dogfood contracts",
      command: ["pnpm", "dogfood:test"],
    },
    {
      id: "safety-tests",
      label: "Safety contracts",
      command: ["pnpm", "safety:test"],
    },
    {
      id: "feature-tests",
      label: "Feature contracts",
      command: ["pnpm", "feature:test"],
    },
    {
      id: "docs-build",
      label: "Docs production build",
      command: ["pnpm", "--filter", "@flux-ui/docs", "build"],
    },
    {
      id: "size",
      label: "Bundle budgets",
      command: ["pnpm", "size"],
    },
    {
      id: "coding-bible",
      label: "Coding Bible",
      command: ["pnpm", "bible:check"],
    },
    {
      id: "release-size",
      label: "Release bundle budgets",
      command: ["node", "tooling/size/check.mjs", "--release", "--json"],
      output: "size.json",
    },
    {
      id: "storybook",
      label: "Storybook production build",
      command: ["pnpm", "storybook:build"],
    },
    {
      id: "clean-tree",
      label: "No tracked generated drift",
      command: ["git", "diff", "--exit-code"],
    },
  ],
  browser: [
    {
      id: "browser",
      label: "Chromium behavior and axe accessibility tests",
      command: ["pnpm", "test:e2e"],
    },
    {
      id: "consumer",
      label: "Built public exports, declarations and browser composition",
      command: ["pnpm", "consumer:check"],
    },
    {
      id: "performance",
      label: "Native-relative runtime regression gate",
      command: ["pnpm", "perf"],
    },
  ],
};

export function digest(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

export function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function sourceContext(env = process.env) {
  const ci = env.GITHUB_ACTIONS === "true";
  const commit = env.GITHUB_SHA ?? null;
  const repository = env.GITHUB_REPOSITORY ?? null;
  const runId = env.GITHUB_RUN_ID ?? null;
  const runAttempt = env.GITHUB_RUN_ATTEMPT ?? null;
  if (
    ci &&
    (!/^[a-f0-9]{40}$/u.test(commit ?? "") ||
      !/^[\w.-]+\/[\w.-]+$/u.test(repository ?? "") ||
      !/^\d+$/u.test(runId ?? "") ||
      !/^\d+$/u.test(runAttempt ?? ""))
  ) {
    throw new Error(
      "GitHub evidence requires a full commit, repository, run ID and attempt.",
    );
  }
  return {
    kind: ci ? "github-actions" : "local",
    commit,
    repository,
    runId,
    runAttempt,
  };
}

export function validateReceipt(value, job, context) {
  if (!Object.hasOwn(CHECKS, job))
    throw new Error(`Unknown evidence job: ${job}`);
  if (
    !isRecord(value) ||
    value.schemaVersion !== 1 ||
    value.job !== job ||
    !isRecord(value.source) ||
    !Array.isArray(value.checks)
  ) {
    throw new Error(`Invalid ${job} evidence receipt.`);
  }
  for (const key of ["kind", "commit", "repository", "runId", "runAttempt"]) {
    if (value.source[key] !== context[key])
      throw new Error(`${job} receipt has a mismatched ${key}.`);
  }
  if (value.checks.length !== CHECKS[job].length)
    throw new Error(`${job} receipt has missing or extra checks.`);
  for (const [index, check] of value.checks.entries()) {
    const expected = CHECKS[job][index];
    if (
      !isRecord(check) ||
      check.id !== expected.id ||
      check.label !== expected.label ||
      JSON.stringify(check.command) !== JSON.stringify(expected.command) ||
      !["passed", "failed", "not-run"].includes(check.status)
    ) {
      throw new Error(`${job} receipt contains an invalid check.`);
    }
    if (
      !Number.isFinite(check.durationMs) ||
      check.durationMs < 0 ||
      (check.status === "passed" && check.exitCode !== 0)
    ) {
      throw new Error(`${job} receipt contains an invalid result.`);
    }
  }
  if (
    typeof value.finishedAt !== "string" ||
    !Number.isFinite(Date.parse(value.finishedAt))
  )
    throw new Error(`${job} receipt has no valid timestamp.`);
  return value;
}

export function createEvidence(receipts, context, files, requireCI = false) {
  if (requireCI && context.kind !== "github-actions")
    throw new Error(
      "Published CI evidence cannot be generated from a local run.",
    );
  const jobs = Object.keys(CHECKS).map((job) =>
    validateReceipt(receipts[job], job, context),
  );
  const passed = jobs.every((job) =>
    job.checks.every((check) => check.status === "passed"),
  );
  if (requireCI && !passed)
    throw new Error(
      "Refusing to publish successful evidence for incomplete or failed checks.",
    );
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    source: context,
    status: passed ? "passed" : "incomplete",
    scope:
      "Repository quality and Chromium behavior/accessibility/runtime and built-package consumer checks. Not a security certification or a WCAG conformance claim.",
    runUrl:
      context.kind === "github-actions"
        ? `https://github.com/${context.repository}/actions/runs/${context.runId}/attempts/${context.runAttempt}`
        : null,
    jobs: jobs.map(({ job, checks, finishedAt }) => ({
      job,
      checks,
      finishedAt,
    })),
    files,
  };
}
