console.error(
  "Releases use the protected GitHub 'Release packages' workflow (release.yml), not a local npm token. Prepare and commit versions with pnpm release:version; review docs/trust/SETUP.md; run the workflow with dry_run=true first.",
);
process.exitCode = 1;
