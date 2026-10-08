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
  ITERATION_COUNTS,
  METRICS,
  workUnitOptions,
} from "../lab/statistics.js";
import { downloadJson } from "../lib/download.js";
import { formatMs, formatRatio } from "../lib/format.js";
import type { PerfScenario } from "../perf/scenario.types.js";
import { getScenario, scenarioCatalog } from "../perf/registry.js";
import { ComparisonBars } from "../ui/ComparisonBars.js";

const DEFAULT_SCENARIO: PerfScenario = "button";
const DEFAULT_WORK_UNITS = 1_000;

function scenarioFromHash(): PerfScenario {
  const query = window.location.hash.split("?", 2)[1] ?? "";
  const requested = new URLSearchParams(query).get("scenario");
  return (
    scenarioCatalog.find((entry) => entry.id === requested)?.id ??
    DEFAULT_SCENARIO
  );
}

function supportedWorkUnits(count: number, maxCount: number): number {
  const options = workUnitOptions(maxCount);
  return (
    options.filter((value) => value <= count).at(-1) ?? options[0] ?? maxCount
  );
}

export function LabPage() {
  const [scenario, setScenario] = useState<PerfScenario>(scenarioFromHash);
  const definition = getScenario(scenario);
  const [count, setCount] = useState(() => {
    const initial = getScenario(scenarioFromHash());
    return supportedWorkUnits(DEFAULT_WORK_UNITS, initial.maxCount);
  });
  const [iterations, setIterations] = useState(5);
  const [sweep, setSweep] = useState(false);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("Ready. Select Start benchmark.");
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
  function invalidateResult(): void {
    setReport(null);
    setMessage("Settings changed. Run again.");
  }
  async function start(): Promise<void> {
    if (activeRun.current !== null || surface.current === null) return;
    const controller = new AbortController();
    activeRun.current = controller;
    const deadline = window.setTimeout(() => {
      controller.abort(new Error("60-second limit reached. Try less work."));
    }, 60000);
    const onVisibility = () => {
      if (document.hidden)
        controller.abort(
          new Error("Benchmark stopped. Keep this tab visible."),
        );
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
        setMessage("Complete. Results are local to this browser.");
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
          eyebrow={<>Local performance tests</>}
        >
          <Text as="p" variant="lead" tone="muted">
            Measure component workloads in your browser.
          </Text>
        </PageHeader>
        <Callout>
          Tests run locally for up to 60 seconds. Stop takes effect between
          tasks. Hiding the tab or leaving stops the test. Nothing is uploaded.
        </Callout>
        {!import.meta.env.PROD && (
          <Callout tone="warning">
            Development mode affects timing. Use a production build.
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
                      const next = getScenario(event.currentTarget.value);
                      setScenario(next.id);
                      setCount((current) =>
                        supportedWorkUnits(current, next.maxCount),
                      );
                      if (workUnitOptions(next.maxCount).length === 1)
                        setSweep(false);
                      invalidateResult();
                    }}
                  >
                    {scenarioCatalog.map((entry) => (
                      <option key={entry.id} value={entry.id}>
                        {entry.label} ·{" "}
                        {entry.kind === "comparison"
                          ? "matched reference"
                          : entry.source === "preview"
                            ? "representative preview"
                            : "Flux workload"}
                      </option>
                    ))}
                  </Select>
                </Field.Control>
              </Field.Root>
              <Text tone="muted">
                {definition.description} Each work unit means {definition.unit}.{" "}
                {definition.source === "preview"
                  ? "Preview workloads measure the full example, not an isolated component. "
                  : ""}
                Fixture revision {definition.fixtureRevision}.
              </Text>
              <Field.Root controlId="lab-instances">
                <Field.Label>Work units</Field.Label>
                <Field.Control>
                  <Select
                    value={count}
                    onChange={(event) => {
                      setCount(Number(event.target.value));
                      invalidateResult();
                    }}
                  >
                    {workUnitOptions(definition.maxCount).map((value) => (
                      <option value={value} key={value}>
                        {value.toLocaleString()}
                      </option>
                    ))}
                  </Select>
                </Field.Control>
              </Field.Root>
              <Field.Root controlId="lab-samples">
                <Field.Label>
                  {definition.kind === "comparison"
                    ? "Paired samples"
                    : "Samples"}
                </Field.Label>
                <Field.Control>
                  <Select
                    value={iterations}
                    onChange={(event) => {
                      setIterations(Number(event.target.value));
                      invalidateResult();
                    }}
                  >
                    {ITERATION_COUNTS.map((value) => (
                      <option value={value} key={value}>
                        {value}{" "}
                        {definition.kind === "comparison" ? "pairs" : "samples"}
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
                    disabled={workUnitOptions(definition.maxCount).length === 1}
                    onChange={(event) => {
                      setSweep(event.target.checked);
                      invalidateResult();
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
                  activeRun.current?.abort(new Error("Benchmark stopped."));
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
                Local results
              </Heading>
              <Text as="p" variant="body" tone="muted">
                {report.methodology} Measured{" "}
                {new Date(report.measuredAt).toLocaleString()}.
              </Text>
              {report.workloads.map((summary) => (
                <Card key={summary.count}>
                  <Stack gap="md">
                    <Heading level={3} size="md">
                      {report.definition.label} ×{" "}
                      {summary.count.toLocaleString()} {report.definition.unit}
                    </Heading>
                    <Text tone="muted">
                      Flux only · {summary.domNodes.toLocaleString()} DOM nodes
                      · No native comparison.
                    </Text>
                    <Table.Root>
                      <Table.Caption>
                        Observed synchronous work, not paint or input latency
                      </Table.Caption>
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeader>Work</Table.ColumnHeader>
                          <Table.ColumnHeader>Median</Table.ColumnHeader>
                          <Table.ColumnHeader>
                            Observed range
                          </Table.ColumnHeader>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {METRICS.map((metric) => (
                          <Table.Row key={metric}>
                            <Table.RowHeader>
                              {metric.replace("Ms", "")}
                            </Table.RowHeader>
                            <Table.Cell>
                              {formatMs(summary.metrics[metric].median)}
                            </Table.Cell>
                            <Table.Cell>
                              {formatMs(summary.metrics[metric].minimum)}–
                              {formatMs(summary.metrics[metric].maximum)}
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Root>
                  </Stack>
                </Card>
              ))}
              {report.summaries.map((summary) => (
                <Card key={summary.count}>
                  <Stack gap="md">
                    <Heading level={3} size="md">
                      {report.definition.label} ×{" "}
                      {summary.count.toLocaleString()} {report.definition.unit}
                    </Heading>
                    <ComparisonBars
                      label="Median synchronous mount · lower is less work"
                      native={summary.metrics.mountMs.native}
                      flux={summary.metrics.mountMs.flux}
                    />
                    <ScrollArea
                      aria-label={`Results at ${summary.count} ${report.definition.unit}`}
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
            Measurement limits
          </Heading>
          <Text as="p" variant="body">
            Button and Grid use matched native references. Other tests measure
            Flux workloads or example previews. Results vary by browser and
            device. Input latency, memory, and paint are not measured here.
          </Text>
          <Text as="p" variant="body">
            <Link href={`#performance?component=${definition.id}`}>
              {definition.kind === "comparison"
                ? `Inspect the committed baseline for ${definition.label} →`
                : `Inspect ${definition.label} runtime evidence →`}
            </Link>
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
}
