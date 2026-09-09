import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { Button, Grid } from "@flux-ui/react";

export type PerfScenario = "button" | "grid";
export type PerfVariant = "raw" | "native" | "flux";

const DEFAULT_PERF_INSTANCE_COUNT = 1_000;
const MIN_PERF_INSTANCE_COUNT = 1;
const MAX_PERF_INSTANCE_COUNT = 20_000;

export interface PerfResult {
  scenario: PerfScenario;
  variant: PerfVariant;
  count: number;

  /**
   * Synchronous React + DOM work required to mount the scenario.
   */
  mountMs: number;

  /**
   * Total time from starting the mount until the browser reaches
   * the next rendering frame.
   */
  mountToFrameMs: number;

  /**
   * Synchronous React + DOM work required to update the scenario.
   */
  updateMs: number;

  /**
   * Total time from starting the update until the browser reaches
   * the next rendering frame.
   */
  updateToFrameMs: number;

  /**
   * Synchronous React + DOM work required to unmount the scenario.
   */
  unmountMs: number;

  domNodes: number;
}

declare global {
  interface Window {
    __FLUX_PERF_RESULT__?: PerfResult;
  }
}

function getConfig(): {
  scenario: PerfScenario;
  variant: PerfVariant;
  count: number;
} {
  const params = new URLSearchParams(window.location.search);
  const scenario = params.get("scenario");
  const variant = params.get("variant");

  const parsedCount = Number(
    params.get("count") ?? String(DEFAULT_PERF_INSTANCE_COUNT),
  );

  if (scenario !== "button" && scenario !== "grid") {
    throw new Error(`Unknown perf scenario: ${scenario ?? "missing"}`);
  }

  if (variant !== "raw" && variant !== "native" && variant !== "flux") {
    throw new Error(`Unknown perf variant: ${variant ?? "missing"}`);
  }

  if (
    !Number.isInteger(parsedCount) ||
    parsedCount < MIN_PERF_INSTANCE_COUNT ||
    parsedCount > MAX_PERF_INSTANCE_COUNT
  ) {
    throw new Error(`Invalid perf count: ${parsedCount}`);
  }

  return {
    scenario,
    variant,
    count: parsedCount,
  };
}

function ButtonScenario({
  count,
  revision,
  variant,
}: {
  count: number;
  revision: number;
  variant: PerfVariant;
}) {
  const ids = Array.from({ length: count }, (_, index) => `button-${index}`);
  const suffix = revision === 0 ? "A" : "B";

  return (
    <div data-perf-root>
      {ids.map((id, index) => {
        const label = `Button ${index} ${suffix}`;

        if (variant === "flux") {
          return <Button key={id}>{label}</Button>;
        }

        if (variant === "native") {
          return (
            <button className="perf-native-button" key={id} type="button">
              <span className="perf-native-button-content">{label}</span>
            </button>
          );
        }

        return <button key={id}>{label}</button>;
      })}
    </div>
  );
}

function GridScenario({
  count,
  revision,
  variant,
}: {
  count: number;
  revision: number;
  variant: PerfVariant;
}) {
  const ids = Array.from({ length: count }, (_, index) => `grid-${index}`);
  const columns = revision === 0 ? 4 : 5;

  const children = ids.map((id, index) => <div key={id}>Item {index}</div>);

  if (variant === "flux") {
    return (
      <Grid columns={columns} gap="lg" data-perf-root>
        {children}
      </Grid>
    );
  }

  if (variant === "native") {
    return (
      <div
        data-perf-root
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: "var(--flux-space-4)",
        }}
      >
        {children}
      </div>
    );
  }

  return <div data-perf-root>{children}</div>;
}

function Scenario({
  count,
  revision,
  scenario,
  variant,
}: {
  count: number;
  revision: number;
  scenario: PerfScenario;
  variant: PerfVariant;
}) {
  return scenario === "button" ? (
    <ButtonScenario count={count} revision={revision} variant={variant} />
  ) : (
    <GridScenario count={count} revision={revision} variant={variant} />
  );
}

/**
 * Wait until the browser reaches the next rendering frame.
 *
 * This deliberately isn't called "paint": requestAnimationFrame runs
 * immediately before the browser paints, so "frame" is the accurate term.
 */
function nextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

export async function runPerfHarness(rootElement: HTMLElement): Promise<void> {
  const { scenario, variant, count } = getConfig();

  delete window.__FLUX_PERF_RESULT__;

  const root = createRoot(rootElement);

  // Give startup/JIT/layout work a couple of frames to settle before measuring.
  await nextFrame();
  await nextFrame();

  /*
   * Mount
   */
  let startedAt = performance.now();

  flushSync(() => {
    root.render(
      <Scenario
        count={count}
        revision={0}
        scenario={scenario}
        variant={variant}
      />,
    );
  });

  const mountMs = performance.now() - startedAt;

  await nextFrame();

  const mountToFrameMs = performance.now() - startedAt;

  const domNodes = document.querySelectorAll("[data-perf-root] *").length;

  /*
   * Update
   */
  startedAt = performance.now();

  flushSync(() => {
    root.render(
      <Scenario
        count={count}
        revision={1}
        scenario={scenario}
        variant={variant}
      />,
    );
  });

  const updateMs = performance.now() - startedAt;

  await nextFrame();

  const updateToFrameMs = performance.now() - startedAt;

  /*
   * Unmount
   */
  startedAt = performance.now();

  flushSync(() => {
    root.unmount();
  });

  const unmountMs = performance.now() - startedAt;

  window.__FLUX_PERF_RESULT__ = {
    scenario,
    variant,
    count,
    mountMs,
    mountToFrameMs,
    updateMs,
    updateToFrameMs,
    unmountMs,
    domNodes,
  };
}
