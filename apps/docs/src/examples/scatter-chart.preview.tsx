import { ScatterChart } from "@flux-ui/react";

export default function Example() {
  return (
    <ScatterChart
      label="Latency vs payload"
      description="Source points stay keyboard inspectable while SVG rendering stays bounded."
      series={[
        {
          id: "api",
          label: "API",
          data: [
            { x: 12, y: 82 },
            { x: 24, y: 105 },
            { x: 48, y: 141 },
            { x: 96, y: 218 },
          ],
        },
        {
          id: "worker",
          label: "Worker",
          tone: "success",
          data: [
            { x: 10, y: 55 },
            { x: 28, y: 78 },
            { x: 52, y: 97 },
            { x: 100, y: 132 },
          ],
        },
      ]}
    />
  );
}
