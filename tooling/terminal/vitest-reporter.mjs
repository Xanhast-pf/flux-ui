import { basename } from "node:path";
import { reportProgress, reportSummary } from "./progress.mjs";
export default class FluxReporter {
  onTestRunStart(specifications) {
    this.total = specifications.length;
    this.completed = 0;
  }
  onTestModuleStart(module) {
    reportProgress({
      current: this.completed,
      total: this.total,
      unit: "files",
      item: basename(module.moduleId),
    });
  }
  onTestModuleEnd(module) {
    this.completed = (this.completed || 0) + 1;
    reportProgress({
      current: this.completed,
      total: this.total,
      unit: "files",
      item: basename(module.moduleId),
    });
  }
  onUserConsoleLog(log) {
    if (log.type === "stderr") reportSummary(log.content);
  }
  onTestRunEnd(modules) {
    const counts = {};
    for (const module of modules) {
      for (const test of module.children.allTests()) {
        const state = test.result().state;
        counts[state] = (counts[state] || 0) + 1;
      }
    }
    // stderr is retained on successful captured runs, including skipped counts.
    reportSummary(
      `Tests: ${Object.entries(counts)
        .map(([state, count]) => `${count} ${state}`)
        .join(" · ")}`,
    );
  }
}
