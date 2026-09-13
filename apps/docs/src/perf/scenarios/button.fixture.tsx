import { Button } from "@flux-ui/react";
import type { PerfVariant } from "../scenario.types.js";
export default function ButtonScenario({
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
