import { Callout } from "@flux-ui/react";
import { health } from "../generated/health.js";
function isPending(value: number | null): boolean {
  return value === null;
}
export function MeasurementNotice() {
  const pending = health.size.components.filter((entry) =>
    isPending(entry.brotli),
  ).length;
  return (
    <Callout tone={pending > 0 ? "warning" : "info"}>
      {pending > 0
        ? `${pending} components await their first production measurement. Aggregate numbers still describe the last measured build, not the expanded catalog.`
        : "These are committed build measurements, not a live CI result. The Actions link shows the current workflow status."}
    </Callout>
  );
}
