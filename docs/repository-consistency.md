# Repository consistency

`pnpm flux check drift` checks relationships that compilation and generated-file checks cannot prove: documentation destinations, companion files, project identity, public manifests, and toolchain mirrors. It runs before expensive checks in the normal gate and has a separate CI evidence entry. It reads source only: no installs, network requests, shell commands, autofixes, or baseline writes.

## Commands

```sh
pnpm flux check drift
pnpm flux check drift --strict
pnpm --silent flux check drift --json
pnpm flux test drift
```

The JSON report has a versioned schema, stable rule IDs, source paths, line numbers, messages, error/warning counts, and scan metrics. Exit status is nonzero for errors; `--strict` also rejects warnings. Malformed configuration, unsupported static route metadata, unreadable files, and inventory-limit failures are errors, not silently successful scans. Output is deterministic for an unchanged tree.

## Facts and their owners

| Fact                                    | Owner                                       | Mirrors checked or derived                                                                                                   |
| --------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Public site and repository identity     | `tooling/project.json`                      | Package homepages/repository/bugs, HTML canonical and OpenGraph URL, trust application, README/security links                |
| Package manager and Node requirements   | Root `package.json`, `.nvmrc`               | Workflow setup, contributor instructions, recipe and packed-consumer metadata                                                |
| Public component identity and lifecycle | Each `component.meta.json`                  | Companion files, registered tests, route targets; existing readiness and public-contract checks still own promotion evidence |
| Docs routes and aliases                 | `apps/docs/src/lib/routing.ts`              | Route views and static JSX/object `href` destinations                                                                        |
| Icon membership                         | `packages/icons/icons.json`                 | Generated catalog; evergreen prose avoids copied counts                                                                      |
| Public package versions                 | Individual package manifests and Changesets | Never inferred from the private root version                                                                                 |

The root package is private. Its version is a repository revision label, not the released version of all Flux packages. Public package versions, prerelease tags, and component lifecycle labels are distinct. This checker does not bump any of them or promote a component.

## Documentation conventions

Evergreen Markdown documents anywhere under `docs/` must be reachable through documentation links from the main contributor entry points; the index is the preferred entry point. A document must not become invisible just because its filename still exists. Label historical reports near their heading with `> **Historical report.**` (or the existing equivalent historical heading); do not rewrite their old measurements or failed-check results as current evidence.

Relative Markdown file and heading links, inline/reference-style links, and images are checked. Fenced examples and inline code are not interpreted as live links. Absolute external links are not fetched. A live URL check belongs in an explicitly network-enabled job, not this deterministic gate.

Use lifecycle-aware, pre-stable wording for the project. Do not maintain an exhaustive component inventory or numeric icon count in multiple prose files. Link to the generated catalog instead.

## Rules and boundaries

`COMPONENT_*` checks required companion files, metadata identity/derived slugs, lifecycle and size-class values, and whether the canonical component test file registers runnable Vitest tests. `TEST_*` extends test hygiene across non-canonical Vitest, Node test and Playwright test/spec files: files must register runnable tests and may not use focused, skipped, todo, expected-failure or conditional-suppression modifiers. File presence is not a substitute for meaningful assertions; existing unit/browser checks still test behavior.

`PACKAGE_*` discovers workspace manifests and checks required/unique names, public release-contract membership, publication metadata, non-empty confined root exports, workspace-protocol references, private-package dependency boundaries, and the absence of install-time hooks in root or workspace packages. Source workspace protocols remain valid; the release packer separately validates the immutable published archives.

`DOC_*` checks document links, explicit historical classification, nested-document discoverability and stale maturity prose. `ROUTE_*` parses TypeScript/TSX with the existing compiler API; navigation routes must map one-to-one to unique static `RouteView` cases, and static link expressions are validated without evaluating source. Dynamic user-computed URLs require browser tests. Same-file DOM anchors are distinguished from app routes; legacy aliases come from the router, not a duplicated registry.

`SITE_*` and `PROJECT_SITE` check canonical identity. `TOOLCHAIN_*`, `WORKFLOW_*`, and `CATALOG_*` catch inconsistent contributor pins, setup versions, missing local Actions/workflows, unapproved mutable Actions, stale mutable-action exceptions, and missing/unused/stale catalog declarations. The only live mutable-Action exception is the existing Coding Bible canary in its dedicated workflow; the reserved Base UI catalog entry retains its documented purpose until it is consumed or removed.

The scanner deliberately excludes dependencies, Git internals, build/cache/test output, and generated-file contents. Generated files are validated by their existing generators; they are still known as link targets. Source symlinks are not followed. Inventory and text-size limits fail explicitly rather than silently truncating coverage.

## Adding a rule

Start with a reproduced defect, choose its authoritative source, and add a pure rule plus both positive and negative fixtures. Include malformed/missing input cases and a realistic intentional exception. Do not add broad filename allowlists to turn findings green. If a check cannot reliably distinguish a claim from a historical example, narrow its semantic scope before making it blocking.

Keep implementation under `tooling/drift/`. The guard reuses the existing component companion-file contract rather than creating another component registry. New rules must preserve JSON diagnostics and read-only execution.

## Release confidence

A clean drift report is evidence about repository consistency, not a claim of defect-free software, WCAG certification, or previous-release API compatibility. The [release certification checklist](release-certification.md) defines the additional user, design, and assistive-technology review required before a release decision.

## Local developer health

`pnpm flux doctor` inspects repository-local hook configuration without spawning Git. The local reader handles quoted values, comments, continuations, subsection boundaries and boolean worktree overrides. Malformed files or includes are reported as unverified configuration; they do not become a green check. Global/system config and include expansion are not evaluated. Use `git config --show-origin --get core.hooksPath` manually for those cases. Doctor never installs hooks or changes identity. A normal `pnpm prepare` restores generated Husky bootstrap files in the active checkout.
