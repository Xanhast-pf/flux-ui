# Trust and release setup

This is the owner activation checklist for the implementation. **No external
account, repository setting, npm authorization, badge enrollment or release is
claimed to have been changed by adding these files.**

## 1. Validate and merge the implementation

Use Node 24 and the pinned pnpm 10.34.5 toolchain. From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm format
pnpm check
pnpm test:e2e
pnpm perf
```

`pnpm format` normalizes source formatting; the check pipeline remains strict
and non-mutating. Install Chromium with `pnpm --filter @flux-ui/docs exec
playwright install --with-deps chromium` when needed. Commit generated or
formatting changes before running the receipt wrapper's clean-tree check.

The existing `CI / Quality`, `CI / Browser` and `CI / Required` job identities are
preserved. Pages downloads only same-run evidence after Required passes, verifies
its commit/run/attempt, and builds the site with the same commit identifier.
Re-run **all jobs**, not just failed jobs, when publishing evidence after a retry:
combining different run attempts deliberately fails closed.

## 2. Activate repository controls

In GitHub repository settings, confirm the repository is public and enable the
dependency graph, Dependabot alerts/security updates, and private vulnerability
reporting. Enable secret scanning/push protection where available. The existing
Dependabot configuration also updates SHA-pinned Actions.

Use **advanced** CodeQL setup for `codeql.yml`; do not leave a conflicting default
setup running. Check both language jobs: JavaScript/TypeScript and GitHub Actions.
Review SARIF findings in Security. `dependencies.yml` runs PR dependency review
and full lockfile audits; high/critical findings and registry failures block the
audit, rather than being silently ignored. Moderate/low findings still need
triage; a high-severity gate is not a claim they are absent.

Protect `main` with pull requests and the existing `CI / Required` check. After
the new workflows have run, require Dependency review, Lockfile audit and both
CodeQL jobs as appropriate. Confirm exact displayed check names in the UI. Add
review requirements, restrict bypass permissions, and prevent force pushes.
These are repository-owner actions, not effects of this patch. CodeQL and the
independent dependency workflow are not included in the Pages evidence verdict.
The release preparation job additionally runs a fresh full lockfile audit.

Scorecard runs on main pushes and weekly. Inspect its external report, assessed
commit and timestamp before displaying a score. A score is a practice assessment,
not certification. Do not add arbitrary steps or environment blocks to its
publishing job: Scorecard validates supported workflow structure.

## 3. Set up npm OIDC for each public package

Confirm you control the `@flux-ui` npm scope and the actual package names. The
pack step discovers every non-private workspace under `packages/`; currently
these are `@flux-ui/tokens`, `@flux-ui/icons`, and `@flux-ui/react`.

Create a GitHub environment named **npm**, allow only protected `main`, require
maintainer approval where available, and review who can bypass protection. For
each npm package, configure a GitHub Actions trusted publisher:

| Field             | Exact value   |
| ----------------- | ------------- |
| Owner             | `Xanhast-pf`  |
| Repository        | `flux-ui`     |
| Workflow filename | `release.yml` |
| Environment       | `npm`         |

Do not include `.github/workflows/` in the workflow filename. Keep the repository
URL in package metadata identical to the public GitHub repository. npm requires
npm CLI 11.5.1+ and Node 22.14+ for this integration; the workflow uses Node 24 and
checks the npm version. Use GitHub-hosted runners.

**Direct publishing permission:** npm's current trusted-publisher flow permits
staged publishing by default for newly configured publishers. This workflow uses
`npm publish`, not `npm stage publish`; authorize direct publishing in the npm
publisher settings. Re-check npm's instructions when activating the integration.

Initial package creation may require an owner bootstrap before the package's
trusted-publisher settings exist. Follow npm's current package-creation flow;
do not add an automation token to this workflow to bypass missing enrollment.
After a verified OIDC release, restrict token-based publication and revoke
unneeded publishing credentials. No npm token secret is used by this workflow.

## 4. Prepare real versions and perform a dry run

The uploaded baseline's public package versions are `0.0.0`. Packing deliberately
rejects that placeholder and incompatible version/tag combinations. For the alpha
channel, enter Changesets prerelease mode before versioning:

```sh
pnpm exec changeset pre enter alpha
pnpm release:version
pnpm install --lockfile-only
pnpm format
pnpm check
```

Review and commit the versions, changelogs, prerelease state and lockfile. A stable
release uses Changesets' normal/pre-exit process and the `latest` tag. The workflow
does not bump versions, commit files or create tags on your behalf.

Run **Release packages** on `main` with `dry_run=true` and the matching npm tag.
All quality, Chromium, performance and dependency-audit gates must pass. Packages
are built and packed once, inspected, and hashed; SBOMs scan those exact tarballs
in a read-only job. The fresh publishing job has no dependency installation or
package-manager cache. Dry runs do not publish or create attestations. A dry run
does not establish that npm OIDC authorization is correctly configured.

Inspect every tarball, manifest, dependency range and SPDX inventory in Actions
artifacts. Then run with `dry_run=false` and approve the npm environment. GitHub
attestations bind provenance and the SBOM to the tarball digest. npm publishes the
same tarball with provenance, ignores lifecycle scripts, and refuses token fallback.
Existing versions are skipped only when npm reports identical SHA-512 integrity;
different bytes fail. Registry errors other than an explicit 404 fail closed.

Publishing multiple packages is not atomic. Inspect all matrix jobs if a release
partially succeeds. Re-run from the same revision only after checking immutable
version contents; do not overwrite or quietly retag existing versions. Because
all public workspaces are packed, any changed archive requires its own version
bump, even when its source API did not change.

## 5. Verify a real release

Obtain the tarball and verification bundles from the successful workflow artifact
or fetch the published package. Verify with an up-to-date GitHub CLI:

```sh
gh attestation verify flux-ui-react-VERSION.tgz --repo Xanhast-pf/flux-ui
gh attestation verify flux-ui-react-VERSION.tgz --repo Xanhast-pf/flux-ui \
  --predicate-type https://spdx.dev/Document
