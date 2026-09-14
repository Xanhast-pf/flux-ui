import { basename } from "node:path";
import { reportProgress, reportSummary } from "./progress.mjs";
export default class FluxBrowserReporter {
  onBegin(_config, suite) {
    this.suite = suite;
    this.total = suite.allTests().length;
    this.completed = new Set();
  }
  onTestBegin(test) {
    reportProgress({
      current: this.completed?.size,
      total: this.total,
      unit: process.env.FLUX_PERF_MODE ? "cases" : "tests",
      item: `${test.parent?.project()?.name || "browser"} · ${basename(test.location.file)} · ${test.title}`,
    });
  }
  onTestEnd(test) {
    this.completed.add(test.id);
    this.onTestBegin(test);
  }
  onEnd(result) {
    const counts = {};
    for (const test of this.suite.allTests()) {
      const outcome = test.outcome();
      counts[outcome] = (counts[outcome] || 0) + 1;
    }
    reportSummary(
      `Browser ${result.status}: ${Object.entries(counts)
        .map(([state, count]) => `${count} ${state}`)
        .join(" · ")}`,
    );
  }
}
