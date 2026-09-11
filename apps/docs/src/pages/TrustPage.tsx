import { Badge, Callout, Card, Grid, Stack } from "@flux-ui/react";
import { useEffect, useState } from "react";
import { parseEvidence, type Evidence } from "../lib/evidence.js";
import { REPOSITORY_URL, formatBytes } from "../lib/format.js";

const controls = [
  {
    title: "OpenSSF Scorecard",
    status: "Workflow configured",
    detail:
      "Automated repository-practice checks. Open the external report for its score, assessed commit and date. No score is fabricated or treated as certification.",
    href: "https://scorecard.dev/viewer/?uri=github.com/Xanhast-pf/flux-ui",
  },
  {
    title: "CodeQL + dependency review",
    status: "Workflow configured",
    detail:
      "JavaScript/TypeScript and Actions analysis, pull-request dependency review, and scheduled lockfile audits. A green scan only covers the tool’s scope at that time.",
    href: `${REPOSITORY_URL}/actions/workflows/codeql.yml`,
  },
  {
    title: "npm trusted publishing",
    status: "Owner setup required",
    detail:
      "OIDC publishing workflow and package metadata are prepared. Each npm package must authorize this repository, workflow and environment before the first automated release.",
    href: `${REPOSITORY_URL}/blob/main/docs/trust/SETUP.md`,
  },
  {
    title: "Artifact attestations + SBOM",
    status: "Generated on release",
    detail:
      "The release pipeline signs packed package digests and produces package-scoped SPDX inventories. Inspect and verify an actual release; a workflow file is not a signed artifact.",
    href: `${REPOSITORY_URL}/actions/workflows/release.yml`,
  },
  {
    title: "OpenSSF Best Practices",
    status: "Application prepared · not submitted",
    detail:
      "An evidence-backed application worksheet is in the repository. Submission and honest maintainer answers still require an account. No badge has been claimed.",
    href: `${REPOSITORY_URL}/blob/main/docs/trust/BEST-PRACTICES.md`,
  },
  {
    title: "Accessibility",
    status: "Automated + manual scope",
    detail:
      "Chromium axe and behavior checks accompany keyboard, focus and reduced-motion contracts. Automated tests and the live demo do not certify WCAG conformance.",
    href: "#accessibility",
  },
];
export function TrustPage() {
  const [evidence, setEvidence] = useState<Evidence | null>(null);
  const [message, setMessage] = useState("Loading build evidence…");
  const [viewedAt] = useState(() => Date.now());
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      setMessage("Evidence request timed out. No CI result has been verified.");
      controller.abort();
    }, 10_000);
    async function load(): Promise<void> {
      try {
        const response = await fetch(
          new URL("evidence/index.json", document.baseURI),
          { signal: controller.signal, cache: "no-store", credentials: "omit" },
        );
        if (!response.ok)
          throw new Error(
            "No generated evidence is available for this build. Local previews do not imply CI passed.",
          );
        const body = await response.text();
        if (body.length > 128_000)
          throw new Error("Evidence exceeded its size limit.");
        const contentType = response.headers.get("content-type") ?? "";
        if (
          !contentType.includes("application/json") ||
          !body.trimStart().startsWith("{")
        ) {
          throw new Error(
            "No generated evidence is available for this build. Local previews do not imply CI passed.",
          );
        }
        let data: unknown;
        try {
          data = JSON.parse(body);
        } catch {
          throw new Error(
            "Generated build evidence is malformed and cannot be verified.",
          );
        }
        const parsed = parseEvidence(data);
        if (!controller.signal.aborted) {
          setEvidence(parsed);
          setMessage("");
        }
      } catch (error) {
        if (!controller.signal.aborted)
          setMessage(
            error instanceof Error ? error.message : "Evidence is unavailable.",
          );
      } finally {
        window.clearTimeout(timeout);
      }
    }
    void load();
    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);
  const matchingBuild =
    evidence !== null &&
    evidence.source.kind === "github-actions" &&
    evidence.source.commit === import.meta.env.VITE_BUILD_COMMIT;
  const historical =
    evidence !== null &&
    viewedAt - Date.parse(evidence.generatedAt) > 7 * 24 * 60 * 60 * 1_000;
  return (
    <section className="reference-page">
      <Stack gap="lg">
        <header className="page-intro">
          <p className="eyebrow">Trust is inspectable</p>
          <h1>Evidence, not badges.</h1>
          <p className="lede">
            What we check. What we can prove. What still needs work.
          </p>
        </header>
        <Callout tone="warning">
          Flux UI is alpha. No independent security certification, audit,
          OpenSSF badge or blanket accessibility guarantee is claimed.
          Configured controls, observed CI results and externally awarded
          recognition are different things.
        </Callout>
        <Card>
          <Stack gap="md">
            <h2>Build evidence</h2>
            {message !== "" && <p role="status">{message}</p>}
            {evidence !== null && (
              <>
                <Badge
                  tone={
                    matchingBuild && evidence.status === "passed"
                      ? "accent"
                      : "neutral"
                  }
                >
                  {matchingBuild
                    ? `CI reported ${evidence.status}`
                    : "Unverified or different build"}
                </Badge>
                {!matchingBuild && (
                  <Callout tone="warning">
                    This artifact is local or does not match the displayed build
                    commit. It must not be used as proof that this version
                    passed CI.
                  </Callout>
                )}
                {historical && (
                  <Callout>
                    Historical evidence: this run is more than seven days old.
                    It describes that revision, not the latest repository state.
                  </Callout>
                )}
                <p>
                  Recorded {new Date(evidence.generatedAt).toLocaleString()} ·
                  commit <code>{evidence.source.commit ?? "local"}</code>
                </p>
                {evidence.source.kind === "github-actions" && (
                  <a
                    href={`${REPOSITORY_URL}/actions/runs/${evidence.source.runId}/attempts/${evidence.source.runAttempt}`}
                  >
                    Inspect the exact workflow run →
                  </a>
                )}
                <div className="trust-checks">
                  {evidence.jobs.map((job) => (
                    <div key={job.job}>
                      <h3>{job.job === "quality" ? "Quality" : "Browser"}</h3>
                      {job.checks.map((check) => (
                        <p key={check.id}>
                          <strong>{check.status}</strong> · {check.label}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
                <details>
                  <summary>Raw reports and SHA-256 digests</summary>
                  <p>
                    Hashes detect altered report bytes when compared with a
                    trusted manifest. This page does not cryptographically
                    verify signatures.
                  </p>
                  {evidence.files.map((file) => (
                    <p className="evidence-file" key={file.name}>
                      <a href={`evidence/${file.name}`} download>
                        {file.name}
                      </a>{" "}
                      · {formatBytes(file.bytes)}
                      <br />
                      <code>{file.sha256}</code>
                    </p>
                  ))}
                  <a href="evidence/index.json" download>
                    Evidence manifest JSON
                  </a>
                </details>
              </>
            )}
            <p className="muted">
              Only quality and Chromium checks from the same commit, workflow
              run and attempt are combined. Independent security workflows have
              their own results below.
            </p>
          </Stack>
        </Card>
        <Grid minColumnWidth="17rem" gap="md">
          {controls.map((control) => (
            <Card key={control.title}>
              <Stack gap="sm">
                <p className="eyebrow">{control.status}</p>
                <h2>{control.title}</h2>
                <p>{control.detail}</p>
                <a href={control.href}>Inspect source evidence →</a>
              </Stack>
            </Card>
          ))}
        </Grid>
        <section>
          <h2>Report a vulnerability privately.</h2>
          <p>
            Do not post exploit details in a public issue. Use GitHub’s private
            vulnerability reporting when enabled, or contact the maintainer to
            arrange a private channel as described in the security policy.
          </p>
          <p>
            <a href={`${REPOSITORY_URL}/security/policy`}>
              Security policy and reporting route →
            </a>
          </p>
        </section>
      </Stack>
    </section>
  );
}
