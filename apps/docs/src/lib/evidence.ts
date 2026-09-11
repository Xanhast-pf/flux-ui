export interface EvidenceCheck {
  id: string;
  label: string;
  status: "passed" | "failed" | "not-run";
  durationMs: number;
}
export interface EvidenceFile {
  name: string;
  sha256: string;
  bytes: number;
}
export interface Evidence {
  generatedAt: string;
  status: "passed" | "incomplete";
  source: {
    kind: "github-actions" | "local";
    commit: string | null;
    repository: string | null;
    runId: string | null;
    runAttempt: string | null;
  };
  jobs: { job: string; checks: EvidenceCheck[]; finishedAt: string }[];
  files: EvidenceFile[];
}
function record(value: unknown): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid evidence object.");
  return value as Record<string, unknown>;
}
function text(value: unknown): string {
  if (typeof value !== "string" || value.length > 2_000)
    throw new Error("Invalid evidence text.");
  return value;
}
function nullableText(value: unknown): string | null {
  return value === null ? null : text(value);
}
function timestamp(value: unknown): string {
  const result = text(value);
  if (!Number.isFinite(Date.parse(result)))
    throw new Error("Invalid evidence date.");
  return result;
}
function list(value: unknown): unknown[] {
  if (!Array.isArray(value) || value.length > 50)
    throw new Error("Invalid evidence list.");
  return value;
}
function positive(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0)
    throw new Error("Invalid evidence number.");
  return value;
}
export function parseEvidence(input: unknown): Evidence {
  const data = record(input);
  const source = record(data["source"]);
  const kind = source["kind"];
  if (
    data["schemaVersion"] !== 1 ||
    (kind !== "github-actions" && kind !== "local") ||
    (data["status"] !== "passed" && data["status"] !== "incomplete")
  )
    throw new Error("Unsupported evidence schema.");
  const identity = {
    kind,
    commit: nullableText(source["commit"]),
    repository: nullableText(source["repository"]),
    runId: nullableText(source["runId"]),
    runAttempt: nullableText(source["runAttempt"]),
  };
  if (
    kind === "github-actions" &&
    (!/^[a-f0-9]{40}$/u.test(identity.commit ?? "") ||
      identity.repository !== "Xanhast-pf/flux-ui" ||
      !/^\d+$/u.test(identity.runId ?? "") ||
      !/^\d+$/u.test(identity.runAttempt ?? ""))
  )
    throw new Error("Evidence source does not match Flux UI.");
  const jobs = list(data["jobs"]).map((item) => {
    const job = record(item);
    const checks = list(job["checks"]).map((entry): EvidenceCheck => {
      const check = record(entry);
      const status = check["status"];
      if (status !== "passed" && status !== "failed" && status !== "not-run")
        throw new Error("Invalid evidence status.");
      if (status === "passed" && check["exitCode"] !== 0)
        throw new Error("Invalid passing result.");
      return {
        id: text(check["id"]),
        label: text(check["label"]),
        status,
        durationMs: positive(check["durationMs"]),
      };
    });
    return {
      job: text(job["job"]),
      finishedAt: timestamp(job["finishedAt"]),
      checks,
    };
  });
  if (
    jobs.length !== 2 ||
    jobs[0]?.job !== "quality" ||
    jobs[1]?.job !== "browser" ||
    jobs[0].checks.map((check) => check.id).join() !==
      "quality,release-size,storybook,clean-tree" ||
    jobs[1].checks.map((check) => check.id).join() !== "browser,performance"
  )
    throw new Error("Incomplete evidence checks.");
  if (
    data["status"] === "passed" &&
    jobs.some((job) => job.checks.some((check) => check.status !== "passed"))
  )
    throw new Error("Inconsistent passing evidence.");
  const files = list(data["files"]).map((item): EvidenceFile => {
    const file = record(item);
    const name = text(file["name"]);
    const sha256 = text(file["sha256"]);
    if (
      !/^(quality|browser|size|runtime|browser-tests)\.json$/u.test(name) ||
      !/^[a-f0-9]{64}$/u.test(sha256)
    )
      throw new Error("Invalid evidence artifact.");
    const bytes = positive(file["bytes"]);
    if (bytes === 0) throw new Error("Empty evidence artifact.");
    return { name, sha256, bytes };
  });
  if (new Set(files.map((file) => file.name)).size !== 5 || files.length !== 5)
    throw new Error("Missing evidence artifacts.");
  return {
    generatedAt: timestamp(data["generatedAt"]),
    status: data["status"],
    source: { ...identity, kind },
    jobs,
    files,
  };
}
