import { Grid } from "@flux-ui/react";
import type { PerfVariant } from "../scenario.types.js";
export default function GridScenario({
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
          gap: "var(--flux-space-6)",
        }}
      >
        {children}
      </div>
    );
  }

  return <div data-perf-root>{children}</div>;
}
