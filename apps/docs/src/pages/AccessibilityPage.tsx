import {
  Button,
  Callout,
  Card,
  Field,
  Input,
  Inline,
  Stack,
} from "@flux-ui/react";
import { useEffect, useRef, useState } from "react";
import type { AxeResults } from "axe-core";
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
    <section className="reference-page">
      <Stack gap="lg">
        <header className="page-intro">
          <p className="eyebrow">Accessibility you can inspect</p>
          <h1>Run a real accessibility scan.</h1>
          <p className="lede">
            A working demo. A real axe engine. Findings you can reproduce.
          </p>
        </header>
        <Callout>
          Scans run locally on the sample below, not the whole site or your
          application. Zero detected violations is not WCAG compliance. Manual
          keyboard, screen-reader and interaction testing still matters.
        </Callout>
        <Card>
          <Stack gap="md">
            <section
              ref={sample}
              className="axe-sample"
              aria-labelledby="axe-sample-title"
            >
              <Stack gap="md">
                <h2 id="axe-sample-title">A small settings panel</h2>
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
                    <span aria-hidden="true">+</span>
                  </Button>
                </Inline>
              </Stack>
            </section>
            <label className="lab-check">
              <input
                type="checkbox"
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
              Introduce an intentional missing button name
            </label>
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
            <p role="status">{message}</p>
          </Stack>
        </Card>
        {result !== null && (
          <section aria-label="Accessibility scan results">
            <Stack gap="md">
              <h2>What axe found</h2>
              <p>
                axe-core {result.testEngine.version} ·{" "}
                {new Date(result.timestamp).toLocaleString()} ·{" "}
                {result.passes.length} passing rules ·{" "}
                {result.inapplicable.length} inapplicable rules.
              </p>
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
                    <h3>{finding.help}</h3>
                    <p>
                      {kind} · {finding.impact ?? "No impact rating"} ·{" "}
                      <code>{finding.id}</code>
                    </p>
                    <p>{finding.description}</p>
                    {finding.nodes.map((node) => (
                      <div key={JSON.stringify(node.target)}>
                        <code>{JSON.stringify(node.target)}</code>
                        <p>
                          {node.failureSummary ?? "Review this node manually."}
                        </p>
                      </div>
                    ))}
                    <a href={finding.helpUrl}>axe rule documentation →</a>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </section>
        )}
        <section>
          <h2>Continue with a keyboard.</h2>
          <p>
            Tab through the panel, identify every control’s name, check the
            visible focus ring, operate controls without a pointer, then repeat
            in your screen reader. Test zoom, high contrast, reduced motion and
            the actual interaction states your product uses. Accessibility is a
            user experience, not a score.
          </p>
        </section>
      </Stack>
    </section>
  );
}
