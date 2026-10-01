import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { commands } from "../terminal/commands.mjs";

export const FULL_CHECK_NOTE_REF = "refs/notes/flux-full-check";
export const FULL_CHECK_RECEIPT_PATH = ".cache/full-check/receipt.json";
export const FULL_CHECK_COMMAND = "pnpm flux check full";

function runGit(root, args, { allowedStatuses = [0] } = {}) {
  const result = spawnSync("git", ["-c", `safe.directory=${root}`, ...args], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.error) throw result.error;
  if (!allowedStatuses.includes(result.status)) {
    throw new Error(
      `git ${args.join(" ")} failed with exit code ${result.status}: ${result.stderr.trim()}`,
    );
  }
  return result;
}

export function gitOutput(root, args) {
  return runGit(root, args).stdout.trim();
}

export function gitStatus(root, args, allowedStatuses = [0]) {
  return runGit(root, args, { allowedStatuses }).status;
}

export function fullCheckPipelineSha256() {
  return createHash("sha256")
    .update(JSON.stringify(commands["check:full"]))
    .digest("hex");
}

export function repositoryIdentity(root, revision = "HEAD") {
  return {
    commit: gitOutput(root, ["rev-parse", `${revision}^{commit}`]),
    tree: gitOutput(root, ["rev-parse", `${revision}^{tree}`]),
  };
}

export function workingTreeIsClean(root) {
  return (
    gitOutput(root, ["status", "--porcelain=v1", "--untracked-files=all"]) ===
    ""
  );
}

export function createFullCheckReceipt(root, finishedAt = new Date()) {
  const identity = repositoryIdentity(root);
  return {
    schemaVersion: 1,
    kind: "flux-full-check",
    status: "passed",
    command: FULL_CHECK_COMMAND,
    commit: identity.commit,
    tree: identity.tree,
    pipelineSha256: fullCheckPipelineSha256(),
    nodeVersion: process.version,
    finishedAt: finishedAt.toISOString(),
  };
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function validateFullCheckReceiptShape(value) {
  return (
    isRecord(value) &&
    value.schemaVersion === 1 &&
    value.kind === "flux-full-check" &&
    value.status === "passed" &&
    value.command === FULL_CHECK_COMMAND &&
    /^[a-f0-9]{40,64}$/u.test(value.commit ?? "") &&
    /^[a-f0-9]{40,64}$/u.test(value.tree ?? "") &&
    value.pipelineSha256 === fullCheckPipelineSha256() &&
    typeof value.nodeVersion === "string" &&
    /^v24\./u.test(value.nodeVersion) &&
    typeof value.finishedAt === "string" &&
    Number.isFinite(Date.parse(value.finishedAt))
  );
}

export function validateFullCheckReceipt(value, identity) {
  return (
    validateFullCheckReceiptShape(value) &&
    value.commit === identity.commit &&
    value.tree === identity.tree
  );
}

export function receiptPath(root) {
  return resolve(root, FULL_CHECK_RECEIPT_PATH);
}

export function readLocalFullCheckReceipt(root) {
  try {
    return JSON.parse(readFileSync(receiptPath(root), "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

export function recordLocalFullCheckReceipt(root, finishedAt = new Date()) {
  if (!workingTreeIsClean(root)) {
    return { recorded: false, reason: "dirty", receipt: null };
  }
  const receipt = createFullCheckReceipt(root, finishedAt);
  const path = receiptPath(root);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(receipt, null, 2)}\n`);
  return { recorded: true, reason: null, receipt };
}

export function readFullCheckNote(root, commit, noteRef = FULL_CHECK_NOTE_REF) {
  const result = runGit(root, ["notes", `--ref=${noteRef}`, "show", commit], {
    allowedStatuses: [0, 1],
  });
  if (result.status === 1) return null;
  try {
    return JSON.parse(result.stdout);
  } catch {
    return null;
  }
}

function readJsonGitObject(root, objectId) {
  try {
    return JSON.parse(gitOutput(root, ["cat-file", "-p", objectId]));
  } catch {
    return null;
  }
}

function findFullCheckReceiptForTree(
  root,
  tree,
  noteRef = FULL_CHECK_NOTE_REF,
) {
  const result = runGit(root, ["notes", `--ref=${noteRef}`, "list"], {
    allowedStatuses: [0, 1],
  });
  if (result.status === 1 || !result.stdout.trim()) return null;

  for (const line of result.stdout.trim().split("\n")) {
    const [noteObject, annotatedCommit] = line.trim().split(/\s+/u);
    if (!noteObject || !annotatedCommit) continue;
    const receipt = readJsonGitObject(root, noteObject);
    if (
      validateFullCheckReceiptShape(receipt) &&
      receipt.commit === annotatedCommit &&
      receipt.tree === tree
    ) {
      return receipt;
    }
  }
  return null;
}

export function writeFullCheckNote(
  root,
  commit,
  receipt,
  noteRef = FULL_CHECK_NOTE_REF,
) {
  runGit(root, [
    "-c",
    "user.name=Flux UI Local Check",
    "-c",
    "user.email=flux-ui@local.invalid",
    "-c",
    "commit.gpgsign=false",
    "notes",
    `--ref=${noteRef}`,
    "add",
    "--force",
    "--message",
    JSON.stringify(receipt),
    commit,
  ]);
}

export function verifyFullCheckNote(
  root,
  commit,
  noteRef = FULL_CHECK_NOTE_REF,
  { allowTreeMatch = false } = {},
) {
  const identity = repositoryIdentity(root, commit);
  const exactReceipt = readFullCheckNote(root, identity.commit, noteRef);
  if (
    exactReceipt !== null &&
    validateFullCheckReceipt(exactReceipt, identity)
  ) {
    return {
      valid: true,
      match: "commit",
      receipt: exactReceipt,
      identity,
    };
  }

  if (allowTreeMatch) {
    const treeReceipt = findFullCheckReceiptForTree(
      root,
      identity.tree,
      noteRef,
    );
    if (treeReceipt !== null) {
      return {
        valid: true,
        match: "tree",
        receipt: treeReceipt,
        identity,
      };
    }
  }

  return {
    valid: false,
    match: null,
    receipt: exactReceipt,
    identity,
  };
}
