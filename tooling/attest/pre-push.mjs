import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  FULL_CHECK_NOTE_REF,
  gitStatus,
  readLocalFullCheckReceipt,
  repositoryIdentity,
  validateFullCheckReceipt,
  verifyFullCheckNote,
  workingTreeIsClean,
  writeFullCheckNote,
} from "./full-check.mjs";

const defaultRoot = fileURLToPath(new URL("../../", import.meta.url));
const zeroOid = /^0{40,64}$/u;

function parseUpdates(input) {
  return input
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [localRef, localOid, remoteRef, remoteOid] = line
        .trim()
        .split(/\s+/u);
      return { localRef, localOid, remoteRef, remoteOid };
    });
}

export function workspaceInstallCommand(platform = process.platform) {
  if (platform === "win32") {
    return [
      "cmd.exe",
      ["/d", "/s", "/c", '"pnpm.cmd ^"install^" ^"--frozen-lockfile^""'],
      { windowsVerbatimArguments: true },
    ];
  }
  return ["pnpm", ["install", "--frozen-lockfile"], {}];
}

function synchronizeWorkspaceInstall(repositoryRoot = defaultRoot) {
  const [program, args, executableOptions] = workspaceInstallCommand();
  const result = spawnSync(program, args, {
    cwd: repositoryRoot,
    stdio: "inherit",
    ...executableOptions,
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error("Frozen workspace install failed; push aborted.");
}

function runFullCheck(repositoryRoot = defaultRoot) {
  const result = spawnSync(process.execPath, ["tooling/attest/run-full.mjs"], {
    cwd: repositoryRoot,
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error("Local full check failed; push aborted.");
}

function syncRemoteNotes(repositoryRoot, remote) {
  const status = gitStatus(
    repositoryRoot,
    ["ls-remote", "--exit-code", "--refs", remote, FULL_CHECK_NOTE_REF],
    [0, 2],
  );
  if (status === 0) {
    gitStatus(repositoryRoot, [
      "fetch",
      "--quiet",
      remote,
      `+${FULL_CHECK_NOTE_REF}:${FULL_CHECK_NOTE_REF}`,
    ]);
  }
}

function pushNotes(repositoryRoot, remote) {
  gitStatus(repositoryRoot, [
    "push",
    "--no-verify",
    "--quiet",
    remote,
    `${FULL_CHECK_NOTE_REF}:${FULL_CHECK_NOTE_REF}`,
  ]);
}

export function runPrePush({
  remote,
  input,
  repositoryRoot = defaultRoot,
  prepareWorkspace = synchronizeWorkspaceInstall,
  executeFullCheck = runFullCheck,
} = {}) {
  if (!remote) throw new Error("pre-push did not receive a remote.");
  const branchUpdates = parseUpdates(input ?? "").filter(
    (update) =>
      update.remoteRef?.startsWith("refs/heads/") &&
      update.localOid &&
      !zeroOid.test(update.localOid),
  );

  if (branchUpdates.length === 0)
    return { checked: false, reason: "no-branch" };

  if (!workingTreeIsClean(repositoryRoot)) {
    throw new Error(
      "Push blocked: the working tree must be clean so the local full-check attestation matches the exact pushed commit.",
    );
  }

  const head = repositoryIdentity(repositoryRoot);
  for (const update of branchUpdates) {
    if (update.localOid !== head.commit) {
      throw new Error(
        `Push blocked: ${update.localRef} points to ${update.localOid.slice(0, 12)}, but the checked-out HEAD is ${head.commit.slice(0, 12)}. Push checked-out branches separately so each tip can be attested.`,
      );
    }
  }

  syncRemoteNotes(repositoryRoot, remote);
  const existing = verifyFullCheckNote(repositoryRoot, head.commit);
  if (existing.valid) {
    console.log(
      `Full-check attestation already present for ${head.commit.slice(0, 12)}.`,
    );
    return {
      checked: false,
      reason: "remote-note",
      receipt: existing.receipt,
    };
  }

  let receipt = readLocalFullCheckReceipt(repositoryRoot);
  if (!validateFullCheckReceipt(receipt, head)) {
    console.log(
      `No reusable full-check receipt for ${head.commit.slice(0, 12)}; synchronizing the frozen workspace install before running pnpm flux check full locally.`,
    );
    prepareWorkspace(repositoryRoot);
    if (!workingTreeIsClean(repositoryRoot)) {
      throw new Error(
        "Push blocked: workspace synchronization changed tracked files.",
      );
    }
    executeFullCheck(repositoryRoot);
    receipt = readLocalFullCheckReceipt(repositoryRoot);
  }

  if (!validateFullCheckReceipt(receipt, head)) {
    throw new Error(
      "Full check completed without producing a valid receipt for the pushed commit.",
    );
  }

  writeFullCheckNote(repositoryRoot, head.commit, receipt);
  pushNotes(repositoryRoot, remote);
  console.log(`Full-check attestation pushed for ${head.commit.slice(0, 12)}.`);
  return { checked: true, reason: "attested", receipt };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const remote = process.argv[2];
    const input = readFileSync(0, "utf8");
    runPrePush({ remote, input });
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
