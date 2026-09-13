import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { getScenario, loadScenario } from "./registry.js";
import type { PerfScenario, PerfVariant } from "./scenario.types.js";
export type { PerfVariant } from "./scenario.types.js";

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
  fixtureRevision?: number;
  unit?: string;
  layout?: Record<string, string>;
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

  if (scenario === null) throw new Error("Missing performance scenario.");
  const definition = getScenario(scenario);

  if (variant !== "raw" && variant !== "native" && variant !== "flux") {
    throw new Error(`Unknown perf variant: ${variant ?? "missing"}`);
  }

  if (
    !Number.isInteger(parsedCount) ||
    parsedCount < MIN_PERF_INSTANCE_COUNT ||
    parsedCount > Math.min(MAX_PERF_INSTANCE_COUNT, definition.maxCount)
  ) {
    throw new Error(`Invalid perf count: ${parsedCount}`);
  }

  if (definition.kind === "workload" && variant !== "flux")
    throw new Error("This workload has no equivalent native reference.");
  return {
    scenario: definition.id,
    variant,
    count: parsedCount,
  };
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

  // Lazy module loading is outside measured React work. Workload-owned transforms remain inside it.
  const Scenario = await loadScenario(scenario);
  const definition = getScenario(scenario);
  const root = createRoot(rootElement);

  // Give startup/JIT/layout work a couple of frames to settle before measuring.
  await nextFrame();
  await nextFrame();

  /*
   * Mount
   */
  let startedAt = performance.now();

  flushSync(() => {
    root.render(<Scenario count={count} revision={0} variant={variant} />);
  });

  const mountMs = performance.now() - startedAt;

  await nextFrame();

  const mountToFrameMs = performance.now() - startedAt;

  const domNodes = document.querySelectorAll("[data-perf-root] *").length;
  const measuredRoot = document.querySelector<HTMLElement>(
    scenario === "button" ? "[data-perf-root] button" : "[data-perf-root]",
  );
  const layout: Record<string, string> = {};
  if (measuredRoot) {
    const computed = getComputedStyle(measuredRoot);
    for (const key of [
      "display",
      "column-gap",
      "row-gap",
      "grid-template-columns",
      "font-size",
      "font-weight",
      "line-height",
      "min-height",
      "padding-inline-start",
      "padding-inline-end",
    ])
      layout[key] = computed.getPropertyValue(key);
  }

  /*
   * Update
   */
  startedAt = performance.now();

  flushSync(() => {
    root.render(<Scenario count={count} revision={1} variant={variant} />);
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
    fixtureRevision: definition.fixtureRevision,
    unit: definition.unit,
    layout,
  };
}
