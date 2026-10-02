import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { test } from "node:test";

const workflows = new URL("../../.github/workflows/", import.meta.url);
test("external actions remain immutable except the dedicated Coding Bible main canary", async () => {
  for (const file of await readdir(workflows)) {
    if (!file.endsWith(".yml")) continue;
    const source = await readFile(new URL(file, workflows), "utf8");
    assert.doesNotMatch(
      source,
      /pull_request_target|secrets\.NPM_TOKEN|secrets\.NODE_AUTH_TOKEN/u,
    );
    for (const [, action] of source.matchAll(/uses:\s+([^\s#]+)/gu)) {
      if (
        file === "coding-bible.yml" &&
        action === "Xanhast-pf/coding-bible@main"
      )
        continue;
      if (!action.startsWith("./")) assert.match(action, /@[a-f0-9]{40}$/u);
    }
  }
});
test("branch CI verifies local full checks while heavy CI stays main-only", async () => {
  const source = await readFile(new URL("ci.yml", workflows), "utf8");
  assert.match(source, /push:\s+branches:\s+- "\*\*"/u);
  assert.doesNotMatch(source, /pull_request:|merge_group:/u);

  const attestation = source
    .split("\n  attestation:")[1]
    .split("\n  quality:")[0];
  assert.match(attestation, /if: github\.ref != 'refs\/heads\/main'/u);
  assert.match(attestation, /tooling\/attest\/verify\.mjs/u);
  assert.doesNotMatch(attestation, /pnpm install|run-checks\.mjs/u);

  const quality = source.split("\n  quality:")[1].split("\n  browser:")[0];
  assert.match(quality, /if: github\.ref == 'refs\/heads\/main'/u);
  assert.match(quality, /tooling\/trust\/run-checks\.mjs quality/u);

  const browser = source.split("\n  browser:")[1].split("\n  required:")[0];
  assert.match(browser, /if: github\.ref == 'refs\/heads\/main'/u);
  assert.match(browser, /run playwright:install:compat/u);
  assert.match(browser, /tooling\/trust\/run-checks\.mjs browser/u);
  assert.match(browser, /consumer-compat-results/u);
});

test("Required chooses attestation off main and heavy jobs on main", async () => {
  const source = await readFile(new URL("ci.yml", workflows), "utf8");
  const required = source
    .split("\n  required:")[1]
    .split("\n  pages-build:")[0];
  assert.match(required, /needs: \[attestation, quality, browser\]/u);
  assert.match(required, /TARGET_REF/u);
  assert.match(required, /test "\$ATTESTATION_RESULT" = "skipped"/u);
  assert.match(required, /test "\$QUALITY_RESULT" = "success"/u);
  assert.match(required, /test "\$BROWSER_RESULT" = "success"/u);
  assert.match(required, /test "\$ATTESTATION_RESULT" = "success"/u);
  assert.match(required, /test "\$QUALITY_RESULT" = "skipped"/u);
  assert.match(required, /test "\$BROWSER_RESULT" = "skipped"/u);
});

test("Pages consumes main-only heavy evidence after Required", async () => {
  const source = await readFile(new URL("ci.yml", workflows), "utf8");
  const pages = source
    .split("\n  pages-build:")[1]
    .split("\n  pages-deploy:")[0];
  assert.match(pages, /needs: required/u);
  assert.match(
    pages,
    /evidence-quality-\$\{\{ github\.run_id \}\}-\$\{\{ github\.run_attempt \}\}/u,
  );
  assert.match(
    pages,
    /evidence-browser-\$\{\{ github\.run_id \}\}-\$\{\{ github\.run_attempt \}\}/u,
  );
  assert.match(pages, /tooling\/trust\/generate\.mjs --require-ci/u);
});

test("Pages overrides skipped-attestation propagation without bypassing required success", async () => {
  const source = await readFile(new URL("ci.yml", workflows), "utf8");
  const build = source
    .split("\n  pages-build:")[1]
    .split("\n  pages-deploy:")[0];
  const deploy = source.split("\n  pages-deploy:")[1];

  assert.match(
    build,
    /if: >-\s+!cancelled\(\) &&\s+needs\.required\.result == 'success'/u,
  );
  assert.match(build, /needs: required/u);
  assert.match(
    deploy,
    /if: >-\s+!cancelled\(\) &&\s+needs\.pages-build\.result == 'success'/u,
  );
  assert.match(deploy, /needs: pages-build/u);
});

test("Pages builds its deployed artifact through the docs chunk-budget task", async () => {
  const source = await readFile(new URL("ci.yml", workflows), "utf8");
  const pages = source
    .split("\n  pages-build:")[1]
    .split("\n  pages-deploy:")[0];
  assert.match(
    pages,
    /- name: Build docs\s+run: node tooling\/terminal\/tasks\.mjs build:docs\s/u,
  );
  assert.doesNotMatch(pages, /pnpm\s+--filter\s+@flux-ui\/docs\s+build/u);
});

test("release scanning stays outside the signing job and dry-run is the default", async () => {
  const source = await readFile(new URL("release.yml", workflows), "utf8");
  assert.match(source, /dry_run:[\s\S]*?default: true/u);
  assert.match(
    source,
    /github\.repository == 'Xanhast-pf\/flux-ui' && github\.ref == 'refs\/heads\/main'/u,
  );
  const inventory = source.split("\n  inventory:")[1].split("\n  publish:")[0];
  const publish = source.split("\n  publish:")[1];
  assert.doesNotMatch(inventory, /id-token: write|attestations: write/u);
  assert.doesNotMatch(publish, /pnpm install|anchore\/sbom-action/u);
  assert.match(publish, /environment: npm/u);
  assert.match(publish, /needs: \[prepare, inventory\]/u);
  assert.match(publish, /trust|release\/verify\.mjs/u);
  const prepare = source.split("\n  prepare:")[1].split("\n  inventory:")[0];
  assert.match(prepare, /run playwright:install:compat/u);
  const pack = prepare.indexOf("run: node tooling/release/pack.mjs");
  const consumer = prepare.indexOf("run: pnpm flux release consumer");
  const upload = prepare.indexOf(
    "name: Upload immutable tarballs and manifest",
  );
  assert.ok(pack >= 0 && consumer > pack && upload > consumer);
});
