import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { test } from "node:test";

const workflows = new URL("../../.github/workflows/", import.meta.url);
test("all external workflow actions remain immutable and no privileged PR checkout is introduced", async () => {
  for (const file of await readdir(workflows)) {
    if (!file.endsWith(".yml")) continue;
    const source = await readFile(new URL(file, workflows), "utf8");
    assert.doesNotMatch(
      source,
      /pull_request_target|secrets\.NPM_TOKEN|secrets\.NODE_AUTH_TOKEN/u,
    );
    for (const [, action] of source.matchAll(/uses:\s+([^\s#]+)/gu)) {
      if (!action.startsWith("./")) assert.match(action, /@[a-f0-9]{40}$/u);
    }
  }
});
test("Pages consumes same-attempt evidence only after the Required gate", async () => {
  const source = await readFile(new URL("ci.yml", workflows), "utf8");
  assert.match(source, /needs: \[quality, browser\]/u);
  assert.match(source, /needs: required/u);
  assert.match(source, /trust\/generate\.mjs --require-ci/u);
  assert.match(
    source,
    /evidence-quality-\$\{\{ github\.run_id \}\}-\$\{\{ github\.run_attempt \}\}/u,
  );
  assert.match(
    source,
    /evidence-browser-\$\{\{ github\.run_id \}\}-\$\{\{ github\.run_attempt \}\}/u,
  );
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
});
