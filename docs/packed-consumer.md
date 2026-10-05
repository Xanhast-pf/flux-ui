# Candidate consumer verification

`pnpm flux release consumer` verifies the exact archives produced by `pnpm flux
release pack`. It is a validation command, not a publish action: it does not bump
versions, accept baselines, change workflow policy, or publish packages.

## Where consumer verification runs

`pnpm flux check full` already includes `pnpm flux test consumer`, which rebuilds
the public packages and verifies emitted exports, declarations, CSS integration,
and the normal built-consumer browser fixture. That source-workspace gate is
required development evidence, but it is not a substitute for testing the exact
release tarballs.

The protected release workflow therefore runs `pnpm flux release consumer` after
`tooling/release/pack.mjs` and before immutable tarballs are uploaded. The workflow
policy tests enforce that order. Maintainers can run the same command locally
after `pnpm flux release pack` when preparing or diagnosing a reviewed candidate.

## Preconditions

Use Node 24 or newer, pnpm 10.34.5, the frozen repository lockfile and all three
Playwright browser binaries. Prepare approved non-placeholder public versions
through the existing Changesets process, build the packages, and run `pnpm flux
release pack` first. Public versions come from the individual package manifests
and Changesets; any public workspace still at `0.0.0` is intentionally rejected
by the release packer.

The command reads `.cache/release/manifest.json`, verifies its schema, candidate
identities, digests and packed metadata, then copies the exact bytes into a unique
system temporary directory outside the monorepo. Flux dependencies, including
transitive Flux resolution, use only those local archive files. Tool versions
come from the repository's installed packages and are written as exact versions
in the isolated project. Install scripts are disabled. Dependencies still require
an available registry/cache; this is not an offline test.

The packed consumer compiles public emitted declarations, builds without source
aliases, and runs interaction checks in Chromium, Firefox and WebKit. Every
exported scene recipe is then installed and built against the same candidate
artifacts. A browser-engine failure is not silently skipped.

## Evidence and identity

`.cache/release/packed-consumer-result.json` records the candidate manifest hash,
package digests, actual tool versions, commands and statuses, browser-workspace
location and recipe lock hashes. Generated consumer lockfiles, browser reports
and traces remain in the printed temporary directory for inspection. The command
does not remove unrelated files or clean the source tree; remove only its printed
temporary directory after retaining any evidence you need.

A local invocation accepts only a local manifest. In GitHub Actions the archive
identity must match the real repository, SHA, run ID and attempt; the existing
publisher verifier runs as an additional check. Never fill CI variables with
values copied from a manifest to bypass this boundary. This result is not a
signed attestation and does not replace the publishing verifier, provenance, or
SBOM checks.
