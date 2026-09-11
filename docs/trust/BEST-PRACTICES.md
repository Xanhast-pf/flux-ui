# OpenSSF Best Practices application worksheet

**Status: draft prepared; not submitted; no badge awarded or claimed.** This is a
maintainer worksheet, not a certification or a completed passing-criteria review.
It deliberately leaves account-, personnel- and history-dependent answers open.

## Project identity

| Field                                         | Draft answer                                                                                                                              |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Project name                                  | Flux UI                                                                                                                                   |
| Repository                                    | https://github.com/Xanhast-pf/flux-ui                                                                                                     |
| Project website                               | https://xanhast-pf.github.io/flux-ui/                                                                                                     |
| Description                                   | An alpha React UI system with semantic tokens, static styles, composable components, live documentation and explicit engineering budgets. |
| Primary languages                             | TypeScript, JavaScript, CSS                                                                                                               |
| License                                       | MIT; confirm all included third-party assets and dependencies separately.                                                                 |
| Applicant / authorized project representative | Maintainer must supply and verify.                                                                                                        |
| Contact / enrollment identifier               | Not supplied; no account or project ID fabricated.                                                                                        |

## Evidence to review before answering the official criteria

| Area                         | Repository evidence                                                | Remaining verification                                                                                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Public project and source    | README, LICENSE, Git source, documentation                         | Confirm public visibility, source availability and accurate license scope.                                                                                                                 |
| Contribution process         | CONTRIBUTING.md, PR template, component generator                  | Confirm the process is actively used, reviews happen, and contributors can report problems.                                                                                                |
| Version control and releases | Git history, Changesets, package metadata, release workflow        | Verify actual versioned releases, change documentation, user notifications and maintained release practice. No release history is inferred from workflow files.                            |
| Build and automated tests    | pnpm check, unit tests, Chromium behavior and axe, perf/size gates | Link actual passing runs for the assessed commit; review coverage and whether requirements are exercised. Do not invent a coverage percentage.                                             |
| Static analysis              | TypeScript, ESLint, Coding Bible, CodeQL workflow                  | Enable and run the scans, inspect their results, and document triage. A configured scan is not a completed review.                                                                         |
| Dynamic analysis             | Browser interaction tests and scoped axe scans                     | Assess the current official dynamic-security-analysis requirements separately. Accessibility tests are not a substitute for security-oriented analysis, fuzzing or other required methods. |
| Dependency hygiene           | Frozen lockfile, Dependabot, dependency review and full audits     | Confirm alerts/settings, vulnerability triage and timely remediation with real history.                                                                                                    |
| Vulnerability reporting      | SECURITY.md                                                        | Enable the private reporting route and confirm that the maintainer monitors it. Validate any response/disclosure commitments before asserting them.                                        |
| Secure development knowledge | Architecture and security-boundary documentation                   | A maintainer must answer questions about actual personnel competence and practices. The repository cannot establish someone's knowledge or training.                                       |
| Cryptography                 | No project-specific cryptographic protocol is claimed              | Review the code and dependency usage; use “not applicable” only when the official criterion permits it and the rationale is accurate.                                                      |
| Release integrity            | OIDC release path, tarball hashes, provenance, SPDX attestations   | Complete owner setup and verify a real release. Do not assert SLSA level, reproducibility, audit or certification.                                                                         |
| Governance and continuity    | Contribution and security reporting documentation                  | Confirm ownership, decision/review authority and actual response processes. Do not invent a security team or service-level agreement.                                                      |

## Submission procedure

Visit the official [OpenSSF Best Practices site](https://www.bestpractices.dev/),
sign in as an authorized project representative and create or claim the Flux UI
project. Use the current **passing** criteria presented by the application; this
worksheet groups evidence but does not reproduce every criterion or its exact IDs.
Record an evidence URL and accurate rationale for each answer. Mark unmet items
honestly, and use “not applicable” only where allowed.

Review every answer with the maintainer, submit, and record the actual public
project ID/URL and assessed revision. Only then consider displaying the provider's
real status. Keep the Trust Center's prepared/not-submitted wording until an
actual submission is confirmed; never replace it with a hand-made green badge.

The application draft JSON is an internal checklist with its own schema, **not**
an official service schema or an API submission request. No service credentials,
personal contact data, self-assigned score or presumed approval are included.
