import {
  Box,
  Button,
  Callout,
  Card,
  Checkbox,
  Field,
  Fieldset,
  Heading,
  Inline,
  Link,
  PageHeader,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
} from "@flux-ui/react";
import { useEffect, useRef, useState } from "react";
import { runLab, type LabReport } from "../lab/runner.js";
import {
  INSTANCE_COUNTS,
  ITERATION_COUNTS,
  METRICS,
} from "../lab/statistics.js";
import { downloadJson } from "../lib/download.js";
import { formatMs, formatRatio } from "../lib/format.js";
import type { PerfScenario } from "../perf/PerfApp.js";
import { ComparisonBars } from "../ui/ComparisonBars.js";
export function LabPage() {
  const [scenario, setScenario] = useState<PerfScenario>("button");
  const [count, setCount] = useState(1000);
  const [iterations, setIterations] = useState(5);
  const [sweep, setSweep] = useState(false);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState(
    "Ready. Nothing runs until you press Start benchmark.",
  );
  const [report, setReport] = useState<LabReport | null>(null);
  const surface = useRef<HTMLDivElement>(null);
  const activeRun = useRef<AbortController | null>(null);
  useEffect(
    () => () => {
      activeRun.current?.abort();
      activeRun.current = null;
    },
    [],
  );
  async function start(): Promise<void> {
    if (activeRun.current !== null || surface.current === null) return;
    const controller = new AbortController();
    activeRun.current = controller;
    const deadline = window.setTimeout(() => {
      controller.abort();
    }, 60000);
    const onVisibility = () => {
      if (document.hidden) controller.abort();
    };
    document.addEventListener("visibilitychange", onVisibility);
    setRunning(true);
    setReport(null);
    try {
      const result = await runLab(
        surface.current,
        { scenario, count, iterations, sweep },
        controller.signal,
        (message) => {
          if (activeRun.current === controller) setMessage(message);
        },
      );
      if (activeRun.current === controller) {
        setReport(result);
        setMessage("Complete. Results describe this browser session only.");
      }
    } catch (error) {
      if (activeRun.current === controller)
        setMessage(
          error instanceof Error ? error.message : "Benchmark failed.",
        );
    } finally {
      window.clearTimeout(deadline);
      document.removeEventListener("visibilitychange", onVisibility);
      if (activeRun.current === controller) {
        activeRun.current = null;
        setRunning(false);
      }
    }
  }
  return (
    <Stack className="reference-page" as="section" gap="lg">
      <Stack gap="lg">
        <PageHeader
          title={<>Live Stress Lab</>}
          eyebrow={<>Measure, don’t assume</>}
        >
          <Text as="p" variant="lead" tone="muted">
            Your device. Real components. An honest native baseline.
          </Text>
        </PageHeader>
        <Callout>
          Opt-in CPU work, capped at 5,000 instances and a 60-second run budget.
          Stop works between synchronous render tasks; a busy task cannot be
          interrupted. Leaving this page or hiding this tab stops the run. No
          results are uploaded.
        </Callout>
        {!import.meta.env.PROD && (
          <Callout tone="warning">
            Development build: timings include development overhead. Use the
            production preview for meaningful measurements.
          </Callout>
        )}
        <Card>
          <Stack gap="md">
            <Fieldset disabled={running}>
              <Fieldset.Legend>Benchmark configuration</Fieldset.Legend>
              <Field.Root controlId="lab-scenario">
                <Field.Label>Scenario</Field.Label>
                <Field.Control>
                  <Select
                    value={scenario}
                    onChange={(event) => {
                      setScenario(
                        event.target.value === "grid" ? "grid" : "button",
                      );
                    }}
                  >
                    <option value="button">
                      Button — interactive primitive
                    </option>
                    <option value="grid">Grid — layout primitive</option>
                  </Select>
                </Field.Control>
              </Field.Root>
              <Field.Root controlId="lab-instances">
                <Field.Label>Instances</Field.Label>
                <Field.Control>
                  <Select
                    value={count}
                    onChange={(event) => {
                      setCount(Number(event.target.value));
                    }}
                  >
                    {INSTANCE_COUNTS.map((value) => (
                      <option value={value} key={value}>
                        {value.toLocaleString()}
                      </option>
                    ))}
                  </Select>
                </Field.Control>
              </Field.Root>
              <Field.Root controlId="lab-samples">
                <Field.Label>Paired samples</Field.Label>
                <Field.Control>
                  <Select
                    value={iterations}
                    onChange={(event) => {
                      setIterations(Number(event.target.value));
                    }}
                  >
                    {ITERATION_COUNTS.map((value) => (
                      <option value={value} key={value}>
                        {value} pairs
                      </option>
                    ))}
                  </Select>
                </Field.Control>
              </Field.Root>

              <Field.Root>
                <Field.Label>Scaling sweep up to this count</Field.Label>
                <Field.Control>
                  <Checkbox
                    checked={sweep}
                    onChange={(event) => {
                      setSweep(event.target.checked);
                    }}
                  />
                </Field.Control>
              </Field.Root>
            </Fieldset>
            <Inline gap="sm" wrap>
              <Button
                disabled={running}
                onClick={() => {
                  void start();
                }}
              >
                Start benchmark
              </Button>
              <Button
                variant="outline"
                tone="neutral"
                disabled={!running}
                onClick={() => {
                  activeRun.current?.abort();
                }}
              >
                Stop benchmark
              </Button>
              {report !== null && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    downloadJson(report, "flux-ui-live-benchmark.json");
                  }}
                >
                  Export raw results
                </Button>
              )}
            </Inline>
            <Text role="status" as="p" variant="body">
              {message}
            </Text>
            <Box
              ref={surface}
              inert
              aria-hidden="true"
              className="lab-surface"
            />
          </Stack>
        </Card>
        {report !== null && (
          <Stack aria-label="Benchmark results" as="section" gap="lg">
            <Stack gap="lg">
              <Heading level={2} size="lg">
                Measured here, not promised everywhere.
              </Heading>
              <Text as="p" variant="body" tone="muted">
                {report.methodology} Measured{" "}
                {new Date(report.measuredAt).toLocaleString()}.
              </Text>
              {report.summaries.map((summary) => (
                <Card key={summary.count}>
                  <Stack gap="md">
                    <Heading level={3} size="md">
                      {summary.scenario} × {summary.count.toLocaleString()}
                    </Heading>
                    <ComparisonBars
                      label="Median synchronous mount · lower is less work"
                      native={summary.metrics.mountMs.native}
                      flux={summary.metrics.mountMs.flux}
                    />
                    <ScrollArea
                      aria-label={`Results at ${summary.count} instances`}
                      axis="horizontal"
                    >
                      <Table.Root>
                        <Table.Caption>
                          Paired medians; range is the observed Flux min–max,
                          not a confidence interval
                        </Table.Caption>
                        <Table.Header>
                          <Table.Row>
                            <Table.ColumnHeader>Work</Table.ColumnHeader>
                            <Table.ColumnHeader>Native</Table.ColumnHeader>
                            <Table.ColumnHeader>Flux</Table.ColumnHeader>
                            <Table.ColumnHeader>
                              Paired delta
                            </Table.ColumnHeader>
                            <Table.ColumnHeader>
                              Flux / native
                            </Table.ColumnHeader>
                            <Table.ColumnHeader>Flux range</Table.ColumnHeader>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {METRICS.map((metric) => {
                            const value = summary.metrics[metric];
                            return (
                              <Table.Row key={metric}>
                                <Table.RowHeader>
                                  {metric.replace("Ms", "")}
                                </Table.RowHeader>
                                <Table.Cell>
                                  {formatMs(value.native)}
                                </Table.Cell>
                                <Table.Cell>{formatMs(value.flux)}</Table.Cell>
                                <Table.Cell>{formatMs(value.delta)}</Table.Cell>
                                <Table.Cell>
                                  {value.ratio === null
                                    ? "Below timer resolution"
                                    : formatRatio(value.ratio)}
                                </Table.Cell>
                                <Table.Cell>
                                  {formatMs(value.minimum)}–
                                  {formatMs(value.maximum)}
                                </Table.Cell>
                              </Table.Row>
                            );
                          })}
                        </Table.Body>
                      </Table.Root>
                    </ScrollArea>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Stack>
        )}
        <Stack as="section" gap="lg">
          <Heading level={2} size="lg">
            What the lab does—and doesn’t—measure.
          </Heading>
          <Text as="p" variant="body">
            One warm-up is discarded for each variant and count. Fresh frames
            run the same production harness as CI, alternating native-first and
            Flux-first pairs. React performs both implementations. Button
            matches the styled native wrapper; Grid matches native layout. Two
            scenarios are not the whole library. Next-frame timing is not paint
            time. Power saving, other tabs, extensions, temperature, viewport
            and browser all affect results.
          </Text>
          <Text as="p" variant="body">
            <Link href="#performance">Inspect the committed CI baseline →</Link>
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
}
