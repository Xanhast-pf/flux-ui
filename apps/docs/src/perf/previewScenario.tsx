import { Box } from "@flux-ui/react";
import type { ComponentType } from "react";
import type { ScenarioModule, ScenarioProps } from "./scenario.types.js";

export function createPreviewScenario(
  Preview: ComponentType,
): ScenarioModule["default"] {
  return function PreviewScenario({ count, revision, variant }: ScenarioProps) {
    if (variant !== "flux")
      throw new Error("Representative preview workloads are Flux-only.");
    if (count !== 1)
      throw new Error("Representative preview workloads render exactly once.");

    return (
      <Box data-perf-root data-revision={revision}>
        <Preview />
      </Box>
    );
  };
}
