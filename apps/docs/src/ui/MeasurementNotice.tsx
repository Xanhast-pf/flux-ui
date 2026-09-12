import { Callout, Link } from "@flux-ui/react";
import { health } from "../generated/health.js";
import { REPOSITORY_URL } from "../lib/format.js";
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
        : "Committed build measurements, not a live CI result."}{" "}
      <Link href={`${REPOSITORY_URL}/actions`}>View CI runs</Link>
    </Callout>
  );
}
