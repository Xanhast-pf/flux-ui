import { Button, Callout, Card, Inline, Stack, Table } from "@flux-ui/react";
import { useEffect, useRef, useState } from "react";
import {
  INSTANCE_COUNTS,
  ITERATION_COUNTS,
  METRICS,
} from "../lab/statistics.js";
import { runLab, type LabReport } from "../lab/runner.js";
import type { PerfScenario } from "../perf/PerfApp.js";
import { formatMs, formatRatio } from "../lib/format.js";
import { downloadJson } from "../lib/download.js";
import { ComparisonBars } from "../ui/ComparisonBars.js";

export function LabPage() {
  const [scenario, setScenario] = useState<PerfScenario>("button");
  const [count, setCount] = useState(1_000);
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
    }, 60_000);
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
    <section className="reference-page">
      <Stack gap="lg">
        <header className="page-intro">
          <p className="eyebrow">Measure, don’t assume</p>
          <h1>Live Stress Lab</h1>
          <p className="lede">
            Your device. Real components. An honest native baseline.
          </p>
        </header>
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
            <fieldset className="lab-controls" disabled={running}>
              <legend>Benchmark configuration</legend>
              <label htmlFor="lab-scenario">Scenario</label>
              <select
                id="lab-scenario"
                value={scenario}
                onChange={(event) => {
                  setScenario(
                    event.target.value === "grid" ? "grid" : "button",
                  );
                }}
              >
                <option value="button">Button — interactive primitive</option>
                <option value="grid">Grid — layout primitive</option>
              </select>
              <label htmlFor="lab-instances">Instances</label>
              <select
                id="lab-instances"
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
              </select>
              <label htmlFor="lab-samples">Paired samples</label>
              <select
                id="lab-samples"
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
              </select>

              <label className="lab-check">
                <input
                  type="checkbox"
                  checked={sweep}
                  onChange={(event) => {
                    setSweep(event.target.checked);
                  }}
                />
                Scaling sweep up to this count
              </label>
            </fieldset>
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
            <p role="status">{message}</p>
            <div
              className="lab-surface"
              ref={surface}
              inert
              aria-hidden="true"
            />
          </Stack>
        </Card>
        {report !== null && (
          <section aria-label="Benchmark results">
            <Stack gap="lg">
              <h2>Measured here, not promised everywhere.</h2>
              <p className="muted">
                {report.methodology} Measured{" "}
                {new Date(report.measuredAt).toLocaleString()}.
              </p>
              {report.summaries.map((summary) => (
                <Card key={summary.count}>
                  <Stack gap="md">
                    <h3>
                      {summary.scenario} × {summary.count.toLocaleString()}
                    </h3>
                    <ComparisonBars
                      label="Median synchronous mount · lower is less work"
                      native={summary.metrics.mountMs.native}
                      flux={summary.metrics.mountMs.flux}
                    />
                    <div
                      className="table-scroll"
                      role="region"
                      aria-label={`Results at ${summary.count} instances`}
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
                    </div>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </section>
        )}
        <section>
          <h2>What the lab does—and doesn’t—measure.</h2>
          <p>
            One warm-up is discarded for each variant and count. Fresh frames
            run the same production harness as CI, alternating native-first and
            Flux-first pairs. React performs both implementations. Button
            matches the styled native wrapper; Grid matches native layout. Two
            scenarios are not the whole library. Next-frame timing is not paint
            time. Power saving, other tabs, extensions, temperature, viewport
            and browser all affect results.
          </p>
          <p>
            <a href="#performance">Inspect the committed CI baseline →</a>
          </p>
        </section>
      </Stack>
    </section>
  );
}
