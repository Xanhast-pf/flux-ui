import {
  Box,
  Button,
  Callout,
  Card,
  Checkbox,
  Code,
  Field,
  Heading,
  Inline,
  Input,
  Link,
  PageHeader,
  Stack,
  Text,
} from "@flux-ui/react";
import type { AxeResults } from "axe-core";
import { useEffect, useRef, useState } from "react";
import { downloadJson } from "../lib/download.js";
export function AccessibilityPage() {
  const sample = useRef<HTMLElement>(null);
  const active = useRef(false);
  const mounted = useRef<boolean>(true);
  const [broken, setBroken] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<AxeResults | null>(null);
  const [message, setMessage] = useState(
    "Not scanned. The axe engine loads only when you run a scan.",
  );
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  async function scan(): Promise<void> {
    if (active.current) return;
    active.current = true;
    setRunning(true);
    setResult(null);
    setMessage("Loading axe and scanning this demo…");
    try {
      const { default: axe } = await import("axe-core");
      const target = sample.current;
      if (target === null) return;
      const results = await axe.run(target, {
        runOnly: {
          type: "tag",
          values: [
            "wcag2a",
            "wcag2aa",
            "wcag21a",
            "wcag21aa",
            "wcag22aa",
            "best-practice",
          ],
        },
        resultTypes: ["violations", "incomplete", "passes", "inapplicable"],
      });
      if (mounted.current) {
        setResult(results);
        setMessage(
          `Scan complete: ${results.violations.length} violation rules, ${results.incomplete.length} checks needing review. This is not a certification.`,
        );
      }
    } catch (error) {
      if (mounted.current)
        setMessage(
          error instanceof Error
            ? error.message
            : "The accessibility scan failed.",
        );
    } finally {
      active.current = false;
      if (mounted.current) setRunning(false);
    }
  }
  return (
    <Stack className="reference-page" as="section" gap="lg">
      <Stack gap="lg">
        <PageHeader
          title={<>Run a real accessibility scan.</>}
          eyebrow={<>Accessibility you can inspect</>}
        >
          <Text as="p" variant="lead" tone="muted">
            A working demo. A real axe engine. Findings you can reproduce.
          </Text>
        </PageHeader>
        <Callout>
          Scans run locally on the sample below, not the whole site or your
          application. Zero detected violations is not WCAG compliance. Manual
          keyboard, screen-reader and interaction testing still matters.
        </Callout>
        <Card>
          <Stack gap="md">
            <Card
              ref={sample}
              aria-labelledby="axe-sample-title"
              as="section"
              padding={6}
            >
              <Stack gap="lg">
                <Stack gap="md">
                  <Heading id="axe-sample-title" level={2} size="lg">
                    A small settings panel
                  </Heading>
                  <Field.Root id="axe-demo-name">
                    <Field.Label>Display name</Field.Label>
                    <Field.Control>
                      <Input defaultValue="Alex" />
                    </Field.Control>
                    <Field.Description>
                      Visible to your teammates.
                    </Field.Description>
                  </Field.Root>
                  <Inline gap="sm" wrap>
                    <Button>Save preferences</Button>
                    <Button
                      variant="outline"
                      tone="neutral"
                      aria-label={broken ? undefined : "Add to favourites"}
                    >
                      <Text aria-hidden="true">+</Text>
                    </Button>
                  </Inline>
                </Stack>
              </Stack>
            </Card>
            <Field.Root>
              <Field.Label>
                Introduce an intentional missing button name
              </Field.Label>
              <Field.Control>
                <Checkbox
                  checked={broken}
                  disabled={running}
                  onChange={(event) => {
                    setBroken(event.target.checked);
                    setResult(null);
                    setMessage(
                      "Demo changed. Run another scan for current results.",
                    );
                  }}
                />
              </Field.Control>
            </Field.Root>
            {broken && (
              <Callout tone="warning">
                Intentional teaching defect: the icon-only button above now has
                no accessible name. Turn off this switch to repair it.
              </Callout>
            )}
            <Inline gap="sm" wrap>
              <Button
                disabled={running}
                onClick={() => {
                  void scan();
                }}
              >
                Run axe scan
              </Button>
              {result !== null && (
                <Button
                  variant="outline"
                  tone="neutral"
                  onClick={() => {
                    downloadJson(result, "flux-ui-axe-report.json");
                  }}
                >
                  Export axe JSON
                </Button>
              )}
            </Inline>
            <Text role="status" as="p" variant="body">
              {message}
            </Text>
          </Stack>
        </Card>
        {result !== null && (
          <Stack aria-label="Accessibility scan results" as="section" gap="lg">
            <Stack gap="md">
              <Heading level={2} size="lg">
                What axe found
              </Heading>
              <Text as="p" variant="body">
                axe-core {result.testEngine.version} ·{" "}
                {new Date(result.timestamp).toLocaleString()} ·{" "}
                {result.passes.length} passing rules ·{" "}
                {result.inapplicable.length} inapplicable rules.
              </Text>
              {result.violations.length === 0 && (
                <Callout>
                  No violations detected in this sample under these rules.
                  Review incomplete checks and test manually.
                </Callout>
              )}
              {[
                ...result.violations.map((finding) => ({
                  finding,
                  kind: "Violation",
                })),
                ...result.incomplete.map((finding) => ({
                  finding,
                  kind: "Needs manual review",
                })),
              ].map(({ finding, kind }) => (
                <Card key={`${kind}-${finding.id}`}>
                  <Stack gap="sm">
                    <Heading level={3} size="md">
                      {finding.help}
                    </Heading>
                    <Text as="p" variant="body">
                      {kind} · {finding.impact ?? "No impact rating"} ·{" "}
                      <Code>{finding.id}</Code>
                    </Text>
                    <Text as="p" variant="body">
                      {finding.description}
                    </Text>
                    {finding.nodes.map((node) => (
                      <Box key={JSON.stringify(node.target)}>
                        <Code>{JSON.stringify(node.target)}</Code>
                        <Text as="p" variant="body">
                          {node.failureSummary ?? "Review this node manually."}
                        </Text>
                      </Box>
                    ))}
                    <Link href={finding.helpUrl}>axe rule documentation →</Link>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Stack>
        )}
        <Stack as="section" gap="lg">
          <Heading level={2} size="lg">
            Continue with a keyboard.
          </Heading>
          <Text as="p" variant="body">
            Tab through the panel, identify every control’s name, check the
            visible focus ring, operate controls without a pointer, then repeat
            in your screen reader. Test zoom, high contrast, reduced motion and
            the actual interaction states your product uses. Accessibility is a
            user experience, not a score.
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
}
