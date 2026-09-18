import { writeFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
interface ObservationMetrics {
  created: number;
  active: number;
  measuredFrames: number[];
}
declare global {
  interface Window {
    __TABS_METRICS__: ObservationMetrics;
  }
}
test("Tabs measures mount, resize, update and observer cleanup", async ({
  page,
}, testInfo) => {
  await page.addInitScript(() => {
    const metrics: ObservationMetrics = {
      created: 0,
      active: 0,
      measuredFrames: [],
    };
    window.__TABS_METRICS__ = metrics;
    const probed = new WeakSet<Element>();
    const probe = { reads: 0 };
    const NativeObserver = window.ResizeObserver;
    window.ResizeObserver = class extends NativeObserver {
      private live = true;
      constructor(callback: ResizeObserverCallback) {
        super(callback);
        metrics.created++;
        metrics.active++;
      }
      override observe(target: Element, options?: ResizeObserverOptions) {
        if (!probed.has(target)) {
          probed.add(target);
          const rect = target.getBoundingClientRect.bind(target);
          target.getBoundingClientRect = () => {
            probe.reads++;
            return rect();
          };
        }
        super.observe(target, options);
      }
      override disconnect() {
        super.disconnect();
        if (this.live) metrics.active--;
        this.live = false;
      }
    };
    const frame = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (callback) =>
      frame((time) => {
        const before = probe.reads;
        const start = performance.now();
        callback(time);
        if (probe.reads > before)
          metrics.measuredFrames.push(performance.now() - start);
      });
  });
  const samples = [];
  for (let iteration = 0; iteration < 3; iteration++) {
    await page.goto("/?perf=1&scenario=tabs&variant=flux&count=100");
    await page.waitForFunction(() => window.__FLUX_PERF_RESULT__ !== undefined);
    const sample = await page.evaluate(() => ({
      workload: window.__FLUX_PERF_RESULT__,
      observation: window.__TABS_METRICS__,
    }));
    expect(sample.observation.created).toBe(100);
    expect(sample.observation.active).toBe(0);
    expect(sample.observation.measuredFrames.length).toBeGreaterThan(0);
    expect(sample.workload?.mountMs).toBeGreaterThan(0);
    samples.push(sample);
  }
  const output = testInfo.outputPath("tabs-performance.json");
  await writeFile(output, JSON.stringify(samples, null, 2));
  await testInfo.attach("tabs-performance.json", {
    path: output,
    contentType: "application/json",
  });
});
