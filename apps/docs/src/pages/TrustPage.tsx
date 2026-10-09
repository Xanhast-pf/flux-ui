import {
  StatusBadge,
  Callout,
  Card,
  Code,
  Collapsible,
  Grid,
  Heading,
  Link,
  PageHeader,
  Stack,
  Text,
} from "@varua/flux-ui";
import { useEffect, useState } from "react";
import { parseEvidence, type Evidence } from "../lib/evidence.js";
import { REPOSITORY_URL, formatBytes } from "../lib/format.js";
const controls = [
  {
    title: "OpenSSF Scorecard",
    status: "Workflow configured",
    detail:
      "Automated repository checks. Verify the score and commit in the report.",
    href: "https://scorecard.dev/viewer/?uri=github.com/Xanhast-pf/flux-ui",
  },
  {
    title: "CodeQL + dependency review",
    status: "Workflow configured",
    detail: "Code, Actions, and dependency scans. Each covers a limited scope.",
    href: `${REPOSITORY_URL}/actions/workflows/codeql.yml`,
  },
  {
    title: "npm trusted publishing",
    status: "Owner setup required",
    detail:
      "Publishing is configured, but npm owner approval is still required.",
    href: `${REPOSITORY_URL}/blob/main/docs/trust/SETUP.md`,
  },
  {
    title: "Artifact attestations + SBOM",
    status: "Generated on release",
    detail:
      "Release builds produce attestations and SBOMs. Verify released files.",
    href: `${REPOSITORY_URL}/actions/workflows/release.yml`,
  },
  {
    title: "OpenSSF Best Practices",
    status: "Application prepared · not submitted",
    detail: "Application drafted, not submitted. No badge is claimed.",
    href: `${REPOSITORY_URL}/blob/main/docs/trust/BEST-PRACTICES.md`,
  },
  {
    title: "Accessibility",
    status: "Automated + manual scope",
    detail:
      "Axe and browser checks run automatically. Manual WCAG testing is still needed.",
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
    }, 10000);
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
        if (body.length > 128000)
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
    viewedAt - Date.parse(evidence.generatedAt) > 7 * 24 * 60 * 60 * 1000;
  return (
    <Stack className="reference-page" as="section" gap="lg">
      <Stack gap="lg">
        <PageHeader
          title={<>Trust and security</>}
          eyebrow={<>Checks and limits</>}
        >
          <Text as="p" variant="lead" tone="muted">
            Security checks and build evidence.
          </Text>
        </PageHeader>
        <Callout tone="warning">
          Flux UI is pre-stable. Security workflows and test results are not
          independent certification or an accessibility guarantee.
        </Callout>
        <Card>
          <Stack gap="md">
            <Heading level={2} size="lg">
              Build evidence
            </Heading>
            {message !== "" && (
              <Text role="status" as="p" variant="body">
                {message}
              </Text>
            )}
            {evidence !== null && (
              <>
                <StatusBadge
                  tone={
                    matchingBuild && evidence.status === "passed"
                      ? "accent"
                      : "neutral"
                  }
                >
                  {matchingBuild
                    ? `CI reported ${evidence.status}`
                    : "Unverified or different build"}
                </StatusBadge>
                {!matchingBuild && (
                  <Callout tone="warning">
                    This evidence does not match this build. CI status is
                    unverified.
                  </Callout>
                )}
                {historical && (
                  <Callout>This evidence is over seven days old.</Callout>
                )}
                <Text as="p" variant="body">
                  Recorded {new Date(evidence.generatedAt).toLocaleString()} ·
                  commit <Code>{evidence.source.commit ?? "local"}</Code>
                </Text>
                {evidence.source.kind === "github-actions" && (
                  <Link
                    href={`${REPOSITORY_URL}/actions/runs/${evidence.source.runId}/attempts/${evidence.source.runAttempt}`}
                  >
                    Inspect the exact workflow run →
                  </Link>
                )}
                <Grid minColumnWidth="17rem" gap="md">
                  {evidence.jobs.map((job) => (
                    <Stack key={job.job} gap="md">
                      <Heading level={3} size="md">
                        {job.job === "quality" ? "Quality" : "Browser"}
                      </Heading>
                      {job.checks.map((check) => (
                        <Text key={check.id} as="p" variant="body">
                          <Text as="strong" weight="bold">
                            {check.status}
                          </Text>{" "}
                          · {check.label}
                        </Text>
                      ))}
                    </Stack>
                  ))}
                </Grid>
                <Collapsible.Root>
                  <Collapsible.Trigger>
                    Raw reports and SHA-256 digests
                  </Collapsible.Trigger>
                  <Text as="p" variant="body">
                    Compare hashes with a trusted manifest. Signatures are not
                    verified here.
                  </Text>
                  {evidence.files.map((file) => (
                    <Text key={file.name} variant="caption" as="p">
                      <Link href={`evidence/${file.name}`} download>
                        {file.name}
                      </Link>{" "}
                      · {formatBytes(file.bytes)}
                      <br />
                      <Code>{file.sha256}</Code>
                    </Text>
                  ))}
                  <Link href="evidence/index.json" download>
                    Evidence manifest JSON
                  </Link>
                </Collapsible.Root>
              </>
            )}
            <Text as="p" variant="body" tone="muted">
              Build results share one commit and workflow run. Security scans
              are separate.
            </Text>
          </Stack>
        </Card>
        <Grid minColumnWidth="17rem" gap="md">
          {controls.map((control) => (
            <Card key={control.title}>
              <Stack gap="sm">
                <Text as="p" variant="eyebrow" tone="muted">
                  {control.status}
                </Text>
                <Heading level={2} size="lg">
                  {control.title}
                </Heading>
                <Text as="p" variant="body">
                  {control.detail}
                </Text>
                <Link href={control.href}>View evidence →</Link>
              </Stack>
            </Card>
          ))}
        </Grid>
        <Stack as="section" gap="lg">
          <Heading level={2} size="lg">
            Report a vulnerability
          </Heading>
          <Text as="p" variant="body">
            Use private vulnerability reporting. Never post exploit details
            publicly.
          </Text>
          <Text as="p" variant="body">
            <Link href={`${REPOSITORY_URL}/security/policy`}>
              Security policy and reporting route →
            </Link>
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
}
