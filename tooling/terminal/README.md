# Verification terminal

The contributor interface is `pnpm flux`; root scripts contain `flux` and `prepare`.
`public-commands.json` defines human commands, help metadata, argument rules and task
references. `public-commands.mjs` resolves the tree and validates input. `cli.mjs`
dispatches through the shared runner. `commands.json` owns ordered argv arrays for
atomic commands and pipelines; `commands.mjs` validates task references and labels.
`tasks.mjs` executes internal tasks from the repository root without shell parsing.
Hooks and fine-grained CI evidence steps use this same internal entrypoint.
Verification expands normal/full pipelines, preserving independent-check aggregation,
the production build prerequisite for size and the JSON receipt. Ordinary pipelines
remain fail-fast. Use `pnpm -w flux ...` from nested workspace directories.

`runner.mjs` owns disk-backed capture, real exit statuses, process groups and
signal cleanup. Successful stdout is suppressed; stderr remains visible so
warnings cannot disappear. Failures replay complete stdout and stderr without
truncation. Logs live in the OS temporary directory and are removed after replay.
The two streams retain their own ordering, not cross-stream chronological order.

`output.mjs` owns semantic green PASS, red FAIL, yellow WARN and cyan RUN
colors. NO_COLOR takes precedence over FORCE_COLOR. Color and cursor support
are independent: CI and redirected output never animate, even with forced
color. Child capture disables native colors; diagnostic replay strips escapes.

The single live row refreshes at 100ms intervals, adapts to terminal width and
preserves the tail of long item names. Structured current/total events render a
bar only for valid known totals; other work shows activity and elapsed time.
Completed output is never redrawn. The cursor is never hidden.

`progress.mjs` writes a bounded latest-event side channel, separate from stdout.
Vitest uses discovered modules and completed files. Browser/performance use
Playwright's discovered test cases and distinct completed IDs (retries do not
inflate the count). This is case progress, not inner benchmark scenario progress.
Concurrent reporters show the latest event, not an exclusive active file.
Build and generation chains expose package/target boundaries. Size exposes its
component loop. ESLint and TypeScript remain indeterminate because their current
invocations expose no stable per-file events.

Small single-line summaries collapse into the PASS row. Other summaries and all
stderr remain visible; unclassified stderr gets a WARN heading, never silent
suppression. No framework-noise suppression policy is assumed. Full failure
stdout/stderr is streamed from disk without truncation. Separate stream ordering
is preserved, but cross-stream chronology is not reconstructed.

## Command classification

- Quiet, captured within pipelines: ESLint, TypeScript, Knip, Coding Bible,
  docs/catalog and dogfood validation, formatting checks.
- Progress-capable: size component loop; build package and generation target
  boundaries already present in command definitions.
- Native reporter integration: Vitest modules, Node test events and Playwright
  specs/scenarios. Native diagnostics remain captured; no human-output parsing.
- Raw: development/watch, scaffold, formatting/lint fixes, release/publishing,
  baseline acceptance, trust evidence generation, individual small checkers.
  Their mutation or machine interfaces should not be cosmetically rewritten.

The direct size checker preserves `--json` stdout, provides `--verbose` component
detail, and writes human baseline reviews to a temporary JSON file. Review and
acceptance commands are never executed by the terminal migration. For a pure
machine stream use `node tooling/size/check.mjs --json`; the internal CLI also preserves `--json` output.

Run `pnpm flux test terminal` and `pnpm flux test size`. No dependencies, thresholds,
baselines or application behavior are changed.