```

Replace VERSION with the exact version. Inspect the verified workflow identity,
commit, digest and predicate; a file name is not an identity. Compare the
published npm `dist.integrity` to the manifest and inspect npm provenance in the
registry. The Trust Center lists hashes but does **not** verify signatures in the
browser. Attestations prove origin/integrity under their trust model, not absence
of defects, reproducibility, or a SLSA certification.

The SPDX inventory describes packages discoverable in an individual distributed
tarball. It does **not** include the entire build-tool dependency closure or the
consumer application's resolved React/peer dependency graph. Dependency audits
cover a separate, broader lockfile scope. Workflow artifacts have 90-day retention;
archive release evidence longer when your release policy requires it. No GitHub
Release entry or assets are automatically created.

## 6. Apply for OpenSSF Best Practices

Use [the prepared worksheet](BEST-PRACTICES.md) and
[application draft](best-practices.application.json). An authorized maintainer
must create/claim the project on bestpractices.dev, verify each criterion against
current evidence, answer maintainer-specific questions and submit. Do not upload
the draft JSON as though it were a supported API payload. Do not claim a badge or
mark all criteria met simply because tooling has been added.

## Source documentation

Checked against the official documentation on 2026-09-10:

- [npm trusted publishers](https://docs.npmjs.com/trusted-publishers/)
- [GitHub artifact attestations action](https://github.com/actions/attest)
- [OpenSSF Scorecard Action constraints](https://github.com/ossf/scorecard-action)
- [CodeQL Action](https://github.com/github/codeql-action)
- [Dependency Review Action](https://github.com/actions/dependency-review-action)
- [Anchore SBOM Action](https://github.com/anchore/sbom-action)
- [pnpm 10 pack](https://pnpm.io/10.x/cli/pack)
- [OpenSSF Best Practices](https://www.bestpractices.dev/)

### Built-package browser receipt

The Browser job also runs `pnpm consumer:check`. The same-commit public evidence
requires its successful `consumer` check and `consumer-tests.json`; missing,
failed or flaky consumer results block publication. This tests built public
exports and styles without docs aliases. It is not an npm-publishing attestation.
