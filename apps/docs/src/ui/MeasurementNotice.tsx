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
        ? `${pending} components await size baselines. Totals reflect the last measured build.`
        : "Saved size baselines, not live CI data."}{" "}
      <Link href={`${REPOSITORY_URL}/actions`}>View CI runs</Link>
    </Callout>
  );
}
