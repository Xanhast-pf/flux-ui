# Candidate consumer verification

`pnpm consumer:packed` is an opt-in validation command, not a publish action and not an automatic change to CI/release policy.

## Preconditions

Use Node 24 or newer, pnpm 10.34.5, the frozen repository lockfile and all three Playwright browser binaries. Prepare approved non-placeholder public versions through the existing Changesets process, build the packages, and run the existing `pnpm release:pack`. This implementation deliberately does not bump versions or accept new size/performance baselines.

The command reads `.cache/release/manifest.json`, verifies its schema, candidate identities, digests and packed metadata, then copies the exact bytes into a unique system temporary directory outside the monorepo. Flux dependencies, including transitive Flux resolution, use only those local archive files. Tool versions come from the repository's installed packages and are written as exact versions in the isolated project. Install scripts are disabled. Dependencies still require an available registry/cache; this is not an offline test.

The built consumer compiles public emitted declarations, builds without source aliases, and runs the existing tests plus new interaction checks in Chromium, Firefox and WebKit. Every exported scene recipe is then installed and built against the same candidate artifacts. The current compatibility tests are intentionally not skipped when an engine exposes a failure.

## Evidence and identity

`.cache/release/packed-consumer-result.json` records the candidate manifest hash, package digests, actual tool versions, commands and statuses, browser-workspace location and recipe lock hashes. The generated consumer lockfiles, browser report and traces remain in the printed temporary directory for inspection. The command does not remove unrelated files or clean the source tree. Delete its printed temporary directory manually after retaining evidence.

A local invocation accepts only a local manifest. In GitHub Actions the archive identity must match the real repository, SHA, run ID and attempt; the existing publisher verifier runs as an additional check. Never fill CI variables with values copied from a manifest to bypass this boundary. This result is not a signed attestation and does not replace the existing publishing verifier.

## Release integration requires an explicit owner decision

To make this mandatory, add the command to the existing non-publishing validation job after packing, install the required browsers there, retain its evidence/lockfiles, and require its success before approving publication. Keep publishing permissions isolated. This implementation does not edit workflow permissions, trust policies or publication environments.

The public versions remain `0.0.0` in the supplied source. A normal release pack is expected to reject them until the owner approves a real version and channel. Do not work around that guard.
