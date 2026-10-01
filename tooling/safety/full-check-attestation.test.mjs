import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  FULL_CHECK_NOTE_REF,
  recordLocalFullCheckReceipt,
  repositoryIdentity,
  verifyFullCheckNote,
  writeFullCheckNote,
} from "../attest/full-check.mjs";
import { runPrePush } from "../attest/pre-push.mjs";

function git(cwd, ...args) {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "flux-ui-attest-test-"));
  const repository = join(root, "repo");
  const remote = join(root, "remote.git");
  mkdirSync(repository);
  git(repository, "init", "--quiet");
  git(repository, "config", "user.name", "Flux UI Test");
  git(repository, "config", "user.email", "flux-ui-test@example.invalid");
  writeFileSync(join(repository, ".gitignore"), ".cache/\n");
  writeFileSync(join(repository, "source.txt"), "first\n");
  git(repository, "add", ".");
  git(
    repository,
    "-c",
    "commit.gpgsign=false",
    "commit",
    "--quiet",
    "-m",
    "fixture",
  );
  execFileSync("git", ["init", "--quiet", "--bare", remote]);
  git(repository, "remote", "add", "origin", remote);
  return { root, repository, remote };
}

function pushInput(repository) {
  const commit = git(repository, "rev-parse", "HEAD");
  return `refs/heads/main ${commit} refs/heads/main ${"0".repeat(40)}\n`;
}

test("full-check receipt and note bind to the exact commit and ignore commit signing", () => {
  const { root, repository } = fixture();
  try {
    git(repository, "config", "commit.gpgsign", "true");
    const recorded = recordLocalFullCheckReceipt(repository);
    assert.equal(recorded.recorded, true);
    const identity = repositoryIdentity(repository);
    assert.equal(recorded.receipt.commit, identity.commit);
    assert.equal(recorded.receipt.tree, identity.tree);

    writeFullCheckNote(repository, identity.commit, recorded.receipt);
    const verified = verifyFullCheckNote(repository, identity.commit);
    assert.equal(verified.valid, true);
    assert.equal(verified.match, "commit");

    git(
      repository,
      "-c",
      "commit.gpgsign=false",
      "commit",
      "--quiet",
      "--allow-empty",
      "-m",
      "metadata-only",
    );
    const metadataOnly = git(repository, "rev-parse", "HEAD");
    assert.equal(verifyFullCheckNote(repository, metadataOnly).valid, false);
    const matchingTree = verifyFullCheckNote(
      repository,
      metadataOnly,
      undefined,
      { allowTreeMatch: true },
    );
    assert.equal(matchingTree.valid, true);
    assert.equal(matchingTree.match, "tree");

    writeFileSync(join(repository, "source.txt"), "changed\n");
    git(repository, "add", "source.txt");
    git(
      repository,
      "-c",
      "commit.gpgsign=false",
      "commit",
      "--quiet",
      "-m",
      "changed",
    );
    const changedCommit = git(repository, "rev-parse", "HEAD");
    assert.equal(verifyFullCheckNote(repository, changedCommit).valid, false);
    assert.equal(
      verifyFullCheckNote(repository, changedCommit, undefined, {
        allowTreeMatch: true,
      }).valid,
      false,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("pre-push publishes a cached receipt as a Git note and reuses the remote note", () => {
  const { root, repository, remote } = fixture();
  try {
    const recorded = recordLocalFullCheckReceipt(repository);
    assert.equal(recorded.recorded, true);
    let fullChecks = 0;
    const first = runPrePush({
      remote: "origin",
      input: pushInput(repository),
      repositoryRoot: repository,
      executeFullCheck() {
        fullChecks += 1;
      },
    });
    assert.equal(first.reason, "attested");
    assert.equal(fullChecks, 0);
    assert.match(
      git(remote, "show-ref", FULL_CHECK_NOTE_REF),
      /^[0-9a-f]{40}\s+refs\/notes\/flux-full-check$/u,
    );

    rmSync(join(repository, ".cache"), { recursive: true, force: true });
    const second = runPrePush({
      remote: "origin",
      input: pushInput(repository),
      repositoryRoot: repository,
      executeFullCheck() {
        throw new Error("full check should not run twice");
      },
    });
    assert.equal(second.reason, "remote-note");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("pre-push synchronizes the frozen install before an uncached full gate", () => {
  const { root, repository } = fixture();
  try {
    const events = [];
    const result = runPrePush({
      remote: "origin",
      input: pushInput(repository),
      repositoryRoot: repository,
      prepareWorkspace() {
        events.push("install");
      },
      executeFullCheck() {
        events.push("full-check");
        const recorded = recordLocalFullCheckReceipt(repository);
        assert.equal(recorded.recorded, true);
      },
    });
    assert.equal(result.reason, "attested");
    assert.deepEqual(events, ["install", "full-check"]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("pre-push aborts before the full gate when workspace synchronization fails", () => {
  const { root, repository } = fixture();
  try {
    let fullChecks = 0;
    assert.throws(
      () =>
        runPrePush({
          remote: "origin",
          input: pushInput(repository),
          repositoryRoot: repository,
          prepareWorkspace() {
            throw new Error("install failed");
          },
          executeFullCheck() {
            fullChecks += 1;
          },
        }),
      /install failed/u,
    );
    assert.equal(fullChecks, 0);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("pre-push rejects a dirty tree before running the expensive gate", () => {
  const { root, repository } = fixture();
  try {
    writeFileSync(join(repository, "dirty.txt"), "dirty\n");
    let fullChecks = 0;
    assert.throws(
      () =>
        runPrePush({
          remote: "origin",
          input: pushInput(repository),
          repositoryRoot: repository,
          executeFullCheck() {
            fullChecks += 1;
          },
        }),
      /working tree must be clean/u,
    );
    assert.equal(fullChecks, 0);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
